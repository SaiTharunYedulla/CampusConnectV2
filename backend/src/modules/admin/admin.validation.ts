import { z } from 'zod';
import { UserStatus } from '@prisma/client';

export const updateStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
  reason: z.string().min(1).max(500).optional(),
});

export const listQuerySchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(100).default(20),
  search:       z.string().optional(),
  status:       z.nativeEnum(UserStatus).optional(),
  departmentId: z.string().uuid().optional(),
});

export const createDepartmentSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase(),
  name: z.string().min(3).max(100),
});

export const updateDepartmentSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase().optional(),
  name: z.string().min(3).max(100).optional(),
});

export const updateStudentProfileSchema = z.object({
  departmentId: z.string().uuid().or(z.literal('')).transform(v => v === '' ? null : v).nullable().optional(),
  academicYear: z.enum(['FIRST_YEAR','SECOND_YEAR','THIRD_YEAR','FOURTH_YEAR']).or(z.literal('')).transform(v => v === '' ? null : v).nullable().optional(),
});

export const updateTeacherProfileSchema = z.object({
  departmentId: z.string().uuid().or(z.literal('')).transform(v => v === '' ? null : v).nullable().optional(),
});
