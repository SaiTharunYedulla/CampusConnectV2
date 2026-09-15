import { UserRole, UserStatus } from '@prisma/client';

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthUser {
  userId: string;
  role:   UserRole;
  status: UserStatus;
}

// API response shape
export interface ApiResponse<T = unknown> {
  data?:    T;
  message?: string;
  error?:   string;
  fields?:  Record<string, string>;
}

// Pagination
export interface PaginationMeta {
  page:  number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data:       T[];
  pagination: PaginationMeta;
}

// Custom error classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', fields?: Record<string, string>) {
    super(message, 400, fields);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

// Badge criteria type
export interface BadgeCriteria {
  type:  'approved_count' | 'single_score_gte' | 'total_score_gte' | 'institute_rank_lte' | 'dept_rank_lte';
  value: number;
}

/** Safely extract a single string param (Express params are typed as string | string[]) */
export function param(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
