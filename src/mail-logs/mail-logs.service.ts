import { Injectable } from '@nestjs/common';
import { CreateMailLogDto } from './dto/create-mail-log.dto';
import { UpdateMailLogDto } from './dto/update-mail-log.dto';

@Injectable()
export class MailLogsService {
  create(createMailLogDto: CreateMailLogDto) {
    return 'This action adds a new mailLog';
  }

  findAll() {
    return `This action returns all mailLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mailLog`;
  }

  update(id: number, updateMailLogDto: UpdateMailLogDto) {
    return `This action updates a #${id} mailLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} mailLog`;
  }
}
