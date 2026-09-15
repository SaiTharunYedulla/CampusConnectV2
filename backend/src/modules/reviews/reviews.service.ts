import prisma from '@/database/prisma';
import { PostStatus, ReviewAction, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError, ForbiddenError } from '@/types';
import { evaluateBadges } from '@/modules/badges/badge.service';

const postForReviewInclude: Prisma.PostInclude = {
  student: {
    select: {
      id: true, firstName: true, lastName: true, userId: true,
      department: { select: { code: true, name: true } },
      academicYear: true,
    },
  },
  category:   { select: { name: true } },
  domain:     { select: { name: true } },
  media:      true,
  skills:     { select: { skill: { select: { id: true, name: true } } } },
};

const actionToStatus: Record<ReviewAction, PostStatus> = {
  [ReviewAction.APPROVED]:            PostStatus.APPROVED,
  [ReviewAction.REJECTED]:            PostStatus.REJECTED,
  [ReviewAction.REVISION_REQUESTED]:  PostStatus.REVISION_REQUESTED,
};

export async function submitReview(
  teacherUserId: string,
  postId:        string,
  action:        ReviewAction,
  feedback:      string,
  score?:        number,
) {
  // Load teacher record
  const teacher = await prisma.teacher.findUnique({ where: { userId: teacherUserId } });
  if (!teacher) throw new ForbiddenError('Teacher profile not found');

  let studentId: string;

  await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where:   { id: postId },
      include: { student: true },
    });

    if (!post) throw new NotFoundError('Post not found');
    if (post.status !== PostStatus.PENDING_REVIEW) {
      throw new BadRequestError('Post is not pending review');
    }
    if (post.student.userId === teacherUserId) {
      throw new ForbiddenError('You cannot review your own achievement');
    }

    studentId = post.studentId;

    // Build update payload
    const updateData: Prisma.PostUpdateInput = {
      status:          actionToStatus[action],
      teacherFeedback: feedback,
    };

    if (action === ReviewAction.APPROVED) {
      updateData.score      = score;
      updateData.verifiedBy = { connect: { id: teacher.id } };
      updateData.verifiedAt = new Date();
    }

    await tx.post.update({ where: { id: postId }, data: updateData });

    await tx.review.create({
      data: {
        postId,
        teacherId: teacher.id,
        action,
        feedback,
        score,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: teacherUserId,
        action:      `TEACHER_${action}_POST`,
        entityType:  'POST',
        entityId:    postId,
        metadata:    { score, feedback: feedback.slice(0, 100) },
      },
    });
  });

  // Badge evaluation — async, non-blocking
  if (action === ReviewAction.APPROVED && studentId!) {
    evaluateBadges(studentId!).catch(console.error);
  }
}

export async function getPendingQueue(page: number, limit: number) {
  const where = { status: PostStatus.PENDING_REVIEW };
  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: postForReviewInclude,
      orderBy: { updatedAt: 'asc' }, // oldest first
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: data.map((post) => ({
      ...post,
      mediaCount: post.media.length,
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getReviewHistory(teacherUserId: string, page: number, limit: number) {
  const teacher = await prisma.teacher.findUnique({ where: { userId: teacherUserId } });
  if (!teacher) throw new ForbiddenError('Teacher profile not found');

  const where = { teacherId: teacher.id };
  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        post: {
          include: {
            student: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getPostForReview(postId: string) {
  const post = await prisma.post.findUnique({
    where:   { id: postId },
    include: postForReviewInclude,
  });
  if (!post) throw new NotFoundError('Post not found');
  if (post.status !== PostStatus.PENDING_REVIEW) {
    throw new BadRequestError('This post is not available for review');
  }
  return post;
}
