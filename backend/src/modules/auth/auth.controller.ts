import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import {
  studentRegisterSchema,
  teacherRegisterSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
  logoutSchema,
} from './auth.validation';
import { BadRequestError } from '@/types';

export async function registerStudent(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequestError('Proof document is required');
    const body = studentRegisterSchema.parse(req.body);
    await authService.registerStudent({ ...body, file: req.file });
    res.status(201).json({
      message: 'Registration submitted. You will be notified once your account is approved.',
    });
  } catch (err) { next(err); }
}

export async function registerTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequestError('Proof document is required');
    const body = teacherRegisterSchema.parse(req.body);
    await authService.registerTeacher({ ...body, file: req.file });
    res.status(201).json({
      message: 'Registration submitted. You will be notified once your account is approved.',
    });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await authService.refreshTokens(refreshToken);
    res.status(200).json(tokens);
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = logoutSchema.parse(req.body);
    await authService.logout(req.user!.userId, refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
}
