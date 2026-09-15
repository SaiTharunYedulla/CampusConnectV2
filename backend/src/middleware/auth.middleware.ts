import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { UnauthorizedError } from '@/types';
import { UserRole, UserStatus } from '@prisma/client';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token   = authHeader.slice(7);
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role:   decoded.role as UserRole,
      status: decoded.status as UserStatus,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
