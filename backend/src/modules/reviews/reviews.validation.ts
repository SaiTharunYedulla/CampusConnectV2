import { z } from 'zod';
import { ReviewAction } from '@prisma/client';

export const reviewSchema = z.object({
  action:   z.nativeEnum(ReviewAction),
  score:    z.coerce.number().min(0).max(100).optional(),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters').max(2000),
}).refine(
  (data) => {
    if (data.action === ReviewAction.APPROVED && (data.score === undefined || data.score === null)) {
      return false;
    }
    return true;
  },
  { message: 'Score is required when approving a post', path: ['score'] },
);

export const reviewPaginationSchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
