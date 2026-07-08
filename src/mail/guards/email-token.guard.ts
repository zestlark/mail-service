import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { extractBearerToken } from '../../auth/auth.utils';
import { ENV_KEYS } from '../../config/env.keys';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class EmailTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Email token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number }>(
        token,
        {
          secret: this.configService.get<string>(ENV_KEYS.JWT_EMAIL_SECRET),
        },
      );

      const user = await this.authService.findUserById(payload.sub);
      if (!user || user.emailToken !== token) {
        throw new UnauthorizedException('Invalid or expired email token');
      }

      request['user'] = {
        sub: payload.sub,
        id: payload.sub,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired email token');
    }
  }
}
