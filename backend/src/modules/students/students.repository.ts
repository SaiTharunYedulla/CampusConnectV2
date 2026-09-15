import prisma from '@/database/prisma';
import { PostStatus, AcademicYear, Prisma } from '@prisma/client';

const studentSelect = {
  id:           true,
  userId:       true,
  username:     true,
  firstName:    true,
  lastName:     true,
  bio:          true,
  profilePhoto: true,
  academicYear: true,
  education:    true,
  socialLinks:  true,
  department: {
    select: { id: true, code: true, name: true },
  },
  skills: {
    select: { skill: { select: { id: true, name: true } } },
  },
  badges: {
    select: {
      earnedAt: true,
      badge:    { select: { id: true, name: true, icon: true, description: true } },
    },
    orderBy: { earnedAt: 'desc' as const },
  },
};

export async function findByUserId(userId: string) {
  return prisma.student.findUnique({ where: { userId }, select: studentSelect });
}

export async function findById(id: string) {
  return prisma.student.findUnique({ where: { id }, select: studentSelect });
}

export async function getStudentStats(studentId: string) {
  const [approvedPosts, pendingPosts, badgeCount] = await Promise.all([
    prisma.post.findMany({
      where:  { studentId, status: PostStatus.APPROVED },
      select: { score: true },
    }),
    prisma.post.count({
      where: { studentId, status: { in: [PostStatus.PENDING_REVIEW, PostStatus.DRAFT] } },
    }),
    prisma.studentBadge.count({ where: { studentId } }),
  ]);

  const approvedCount = approvedPosts.length;
  const totalScore    = approvedPosts.reduce((sum, p) => sum + Number(p.score ?? 0), 0);

  return { approvedCount, totalScore, pendingCount: pendingPosts, badges: badgeCount };
}

export async function updateStudent(
  studentId: string,
  data: Partial<{
    firstName:    string;
    lastName:     string;
    bio:          string;
    departmentId: string;
    academicYear: string;
    education:    string;
    socialLinks:  object;
    profilePhoto: string;
  }>,
) {
  const { departmentId, academicYear, socialLinks, ...rest } = data;
  return prisma.student.update({
    where:  { id: studentId },
    data:   {
      ...rest,
      ...(departmentId  ? { department: { connect: { id: departmentId } } } : {}),
      ...(academicYear  ? { academicYear: academicYear as AcademicYear }    : {}),
      ...(socialLinks !== undefined ? { socialLinks: socialLinks as Prisma.InputJsonValue } : {}),
    },
    select: studentSelect,
  });
}

export async function addSkill(studentId: string, skillId: string) {
  return prisma.studentSkill.create({ data: { studentId, skillId } });
}

export async function removeSkill(studentId: string, skillId: string) {
  return prisma.studentSkill.delete({
    where: { studentId_skillId: { studentId, skillId } },
  });
}

export async function getStudentBadges(studentId: string) {
  return prisma.studentBadge.findMany({
    where:   { studentId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });
}

