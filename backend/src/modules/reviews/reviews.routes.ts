import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/role.middleware';
import { UserRole } from '@prisma/client';
import * as ctrl from './reviews.controller';

export const reviewsRouter = Router();

reviewsRouter.use(authenticate, authorize(UserRole.TEACHER));

// Mounted at /api/teacher
reviewsRouter.get('/reviews/pending',     ctrl.getPendingQueue);
reviewsRouter.get('/reviews/history',     ctrl.getReviewHistory);
reviewsRouter.get('/posts/:postId',       ctrl.getPostForReview);

// Submit review (postId lives in postsRouter path pattern /posts/:id/review)
// We re-export this handler to be wired separately via postsRouter
export { ctrl as reviewsController };
