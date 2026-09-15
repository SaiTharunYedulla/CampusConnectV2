import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import prisma from '@/database/prisma';

export const refRouter = Router();

refRouter.use(authenticate);

refRouter.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.achievementCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    res.json({ data });
  } catch (err) { next(err); }
});

refRouter.get('/domains', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.domain.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    res.json({ data });
  } catch (err) { next(err); }
});

refRouter.get('/skills', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
    res.json({ data });
  } catch (err) { next(err); }
});

refRouter.get('/departments', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.department.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });
    res.json({ data });
  } catch (err) { next(err); }
});
