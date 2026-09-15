import { Request, Response, NextFunction } from 'express';
import * as teachersService from './teachers.service';
import { z } from 'zod';
import { BadRequestError, param } from '@/types';

const updateTeacherSchema = z.object({
  firstName:    z.string().min(1).max(50).optional(),
  lastName:     z.string().min(1).max(50).optional(),
  bio:          z.string().max(500).optional(),
  designation:  z.string().max(100).optional(),
  expertise:    z.string().max(200).optional(),
  departmentId: z.string().uuid().optional(),
});

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await teachersService.getMyProfile(req.user!.userId);
    res.json({ data: profile });
  } catch (err) { next(err); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data    = updateTeacherSchema.parse(req.body);
    const updated = await teachersService.updateProfile(req.user!.userId, data);
    res.json({ data: updated });
  } catch (err) { next(err); }
}

export async function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequestError('Photo file is required');
    const result = await teachersService.uploadProfilePhoto(req.user!.userId, req.file);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await teachersService.getPublicProfile(param(req.params.id));
    res.json({ data: profile });
  } catch (err) { next(err); }
}
