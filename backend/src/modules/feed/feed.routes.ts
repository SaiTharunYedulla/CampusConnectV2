import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { getFeed } from './feed.service';
import { z } from 'zod';
import prisma from '@/database/prisma';
import { UserRole } from '@prisma/client';

export const feedRouter = Router();

feedRouter.use(authenticate);

const feedQuerySchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(50).default(20),
  departmentId: z.string().uuid().optional(),
  categoryId:   z.string().uuid().optional(),
  domainId:     z.string().uuid().optional(),
});

feedRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, departmentId, categoryId, domainId } = feedQuerySchema.parse(req.query);

    // Resolve student ID for hasUpvoted (for all logged in roles)
    const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
    const studentId = student?.id;

    const result = await getFeed({ page, limit, departmentId, categoryId, domainId, studentId });
    res.json(result);
  } catch (err) { next(err); }
});
