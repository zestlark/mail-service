import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailLogsModule } from './mail-logs/mail-logs.module';
import { CredentialsModule } from './credentials/credentials.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';

import { User } from './users/entities/user.entity';
import { Credential } from './credentials/entities/credential.entity';
import { Template } from './templates/entities/template.entity';
import { MailLog } from './mail-logs/entities/mail-log.entity';

import { AUTH_CONSTANTS } from './auth/auth.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.db',
      entities: [User, Credential, Template, MailLog],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET || AUTH_CONSTANTS.FALLBACK_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRATION ||
          AUTH_CONSTANTS.DEFAULT_ACCESS_EXPIRATION) as unknown as number,
      },
    }),
    AuthModule,
    UsersModule,
    TemplatesModule,
    CredentialsModule,
    MailLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
