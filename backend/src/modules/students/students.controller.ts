import { Request, Response, NextFunction } from 'express';
import * as studentsService from './students.service';
import { updateStudentSchema, addSkillSchema } from './students.validation';
import { BadRequestError, param } from '@/types';

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await studentsService.getMyProfile(req.user!.userId);
    res.json({ data: profile });
  } catch (err) { next(err); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data    = updateStudentSchema.parse(req.body);
    const updated = await studentsService.updateProfile(req.user!.userId, data);
    res.json({ data: updated });
  } catch (err) { next(err); }
}

export async function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequestError('Photo file is required');
    const result = await studentsService.uploadProfilePhoto(req.user!.userId, req.file);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await studentsService.getPublicProfile(param(req.params.id));
    res.json({ data: profile });
  } catch (err) { next(err); }
}

export async function getStudentBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const badges = await studentsService.getStudentBadges(param(req.params.id));
    res.json({ data: badges });
  } catch (err) { next(err); }
}

export async function addSkill(req: Request, res: Response, next: NextFunction) {
  try {
    const { skillId } = addSkillSchema.parse(req.body);
    const skill       = await studentsService.addSkill(req.user!.userId, skillId);
    res.status(201).json({ data: skill });
  } catch (err) { next(err); }
}

export async function removeSkill(req: Request, res: Response, next: NextFunction) {
  try {
    await studentsService.removeSkill(req.user!.userId, param(req.params.skillId));
    res.status(204).send();
  } catch (err) { next(err); }
}
