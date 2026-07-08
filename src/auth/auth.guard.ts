import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  getCookieOptions,
  extractBearerToken,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from './auth.utils';
import { ENV_KEYS } from '../config/env.keys';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractToken(request);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<{
          sub: number;
          email: string;
          name: string;
        }>(token, {
          secret: this.configService.get<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        });

        request['user'] = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
        };
        return true;
      } catch (accessError) {
        console.error(accessError);
      }
    }

    const refreshToken = request.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      this.clearAuthCookies(response);
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      const refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>(ENV_KEYS.JWT_REFRESH_SECRET),
      });
      const userId = refreshPayload.sub;

      const user = await this.authService.findUserById(Number(userId));
      if (!user) {
        this.clearAuthCookies(response);
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.authService.getTokens(
        user.id,
        user.email,
        user.name,
      );

      this.authService.setCookies(
        response,
        tokens.accessToken,
        tokens.refreshToken,
      );

      request['user'] = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return true;
    } catch {
      this.clearAuthCookies(response);
      throw new UnauthorizedException('Session expired, please log in again.');
    }
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie(
      ACCESS_COOKIE_NAME,
      getCookieOptions('access', this.configService),
    );
    response.clearCookie(
      REFRESH_COOKIE_NAME,
      getCookieOptions('refresh', this.configService),
    );
  }

  private extractToken(request: Request): string | undefined {
    if (request.cookies?.[ACCESS_COOKIE_NAME]) {
      return request.cookies[ACCESS_COOKIE_NAME];
    }
    return extractBearerToken(request);
  }
}
