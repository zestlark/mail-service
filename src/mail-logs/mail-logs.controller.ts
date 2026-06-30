import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MailLogsService } from './mail-logs.service';
import { CreateMailLogDto } from './dto/create-mail-log.dto';
import { UpdateMailLogDto } from './dto/update-mail-log.dto';

@Controller('mail-logs')
export class MailLogsController {
  constructor(private readonly mailLogsService: MailLogsService) {}

  @Post()
  create(@Body() createMailLogDto: CreateMailLogDto) {
    return this.mailLogsService.create(createMailLogDto);
  }

  @Get()
  findAll() {
    return this.mailLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailLogDto: UpdateMailLogDto) {
    return this.mailLogsService.update(+id, updateMailLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailLogsService.remove(+id);
  }
}
