import { Module } from '@nestjs/common';
import { MailLogsService } from './mail-logs.service';
import { MailLogsController } from './mail-logs.controller';

@Module({
  controllers: [MailLogsController],
  providers: [MailLogsService],
})
export class MailLogsModule {}
