import prisma from '@/database/prisma';
import { PostStatus, Prisma } from '@prisma/client';

export async function getFeed(params: {
  page:         number;
  limit:        number;
  departmentId?: string;
  categoryId?:  string;
  domainId?:    string;
  studentId?:   string; // to compute hasUpvoted
}) {
  const { page, limit, departmentId, categoryId, domainId, studentId } = params;

  const where: Prisma.PostWhereInput = {
    status: PostStatus.APPROVED,
    ...(departmentId && { student: { departmentId } }),
    ...(categoryId   && { categoryId }),
    ...(domainId     && { domainId }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        student: {
          select: {
            id: true, firstName: true, lastName: true, username: true,
            profilePhoto: true, academicYear: true,
            department: { select: { id: true, code: true, name: true } },
          },
        },
        category: { select: { id: true, name: true } },
        domain:   { select: { id: true, name: true } },
        skills:   { select: { skill: { select: { id: true, name: true } } } },
        media:    { select: { id: true, fileType: true, storageKey: true } },
        upvotes:  { select: { studentId: true } },
      },
      orderBy: { verifiedAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.post.count({ where }),
  ]);

  const data = posts.map((post) => ({
    id:              post.id,
    title:           post.title,
    description:     post.description,
    achievementDate: post.achievementDate,
    position:        post.position,
    score:           post.score,
    verifiedAt:      post.verifiedAt,
    student:         post.student,
    category:        post.category,
    domain:          post.domain,
    skills:          post.skills.map((s) => s.skill),
    mediaCount:      post.media.length,
    upvoteCount:     post.upvotes.length,
    hasUpvoted:      studentId
      ? post.upvotes.some((u) => u.studentId === studentId)
      : false,
  }));

  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}
