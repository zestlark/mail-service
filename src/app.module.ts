import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.db',
      entities: [User, Credential, Template, MailLog],
      synchronize: true,
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
