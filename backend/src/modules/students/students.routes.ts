import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/role.middleware';
import { uploadPhoto } from '@/middleware/upload.middleware';
import { UserRole } from '@prisma/client';
import * as ctrl from './students.controller';

export const studentsRouter = Router();

studentsRouter.use(authenticate);

// Own profile
studentsRouter.get('/me',                    authorize(UserRole.STUDENT), ctrl.getMyProfile);
studentsRouter.patch('/me',                  authorize(UserRole.STUDENT), ctrl.updateProfile);
studentsRouter.post('/me/photo',             authorize(UserRole.STUDENT), uploadPhoto, ctrl.uploadPhoto);
studentsRouter.get('/me/skills',             authorize(UserRole.STUDENT), ctrl.getMyProfile); // skills embedded in profile
studentsRouter.post('/me/skills',            authorize(UserRole.STUDENT), ctrl.addSkill);
studentsRouter.delete('/me/skills/:skillId', authorize(UserRole.STUDENT), ctrl.removeSkill);

// Public (any authenticated user)
studentsRouter.get('/:id',        ctrl.getPublicProfile);
studentsRouter.get('/:id/badges', ctrl.getStudentBadges);
