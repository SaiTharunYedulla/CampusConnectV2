import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const studentRegisterSchema = z.object({
  email:        z.string().email('Invalid email address'),
  password:     passwordSchema,
  firstName:    z.string().min(1, 'First name is required').max(50),
  lastName:     z.string().min(1, 'Last name is required').max(50),
  username:     z.string().min(3, 'Username must be at least 3 characters').max(30)
                  .regex(/^[a-z0-9_]+$/, 'Username may only contain lowercase letters, numbers, and underscores'),
  documentType: z.string().min(1, 'Document type is required'),
});

export const teacherRegisterSchema = z.object({
  email:        z.string().email('Invalid email address'),
  password:     passwordSchema,
  firstName:    z.string().min(1, 'First name is required').max(50),
  lastName:     z.string().min(1, 'Last name is required').max(50),
  username:     z.string().min(3).max(30)
                  .regex(/^[a-z0-9_]+$/, 'Username may only contain lowercase letters, numbers, and underscores'),
  documentType: z.string().min(1, 'Document type is required'),
  designation:  z.string().max(100).optional(),
  employeeId:   z.string().max(50).optional(),
  expertise:    z.string().max(200).optional(),
});

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     passwordSchema,
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
