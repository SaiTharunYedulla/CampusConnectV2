import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { authorize } from '@/middleware/role.middleware';
import { UserRole } from '@prisma/client';
import * as ctrl from './admin.controller';

export const adminRouter = Router();

adminRouter.use(authenticate, authorize(UserRole.ADMIN));

// Dashboard
adminRouter.get('/dashboard', ctrl.getDashboard);

// Students
adminRouter.get('/students',              ctrl.listStudents);
adminRouter.get('/students/:id',          ctrl.getStudentDetail);
adminRouter.patch('/students/:id/status', ctrl.updateStudentStatus);
adminRouter.patch('/students/:id/profile',ctrl.updateStudentProfile);

// Teachers
adminRouter.get('/teachers',              ctrl.listTeachers);
adminRouter.get('/teachers/:id',          ctrl.getTeacherDetail);
adminRouter.patch('/teachers/:id/status', ctrl.updateTeacherStatus);
adminRouter.patch('/teachers/:id/profile',ctrl.updateTeacherProfile);

// Departments
adminRouter.get('/departments',              ctrl.listDepartments);
adminRouter.post('/departments',             ctrl.createDepartment);
adminRouter.patch('/departments/:id',        ctrl.updateDepartment);
adminRouter.patch('/departments/:id/status', ctrl.toggleDepartmentStatus);

// Audit logs
adminRouter.get('/audit-logs', ctrl.getAuditLogs);
