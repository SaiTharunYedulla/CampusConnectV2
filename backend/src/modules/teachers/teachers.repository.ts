import prisma from '@/database/prisma';

const teacherSelect = {
  id:           true,
  userId:       true,
  username:     true,
  firstName:    true,
  lastName:     true,
  bio:          true,
  profilePhoto: true,
  designation:  true,
  employeeId:   true,
  expertise:    true,
  department: {
    select: { id: true, code: true, name: true },
  },
};

export async function findByUserId(userId: string) {
  return prisma.teacher.findUnique({ where: { userId }, select: teacherSelect });
}

export async function findById(id: string) {
  return prisma.teacher.findUnique({ where: { id }, select: teacherSelect });
}

export async function updateTeacher(
  teacherId: string,
  data: Partial<{
    firstName:    string;
    lastName:     string;
    bio:          string;
    designation:  string;
    expertise:    string;
    departmentId: string;
    profilePhoto: string;
  }>,
) {
  return prisma.teacher.update({ where: { id: teacherId }, data, select: teacherSelect });
}

export async function getTeacherStats(teacherId: string) {
  const [totalReviews, approved, rejected, revisionRequested] = await Promise.all([
    prisma.review.count({ where: { teacherId } }),
    prisma.review.count({ where: { teacherId, action: 'APPROVED' } }),
    prisma.review.count({ where: { teacherId, action: 'REJECTED' } }),
    prisma.review.count({ where: { teacherId, action: 'REVISION_REQUESTED' } }),
  ]);
  return { totalReviews, approved, rejected, revisionRequested };
}
