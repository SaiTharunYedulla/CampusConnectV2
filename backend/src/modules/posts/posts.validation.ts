import { z } from 'zod';
import { AchievementPosition, PostStatus } from '@prisma/client';

export const createPostSchema = z.object({
  title:           z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:     z.string().min(10, 'Description must be at least 10 characters').max(5000),
  categoryId:      z.string().uuid().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  domainId:        z.string().uuid().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  achievementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  position:        z.nativeEnum(AchievementPosition).or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  skillIds:        z.array(z.string().min(1).max(50)).max(10).optional(),
});

export const updatePostSchema = z.object({
  title:           z.string().min(3).max(200).optional(),
  description:     z.string().min(10).max(5000).optional(),
  categoryId:      z.string().uuid().or(z.literal('')).transform(val => val === '' ? undefined : val).optional().nullable(),
  domainId:        z.string().uuid().or(z.literal('')).transform(val => val === '' ? undefined : val).optional().nullable(),
  achievementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  position:        z.nativeEnum(AchievementPosition).or(z.literal('')).transform(val => val === '' ? undefined : val).optional().nullable(),
  skillIds:        z.array(z.string().min(1).max(50)).max(10).optional(),
});

export const postStatusFilterSchema = z.object({
  status: z.nativeEnum(PostStatus).optional(),
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(50).default(20),
});
