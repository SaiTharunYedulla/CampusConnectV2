import prisma from '@/database/prisma';
import { UserStatus, Prisma, UserRole } from '@prisma/client';
import { BadRequestError, NotFoundError } from '@/types';
import { getSignedUrl } from '@/config';

// ── Dashboard ─────────────────────────────────────────────────────────────────
export async function getDashboard() {
  const [
    studentsTotal, studentsPending, studentsActive, studentsRejected,
    teachersTotal, teachersPending, teachersActive, teachersRejected,
    deptsTotal, deptsActive,
    postsPending, postsApproved,
  ] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.STUDENT } }),
    prisma.user.count({ where: { role: UserRole.STUDENT, status: UserStatus.PENDING } }),
    prisma.user.count({ where: { role: UserRole.STUDENT, status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { role: UserRole.STUDENT, status: UserStatus.REJECTED } }),
    prisma.user.count({ where: { role: UserRole.TEACHER } }),
    prisma.user.count({ where: { role: UserRole.TEACHER, status: UserStatus.PENDING } }),
    prisma.user.count({ where: { role: UserRole.TEACHER, status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { role: UserRole.TEACHER, status: UserStatus.REJECTED } }),
    prisma.department.count(),
    prisma.department.count({ where: { isActive: true } }),
    prisma.post.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.post.count({ where: { status: 'APPROVED' } }),
  ]);

  return {
    students:    { total: studentsTotal, pending: studentsPending, active: studentsActive, rejected: studentsRejected },
    teachers:    { total: teachersTotal, pending: teachersPending, active: teachersActive, rejected: teachersRejected },
    departments: { total: deptsTotal, active: deptsActive },
    posts:       { pending: postsPending, approved: postsApproved },
  };
}

// ── Students ──────────────────────────────────────────────────────────────────
export async function listStudents(params: {
  page: number; limit: number; search?: string;
  status?: UserStatus; departmentId?: string;
}) {
  const { page, limit, search, status, departmentId } = params;

  const where: Prisma.StudentWhereInput = {
    user: {
      ...(status && { status }),
    },
    ...(departmentId && { departmentId }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { username:  { contains: search, mode: 'insensitive' } },
        { user:      { email: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        user:       { select: { id: true, email: true, status: true, createdAt: true } },
        department: { select: { code: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.student.count({ where }),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getStudentDetail(studentId: string) {
  const student = await prisma.student.findUnique({
    where:   { id: studentId },
    include: {
      user: {
        include: {
          verificationDocuments: true,
        },
      },
      department: true,
    },
  });
  if (!student) throw new NotFoundError('Student not found');

  // Generate signed URLs for proof documents
  const docs = await Promise.all(
    student.user.verificationDocuments.map(async (doc) => ({
      ...doc,
      fileSize:  doc.fileSize.toString(),
      signedUrl: await getSignedUrl(doc.storageKey, 3600),
    })),
  );

  return { ...student, user: { ...student.user, verificationDocuments: docs } };
}

export async function updateStudentStatus(
  adminUserId: string,
  studentId:   string,
  status:      UserStatus,
  reason?:     string,
) {
  const student = await prisma.student.findUnique({
    where:   { id: studentId },
    include: { user: true },
  });
  if (!student) throw new NotFoundError('Student not found');

  // Validate transitions
  const current = student.user.status;
  const valid   = isValidTransition(current, status);
  if (!valid) {
    throw new BadRequestError(`Cannot transition from ${current} to ${status}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: student.userId }, data: { status } });
    await tx.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action:      `ADMIN_UPDATE_STUDENT_STATUS`,
        entityType:  'USER',
        entityId:    student.userId,
        metadata:    { from: current, to: status, reason },
      },
    });
  });
}

export async function updateStudentProfile(
  adminUserId: string,
  studentId:   string,
  data:        { departmentId?: string | null; academicYear?: string | null },
) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new NotFoundError('Student not found');

  return prisma.student.update({
    where: { id: studentId },
    data: {
      ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
      ...(data.academicYear !== undefined && { academicYear: data.academicYear as Parameters<typeof prisma.student.update>[0]['data']['academicYear'] }),
    },
    include: {
      department: true,
      user: { select: { id: true, email: true, status: true } },
    },
  });
}

// ── Teachers ──────────────────────────────────────────────────────────────────
export async function listTeachers(params: {
  page: number; limit: number; search?: string;
  status?: UserStatus; departmentId?: string;
}) {
  const { page, limit, search, status, departmentId } = params;

  const where: Prisma.TeacherWhereInput = {
    user: { ...(status && { status }) },
    ...(departmentId && { departmentId }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { user:      { email: { contains: search, mode: 'insensitive' } } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      include: {
        user:       { select: { id: true, email: true, status: true, createdAt: true } },
        department: { select: { code: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.teacher.count({ where }),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getTeacherDetail(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where:   { id: teacherId },
    include: {
      user: { include: { verificationDocuments: true } },
      department: true,
    },
  });
  if (!teacher) throw new NotFoundError('Teacher not found');

  const docs = await Promise.all(
    teacher.user.verificationDocuments.map(async (doc) => ({
      ...doc,
      fileSize:  doc.fileSize.toString(),
      signedUrl: await getSignedUrl(doc.storageKey, 3600),
    })),
  );

  return { ...teacher, user: { ...teacher.user, verificationDocuments: docs } };
}

export async function updateTeacherStatus(
  adminUserId: string,
  teacherId:   string,
  status:      UserStatus,
  reason?:     string,
) {
  const teacher = await prisma.teacher.findUnique({
    where:   { id: teacherId },
    include: { user: true },
  });
  if (!teacher) throw new NotFoundError('Teacher not found');

  const current = teacher.user.status;
  if (!isValidTransition(current, status)) {
    throw new BadRequestError(`Cannot transition from ${current} to ${status}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: teacher.userId }, data: { status } });
    await tx.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action:      `ADMIN_UPDATE_TEACHER_STATUS`,
        entityType:  'USER',
        entityId:    teacher.userId,
        metadata:    { from: current, to: status, reason },
      },
    });
  });
}

export async function updateTeacherProfile(
  adminUserId: string,
  teacherId:   string,
  data:        { departmentId?: string | null },
) {
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) throw new NotFoundError('Teacher not found');

  return prisma.teacher.update({
    where: { id: teacherId },
    data: {
      ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
    },
    include: {
      department: true,
      user: { select: { id: true, email: true, status: true } },
    },
  });
}

// ── Departments ───────────────────────────────────────────────────────────────
export async function listDepartments() {
  return prisma.department.findMany({ orderBy: { code: 'asc' } });
}

export async function createDepartment(code: string, name: string) {
  return prisma.department.create({ data: { code: code.toUpperCase(), name } });
}

export async function updateDepartment(deptId: string, data: { code?: string; name?: string }) {
  const dept = await prisma.department.findUnique({ where: { id: deptId } });
  if (!dept) throw new NotFoundError('Department not found');
  return prisma.department.update({ where: { id: deptId }, data });
}

export async function toggleDepartmentStatus(deptId: string) {
  const dept = await prisma.department.findUnique({ where: { id: deptId } });
  if (!dept) throw new NotFoundError('Department not found');
  return prisma.department.update({ where: { id: deptId }, data: { isActive: !dept.isActive } });
}

// ── Audit Logs ────────────────────────────────────────────────────────────────
export async function getAuditLogs(page: number, limit: number) {
  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: { actor: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.auditLog.count(),
  ]);
  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidTransition(from: UserStatus, to: UserStatus): boolean {
  const transitions: Partial<Record<UserStatus, UserStatus[]>> = {
    [UserStatus.PENDING]:   [UserStatus.ACTIVE, UserStatus.REJECTED],
    [UserStatus.ACTIVE]:    [UserStatus.SUSPENDED],
    [UserStatus.SUSPENDED]: [UserStatus.ACTIVE],
  };
  return transitions[from]?.includes(to) ?? false;
}
