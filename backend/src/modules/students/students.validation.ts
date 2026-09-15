import { z } from 'zod';
import { AcademicYear } from '@prisma/client';

export const updateStudentSchema = z.object({
  firstName:    z.string().min(1).max(50).optional(),
  lastName:     z.string().min(1).max(50).optional(),
  bio:          z.string().max(500).optional(),
  departmentId: z.string().uuid().optional(),
  academicYear: z.nativeEnum(AcademicYear).optional(),
  education:    z.string().max(200).optional(),
  socialLinks:  z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    github:   z.string().url().optional().or(z.literal('')),
    twitter:  z.string().url().optional().or(z.literal('')),
    website:  z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export const addSkillSchema = z.object({
  skillId: z.string().uuid('Invalid skill ID'),
});
