import { CookieOptions, Request } from 'express';
import { AUTH_CONSTANTS } from './auth.constants';

export const getCookieOptions = (type: 'access' | 'refresh'): CookieOptions => {
  const maxAge =
    type === 'access'
      ? AUTH_CONSTANTS.ACCESS_COOKIE_MAX_AGE
      : AUTH_CONSTANTS.REFRESH_COOKIE_MAX_AGE;

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  };
};

export function extractBearerToken(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
