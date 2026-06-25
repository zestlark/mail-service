import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailLogsModule } from './mail-logs/mail-logs.module';
import { LogsModule } from './logs/logs.module';
import { CredentialsModule } from './credentials/credentials.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, TemplatesModule, CredentialsModule, LogsModule, MailLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
