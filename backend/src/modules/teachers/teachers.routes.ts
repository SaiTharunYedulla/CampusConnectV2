import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/role.middleware';
import { uploadPhoto } from '@/middleware/upload.middleware';
import { UserRole } from '@prisma/client';
import * as ctrl from './teachers.controller';

export const teachersRouter = Router();

teachersRouter.use(authenticate);

teachersRouter.get('/me',       authorize(UserRole.TEACHER), ctrl.getMyProfile);
teachersRouter.patch('/me',     authorize(UserRole.TEACHER), ctrl.updateProfile);
teachersRouter.post('/me/photo',authorize(UserRole.TEACHER), uploadPhoto, ctrl.uploadPhoto);
teachersRouter.get('/:id',      ctrl.getPublicProfile);
