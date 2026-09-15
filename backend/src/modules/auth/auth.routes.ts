import { Router } from 'express';
import * as authController from './auth.controller';
import { uploadProof } from '@/middleware/upload.middleware';
import { authenticate } from '@/middleware/auth.middleware';

export const authRouter = Router();

// Public
authRouter.post('/student/register', uploadProof, authController.registerStudent);
authRouter.post('/teacher/register', uploadProof, authController.registerTeacher);
authRouter.post('/login',            authController.login);
authRouter.post('/refresh',          authController.refresh);

// Protected
authRouter.post('/logout',          authenticate, authController.logout);
authRouter.post('/change-password', authenticate, authController.changePassword);
