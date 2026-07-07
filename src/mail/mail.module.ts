import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailLog } from './entities/mail-log.entity';
import { Template } from '../templates/entities/template.entity';
import { Credential } from '../credentials/entities/credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailLog, Template, Credential])],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
