import * as repo from './students.repository';
import { uploadToStorage } from '@/config';
import { NotFoundError, ConflictError, ForbiddenError } from '@/types';
import prisma from '@/database/prisma';

export async function getMyProfile(userId: string) {
  const student = await repo.findByUserId(userId);
  if (!student) throw new NotFoundError('Student profile not found');

  const stats = await repo.getStudentStats(student.id);

  return {
    ...student,
    skills: student.skills.map((s) => s.skill),
    badges: student.badges.map((b) => ({ ...b.badge, earnedAt: b.earnedAt })),
    stats,
  };
}

export async function getPublicProfile(studentId: string) {
  const student = await repo.findById(studentId);
  if (!student) throw new NotFoundError('Student not found');

  const stats = await repo.getStudentStats(student.id);

  return {
    ...student,
    skills: student.skills.map((s) => s.skill),
    badges: student.badges.map((b) => ({ ...b.badge, earnedAt: b.earnedAt })),
    stats,
  };
}

export async function updateProfile(
  userId: string,
  data: Record<string, unknown>,
) {
  const student = await repo.findByUserId(userId);
  if (!student) throw new NotFoundError('Student profile not found');
  return repo.updateStudent(student.id, data as Parameters<typeof repo.updateStudent>[1]);
}

export async function uploadProfilePhoto(userId: string, file: Express.Multer.File) {
  const student = await repo.findByUserId(userId);
  if (!student) throw new NotFoundError('Student profile not found');

  const key = `profiles/students/${student.id}/${Date.now()}-${file.originalname}`;
  const url = await uploadToStorage(key, file.buffer, file.mimetype);

  await repo.updateStudent(student.id, { profilePhoto: url });
  return { profilePhoto: url };
}

export async function addSkill(userId: string, skillId: string) {
  const student = await repo.findByUserId(userId);
  if (!student) throw new NotFoundError('Student profile not found');

  // Validate skill exists
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw new NotFoundError('Skill not found');

  try {
    await repo.addSkill(student.id, skillId);
  } catch {
    throw new ConflictError('Skill already added to profile');
  }

  return skill;
}

export async function removeSkill(userId: string, skillId: string) {
  const student = await repo.findByUserId(userId);
  if (!student) throw new NotFoundError('Student profile not found');

  // Check ownership — skill must belong to this student
  const studentSkill = await prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId: student.id, skillId } },
  });
  if (!studentSkill) throw new ForbiddenError('Skill not found on your profile');

  await repo.removeSkill(student.id, skillId);
}

export async function getStudentBadges(studentId: string) {
  const student = await repo.findById(studentId);
  if (!student) throw new NotFoundError('Student not found');
  return repo.getStudentBadges(student.id);
}
