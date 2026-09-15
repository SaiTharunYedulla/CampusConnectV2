import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import prisma from '@/database/prisma';
import { z } from 'zod';

export const leaderboardsRouter = Router();

leaderboardsRouter.use(authenticate);

const limitSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(100),
});

// ── Institute leaderboard ─────────────────────────────────────────────────────
leaderboardsRouter.get('/institute', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = limitSchema.parse(req.query);

    const rows = await prisma.$queryRaw<{
      id:              string;
      first_name:      string;
      last_name:       string;
      username:        string;
      profile_photo:   string | null;
      department_code: string | null;
      department_name: string | null;
      total_score:     number;
      rank:            bigint;
    }[]>`
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.username,
        s.profile_photo,
        d.code  AS department_code,
        d.name  AS department_name,
        COALESCE(SUM(p.score), 0)::float AS total_score,
        RANK() OVER (ORDER BY COALESCE(SUM(p.score), 0) DESC) AS rank
      FROM students s
      LEFT JOIN departments d ON d.id = s.department_id
      LEFT JOIN posts p ON p.student_id = s.id AND p.status = 'APPROVED'
      GROUP BY s.id, d.code, d.name
      ORDER BY total_score DESC
      LIMIT ${limit}
    `;

    const data = rows.map((r) => ({
      id:          r.id,
      firstName:   r.first_name,
      lastName:    r.last_name,
      username:    r.username,
      profilePhoto:r.profile_photo,
      department:  r.department_code
        ? { code: r.department_code, name: r.department_name }
        : null,
      totalScore:  Number(r.total_score),
      rank:        Number(r.rank),
    }));

    res.json({ data });
  } catch (err) { next(err); }
});

// ── Department leaderboard ────────────────────────────────────────────────────
leaderboardsRouter.get('/department/:departmentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit }       = limitSchema.parse(req.query);
    const { departmentId }= req.params;

    const rows = await prisma.$queryRaw<{
      id:            string;
      first_name:    string;
      last_name:     string;
      username:      string;
      profile_photo: string | null;
      total_score:   number;
      rank:          bigint;
    }[]>`
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.username,
        s.profile_photo,
        COALESCE(SUM(p.score), 0)::float AS total_score,
        RANK() OVER (ORDER BY COALESCE(SUM(p.score), 0) DESC) AS rank
      FROM students s
      LEFT JOIN posts p ON p.student_id = s.id AND p.status = 'APPROVED'
      WHERE s.department_id = ${departmentId}::uuid
      GROUP BY s.id
      ORDER BY total_score DESC
      LIMIT ${limit}
    `;

    const data = rows.map((r) => ({
      id:          r.id,
      firstName:   r.first_name,
      lastName:    r.last_name,
      username:    r.username,
      profilePhoto:r.profile_photo,
      totalScore:  Number(r.total_score),
      rank:        Number(r.rank),
    }));

    res.json({ data });
  } catch (err) { next(err); }
});

// ── Domain leaderboard ────────────────────────────────────────────────────────
leaderboardsRouter.get('/domain/:domainId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit }  = limitSchema.parse(req.query);
    const { domainId } = req.params;

    const rows = await prisma.$queryRaw<{
      id:            string;
      first_name:    string;
      last_name:     string;
      username:      string;
      profile_photo: string | null;
      total_score:   number;
      rank:          bigint;
    }[]>`
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.username,
        s.profile_photo,
        COALESCE(SUM(p.score), 0)::float AS total_score,
        RANK() OVER (ORDER BY COALESCE(SUM(p.score), 0) DESC) AS rank
      FROM students s
      JOIN posts p ON p.student_id = s.id AND p.status = 'APPROVED' AND p.domain_id = ${domainId}::uuid
      GROUP BY s.id
      ORDER BY total_score DESC
      LIMIT ${limit}
    `;

    const data = rows.map((r) => ({
      id:          r.id,
      firstName:   r.first_name,
      lastName:    r.last_name,
      username:    r.username,
      profilePhoto:r.profile_photo,
      totalScore:  Number(r.total_score),
      rank:        Number(r.rank),
    }));

    res.json({ data });
  } catch (err) { next(err); }
});
