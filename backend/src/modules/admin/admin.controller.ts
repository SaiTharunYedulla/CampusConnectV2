import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import {
  updateStatusSchema,
  listQuerySchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  updateStudentProfileSchema,
  updateTeacherProfileSchema,
} from './admin.validation';
import { z } from 'zod';
import { param } from '@/types';

const paginationSchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getDashboard();
    res.json({ data });
  } catch (err) { next(err); }
}

// ── Students ──────────────────────────────────────────────────────────────────
export async function listStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const params = listQuerySchema.parse(req.query);
    const result = await adminService.listStudents(params);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getStudentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getStudentDetail(param(req.params.id));
    res.json({ data });
  } catch (err) { next(err); }
}

export async function updateStudentStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, reason } = updateStatusSchema.parse(req.body);
    await adminService.updateStudentStatus(req.user!.userId, param(req.params.id), status, reason);
    res.json({ message: 'Student status updated successfully' });
  } catch (err) { next(err); }
}

export async function updateStudentProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateStudentProfileSchema.parse(req.body);
    const updated = await adminService.updateStudentProfile(req.user!.userId, param(req.params.id), data);
    res.json({ data: updated, message: 'Student profile updated successfully' });
  } catch (err) { next(err); }
}

// ── Teachers ──────────────────────────────────────────────────────────────────
export async function listTeachers(req: Request, res: Response, next: NextFunction) {
  try {
    const params = listQuerySchema.parse(req.query);
    const result = await adminService.listTeachers(params);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getTeacherDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getTeacherDetail(param(req.params.id));
    res.json({ data });
  } catch (err) { next(err); }
}

export async function updateTeacherStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, reason } = updateStatusSchema.parse(req.body);
    await adminService.updateTeacherStatus(req.user!.userId, param(req.params.id), status, reason);
    res.json({ message: 'Teacher status updated successfully' });
  } catch (err) { next(err); }
}

export async function updateTeacherProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateTeacherProfileSchema.parse(req.body);
    const updated = await adminService.updateTeacherProfile(req.user!.userId, param(req.params.id), data);
    res.json({ data: updated, message: 'Teacher profile updated successfully' });
  } catch (err) { next(err); }
}

// ── Departments ───────────────────────────────────────────────────────────────
export async function listDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.listDepartments();
    res.json({ data });
  } catch (err) { next(err); }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, name } = createDepartmentSchema.parse(req.body);
    const dept = await adminService.createDepartment(code, name);
    res.status(201).json({ data: dept });
  } catch (err) { next(err); }
}

export async function updateDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateDepartmentSchema.parse(req.body);
    const dept = await adminService.updateDepartment(param(req.params.id), data);
    res.json({ data: dept });
  } catch (err) { next(err); }
}

export async function toggleDepartmentStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const dept = await adminService.toggleDepartmentStatus(param(req.params.id));
    res.json({ data: dept });
  } catch (err) { next(err); }
}

// ── Audit Logs ────────────────────────────────────────────────────────────────
export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await adminService.getAuditLogs(page, limit);
    res.json(result);
  } catch (err) { next(err); }
}
