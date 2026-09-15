import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/role.middleware';
import { uploadEvidence } from '@/middleware/upload.middleware';
import { UserRole } from '@prisma/client';
import { submitReview } from '@/modules/reviews/reviews.controller';
import * as ctrl from './posts.controller';

export const postsRouter = Router();

postsRouter.use(authenticate);

// Student-only: post CRUD
postsRouter.post('/',               authorize(UserRole.STUDENT), ctrl.createPost);
postsRouter.get('/my',              authorize(UserRole.STUDENT), ctrl.getMyPosts);
postsRouter.get('/:id',             authorize(UserRole.STUDENT), ctrl.getPostById);
postsRouter.patch('/:id',           authorize(UserRole.STUDENT), ctrl.updatePost);
postsRouter.delete('/:id',          authorize(UserRole.STUDENT), ctrl.deletePost);
postsRouter.post('/:id/submit',     authorize(UserRole.STUDENT), ctrl.submitPost);
postsRouter.post('/:id/media',      authorize(UserRole.STUDENT), uploadEvidence, ctrl.addMedia);
postsRouter.delete('/:id/media/:mediaId', authorize(UserRole.STUDENT), ctrl.removeMedia);

// Teacher review submission
postsRouter.post('/:id/review', authorize(UserRole.TEACHER), submitReview);

// Upvotes: STUDENT, TEACHER, ADMIN
postsRouter.post('/:id/upvote',   authorize(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN), ctrl.upvotePost);
postsRouter.delete('/:id/upvote', authorize(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN), ctrl.removeUpvote);
