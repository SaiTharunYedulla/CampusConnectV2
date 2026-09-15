import crypto from 'crypto';
import prisma from '@/database/prisma';
import { uploadToStorage } from '@/config';
import { hashPassword, comparePassword } from '@/utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '@/types';
import { UserRole, UserStatus } from '@prisma/client';

// ── Helpers ───────────────────────────────────────────────────────────────────
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function buildTokenPayload(userId: string, role: string, status: string) {
  return { userId, role, status };
}

async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
}

// ── Student Registration ───────────────────────────────────────────────────────
export async function registerStudent(data: {
  email:        string;
  password:     string;
  firstName:    string;
  lastName:     string;
  username:     string;
  documentType: string;
  file:         Express.Multer.File;
}) {
  // Check uniqueness
  const [existingEmail, existingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.student.findUnique({ where: { username: data.username } }),
  ]);
  if (existingEmail)    throw new ConflictError('An account with this email already exists');
  if (existingUsername) throw new ConflictError('This username is already taken');

  const passwordHash = await hashPassword(data.password);

  // Transaction: create user + student + verification document
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: data.email, passwordHash, role: UserRole.STUDENT, status: UserStatus.PENDING },
    });

    const student = await tx.student.create({
      data: {
        userId:    user.id,
        username:  data.username,
        firstName: data.firstName,
        lastName:  data.lastName,
      },
    });

    // Upload proof to storage
    const storageKey = `verification/${user.id}/${Date.now()}-${data.file.originalname}`;
    await uploadToStorage(storageKey, data.file.buffer, data.file.mimetype);

    await tx.accountVerificationDocument.create({
      data: {
        userId:       user.id,
        documentType: data.documentType,
        fileName:     data.file.originalname,
        fileType:     data.file.mimetype,
        fileSize:     BigInt(data.file.size),
        storageKey,
      },
    });

    return { userId: user.id, studentId: student.id };
  });

  return result;
}

// ── Teacher Registration ───────────────────────────────────────────────────────
export async function registerTeacher(data: {
  email:        string;
  password:     string;
  firstName:    string;
  lastName:     string;
  username:     string;
  documentType: string;
  designation?: string;
  employeeId?:  string;
  expertise?:   string;
  file:         Express.Multer.File;
}) {
  const [existingEmail, existingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.teacher.findUnique({ where: { username: data.username } }),
  ]);
  if (existingEmail)    throw new ConflictError('An account with this email already exists');
  if (existingUsername) throw new ConflictError('This username is already taken');

  if (data.employeeId) {
    const existingEmpId = await prisma.teacher.findUnique({ where: { employeeId: data.employeeId } });
    if (existingEmpId) throw new ConflictError('This employee ID is already registered');
  }

  const passwordHash = await hashPassword(data.password);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: data.email, passwordHash, role: UserRole.TEACHER, status: UserStatus.PENDING },
    });

    await tx.teacher.create({
      data: {
        userId:      user.id,
        username:    data.username,
        firstName:   data.firstName,
        lastName:    data.lastName,
        designation: data.designation,
        employeeId:  data.employeeId,
        expertise:   data.expertise,
      },
    });

    const storageKey = `verification/${user.id}/${Date.now()}-${data.file.originalname}`;
    await uploadToStorage(storageKey, data.file.buffer, data.file.mimetype);

    await tx.accountVerificationDocument.create({
      data: {
        userId:       user.id,
        documentType: data.documentType,
        fileName:     data.file.originalname,
        fileType:     data.file.mimetype,
        fileSize:     BigInt(data.file.size),
        storageKey,
      },
    });
  });
}

// ── Login ──────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where:   { email },
    include: {
      student: { include: { department: true } },
      teacher: { include: { department: true } },
    },
  });

  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  // Status gate
  if (user.status === UserStatus.PENDING)   throw new ForbiddenError('Your account is awaiting administrator approval.');
  if (user.status === UserStatus.REJECTED)  throw new ForbiddenError('Your account registration was rejected. Please contact support.');
  if (user.status === UserStatus.SUSPENDED) throw new ForbiddenError('Your account has been suspended. Please contact support.');

  const payload      = buildTokenPayload(user.id, user.role, user.status);
  const accessToken  = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(user.id, refreshToken);

  // Build profile
  const profile = user.student
    ? {
        id:           user.student.id,
        username:     user.student.username,
        firstName:    user.student.firstName,
        lastName:     user.student.lastName,
        profilePhoto: user.student.profilePhoto,
        department:   user.student.department,
        academicYear: user.student.academicYear,
      }
    : user.teacher
    ? {
        id:           user.teacher.id,
        username:     user.teacher.username,
        firstName:    user.teacher.firstName,
        lastName:     user.teacher.lastName,
        profilePhoto: user.teacher.profilePhoto,
        department:   user.teacher.department,
        designation:  user.teacher.designation,
      }
    : null;

  return {
    accessToken,
    refreshToken,
    user: {
      id:      user.id,
      email:   user.email,
      role:    user.role,
      status:  user.status,
      profile,
    },
  };
}

// ── Refresh Token ──────────────────────────────────────────────────────────────
export async function refreshTokens(token: string) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const tokenHash = hashToken(token);
  const stored    = await prisma.refreshToken.findFirst({
    where: { tokenHash, userId: payload.userId },
  });

  if (!stored)                   throw new UnauthorizedError('Refresh token not found');
  if (stored.revokedAt)          throw new UnauthorizedError('Refresh token has been revoked');
  if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data:  { revokedAt: new Date() },
  });

  const newPayload      = buildTokenPayload(payload.userId, payload.role, payload.status);
  const newAccessToken  = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  await storeRefreshToken(payload.userId, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout(userId: string, refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { userId, tokenHash, revokedAt: null },
    data:  { revokedAt: new Date() },
  });
}

// ── Change Password ────────────────────────────────────────────────────────────
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError();

  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) throw new BadRequestError('Current password is incorrect');

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

  // Revoke all refresh tokens on password change
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data:  { revokedAt: new Date() },
  });
}
