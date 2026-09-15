import { Request, Response, NextFunction } from 'express';
import { UserRole, UserStatus } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '@/types';

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    if (req.user.status !== UserStatus.ACTIVE) {
      return next(new ForbiddenError('Account is not active'));
    }

    next();
  };
}
