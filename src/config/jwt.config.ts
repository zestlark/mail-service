import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ENV_KEYS } from './env.keys';

export const jwtAsyncConfig: JwtModuleAsyncOptions = {
  global: true,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>(ENV_KEYS.JWT_ACCESS_SECRET),
    signOptions: {
      expiresIn: configService.get<string>(
        ENV_KEYS.JWT_ACCESS_EXPIRATION,
      ) as unknown as number,
    },
  }),
};
