import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from '@/config';
import { globalErrorHandler } from '@/middleware/error.middleware';

// ── BigInt JSON serialization fix for Prisma ─────────────────────────────────
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function () {
  return Number(this);
};

// ── Route imports (added incrementally as modules are built) ─────────────────
import { authRouter }         from '@/modules/auth/auth.routes';
import { studentsRouter }     from '@/modules/students/students.routes';
import { teachersRouter }     from '@/modules/teachers/teachers.routes';
import { postsRouter }        from '@/modules/posts/posts.routes';
import { reviewsRouter }      from '@/modules/reviews/reviews.routes';
import { feedRouter }         from '@/modules/feed/feed.routes';
import { leaderboardsRouter } from '@/modules/leaderboards/leaderboards.routes';
import { adminRouter }        from '@/modules/admin/admin.routes';
import { refRouter }          from '@/modules/ref/ref.routes';

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin:      config.FRONTEND_URL,
    credentials: true,
    methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  }),
);

// ── Parsing ───────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:      config.NODE_ENV === 'development' ? 2000 : 100,
    message:  { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders:   false,
  }),
);

// ── Stricter limit on auth routes ─────────────────────────────────────────────
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      config.NODE_ENV === 'development' ? 500 : 15,
  message:  { error: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routers ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRateLimit, authRouter);
app.use('/api/students',     studentsRouter);
app.use('/api/teachers',     teachersRouter);
app.use('/api/posts',        postsRouter);
app.use('/api/teacher',      reviewsRouter);
app.use('/api/feed',         feedRouter);
app.use('/api/leaderboards', leaderboardsRouter);
app.use('/api/admin',        adminRouter);
app.use('/api/ref',          refRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;
