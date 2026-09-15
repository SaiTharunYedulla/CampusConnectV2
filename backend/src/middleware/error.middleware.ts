import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@/types';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Zod validation errors → 400 ─────────────────────────────────────────
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    err.issues.forEach((issue) => {
      const path = issue.path.join('.');
      fields[path] = issue.message;
    });
    res.status(400).json({
      error:  'Validation failed',
      fields,
    });
    return;
  }

  // ── Prisma unique constraint → 409 ──────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') ?? 'field';
      res.status(409).json({ error: `A record with this ${target} already exists.` });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }
  }

  // ── JWT errors → 401 ────────────────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    res.status(401).json({ error: 'Token has expired' });
    return;
  }
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // ── Custom AppError ──────────────────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error:  err.message,
      ...(err.fields && { fields: err.fields }),
    });
    return;
  }

  // ── Unknown errors → 500 ─────────────────────────────────────────────────
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
