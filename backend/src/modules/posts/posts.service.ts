import * as repo from './posts.repository';
import { uploadToStorage, deleteFromStorage } from '@/config';
import { NotFoundError, BadRequestError, ForbiddenError } from '@/types';
import { PostStatus } from '@prisma/client';
import prisma from '@/database/prisma';
import { v4 as uuidv4 } from 'uuid';

const EDITABLE_STATUSES: PostStatus[] = [PostStatus.DRAFT, PostStatus.REVISION_REQUESTED];
const MAX_MEDIA = 5;

async function getStudentOrThrow(userId: string) {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new ForbiddenError('Student profile not found');
  return student;
}

async function getPostAndVerifyOwnership(postId: string, studentId: string) {
  const post = await repo.findById(postId);
  if (!post) throw new NotFoundError('Post not found');
  if (post.studentId !== studentId) throw new ForbiddenError('You do not own this post');
  return post;
}

export async function createPost(
  userId: string,
  data: {
    title:           string;
    description:     string;
    categoryId?:     string;
    domainId?:       string;
    achievementDate: string;
    position?:       string;
    skillIds?:       string[];
  },
) {
  const student = await getStudentOrThrow(userId);
  return repo.create({
    studentId:       student.id,
    title:           data.title,
    description:     data.description,
    achievementDate: new Date(data.achievementDate),
    categoryId:      data.categoryId,
    domainId:        data.domainId,
    position:        data.position,
    skillIds:        data.skillIds,
  });
}

export async function getMyPosts(
  userId: string,
  status: PostStatus | undefined,
  page:   number,
  limit:  number,
) {
  const student = await getStudentOrThrow(userId);
  const { data, total } = await repo.findByStudentId(student.id, status, page, limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getPostById(userId: string, postId: string) {
  const student = await getStudentOrThrow(userId);
  return getPostAndVerifyOwnership(postId, student.id);
}

export async function updatePost(
  userId: string,
  postId: string,
  data:   Record<string, unknown>,
) {
  const student = await getStudentOrThrow(userId);
  const post    = await getPostAndVerifyOwnership(postId, student.id);

  if (!EDITABLE_STATUSES.includes(post.status)) {
    throw new BadRequestError(
      `Cannot edit a post with status "${post.status}". Only DRAFT and REVISION_REQUESTED posts can be edited.`,
    );
  }

  const { achievementDate, skillIds, ...rest } = data as {
    achievementDate?: string;
    skillIds?:        string[];
    [key: string]:    unknown;
  };

  return repo.update(postId, {
    ...rest,
    ...(achievementDate && { achievementDate: new Date(achievementDate) }),
    skillIds,
  });
}

export async function deletePost(userId: string, postId: string) {
  const student = await getStudentOrThrow(userId);
  const post    = await getPostAndVerifyOwnership(postId, student.id);

  if (post.status !== PostStatus.DRAFT) {
    throw new BadRequestError('Only DRAFT posts can be deleted');
  }

  await repo.deletePost(postId);
}

export async function submitPost(userId: string, postId: string) {
  const student = await getStudentOrThrow(userId);
  const post    = await getPostAndVerifyOwnership(postId, student.id);

  if (!EDITABLE_STATUSES.includes(post.status as typeof EDITABLE_STATUSES[number])) {
    throw new BadRequestError(
      `Cannot submit a post with status "${post.status}"`,
    );
  }

  return repo.submitPost(postId);
}

export async function addMedia(userId: string, postId: string, files: Express.Multer.File[]) {
  const student = await getStudentOrThrow(userId);
  const post    = await getPostAndVerifyOwnership(postId, student.id);

  const currentMediaCount = await repo.countMedia(postId);
  if (currentMediaCount + files.length > MAX_MEDIA) {
    throw new BadRequestError(`A post can have at most ${MAX_MEDIA} evidence files`);
  }

  const results = await Promise.all(
    files.map(async (file) => {
      const key = `achievements/${student.id}/${postId}/${uuidv4()}-${file.originalname}`;
      await uploadToStorage(key, file.buffer, file.mimetype);
      return repo.addMedia({
        postId,
        fileName:   file.originalname,
        fileType:   file.mimetype,
        fileSize:   BigInt(file.size),
        storageKey: key,
      });
    }),
  );

  return results;
}

export async function removeMedia(userId: string, postId: string, mediaId: string) {
  const student = await getStudentOrThrow(userId);
  await getPostAndVerifyOwnership(postId, student.id);

  const media = await repo.findMedia(mediaId);
  if (!media || media.postId !== postId) throw new NotFoundError('Media not found');

  await deleteFromStorage(media.storageKey);
  await repo.deleteMedia(mediaId);
}

async function getOrCreateStudentForUser(userId: string) {
  let student = await prisma.student.findUnique({ where: { userId } });
  if (!student) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { teacher: true },
    });
    if (!user) throw new NotFoundError('User not found');
    const firstName = user.teacher?.firstName ?? (user.role === 'ADMIN' ? 'Admin' : 'User');
    const lastName  = user.teacher?.lastName ?? '';
    const username  = user.email.split('@')[0] + '_' + user.id.slice(0, 4);

    student = await prisma.student.create({
      data: {
        userId:    user.id,
        username,
        firstName,
        lastName,
      },
    });
  }
  return student;
}

// Upvote helpers (called from posts router)
export async function upvotePost(userId: string, postId: string) {
  const student = await getOrCreateStudentForUser(userId);
  const post    = await repo.findById(postId);
  if (!post || post.status !== PostStatus.APPROVED) {
    throw new NotFoundError('Post not found or not approved');
  }

  const existing = await prisma.postUpvote.findUnique({
    where: { postId_studentId: { postId, studentId: student.id } },
  });
  if (existing) return existing;

  return prisma.postUpvote.create({ data: { postId, studentId: student.id } });
}

export async function removeUpvote(userId: string, postId: string) {
  const student = await getOrCreateStudentForUser(userId);
  await prisma.postUpvote.deleteMany({ where: { postId, studentId: student.id } });
}
