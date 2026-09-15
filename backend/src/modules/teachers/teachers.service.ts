import * as repo from './teachers.repository';
import { uploadToStorage } from '@/config';
import { NotFoundError } from '@/types';

export async function getMyProfile(userId: string) {
  const teacher = await repo.findByUserId(userId);
  if (!teacher) throw new NotFoundError('Teacher profile not found');
  const stats = await repo.getTeacherStats(teacher.id);
  return { ...teacher, stats };
}

export async function getPublicProfile(teacherId: string) {
  const teacher = await repo.findById(teacherId);
  if (!teacher) throw new NotFoundError('Teacher not found');
  const stats = await repo.getTeacherStats(teacher.id);
  return { ...teacher, stats };
}

export async function updateProfile(userId: string, data: Record<string, unknown>) {
  const teacher = await repo.findByUserId(userId);
  if (!teacher) throw new NotFoundError('Teacher profile not found');
  return repo.updateTeacher(teacher.id, data as Parameters<typeof repo.updateTeacher>[1]);
}

export async function uploadProfilePhoto(userId: string, file: Express.Multer.File) {
  const teacher = await repo.findByUserId(userId);
  if (!teacher) throw new NotFoundError('Teacher profile not found');

  const key = `profiles/teachers/${teacher.id}/${Date.now()}-${file.originalname}`;
  const url = await uploadToStorage(key, file.buffer, file.mimetype);

  await repo.updateTeacher(teacher.id, { profilePhoto: url });
  return { profilePhoto: url };
}
