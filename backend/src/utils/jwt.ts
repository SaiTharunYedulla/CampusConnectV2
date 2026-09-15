import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@/config';

export interface TokenPayload {
  userId: string;
  role:   string;
  status: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  const opts: SignOptions = { expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, opts);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const opts: SignOptions = { expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, opts);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
}
