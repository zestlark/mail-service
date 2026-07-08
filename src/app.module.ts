import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CredentialsModule } from './credentials/credentials.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';

import { User } from './users/entities/user.entity';
import { Credential } from './credentials/entities/credential.entity';
import { Template } from './templates/entities/template.entity';
import { MailLog } from './mail/entities/mail-log.entity';

import { MailModule } from './mail/mail.module';
import { validateEnv } from './config/env.validation';
import { ENV_KEYS } from './config/env.keys';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.db',
      entities: [User, Credential, Template, MailLog],
      synchronize: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_KEYS.JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(
            ENV_KEYS.JWT_ACCESS_EXPIRATION,
          ) as unknown as number,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TemplatesModule,
    CredentialsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
