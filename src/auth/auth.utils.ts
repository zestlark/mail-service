import { CookieOptions, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../config/env.keys';

export const ACCESS_COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

export function parseExpirationToMs(timeStr: string): number {
  const value = Number.parseInt(timeStr.slice(0, -1), 10);
  const unit = timeStr.slice(-1);

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'y':
      return value * 365 * 24 * 60 * 60 * 1000;
    default:
      return value;
  }
}

export const getCookieOptions = (
  type: 'access' | 'refresh',
  configService: ConfigService,
): CookieOptions => {
  const expiration =
    type === 'access'
      ? configService.get<string>(ENV_KEYS.JWT_ACCESS_EXPIRATION)
      : configService.get<string>(ENV_KEYS.JWT_REFRESH_EXPIRATION);

  const maxAge = parseExpirationToMs(expiration || '');

  return {
    httpOnly: true,
    secure: configService.get<string>(ENV_KEYS.NODE_ENV) === 'production',
    sameSite: 'lax',
    maxAge,
  };
};

export function extractBearerToken(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
