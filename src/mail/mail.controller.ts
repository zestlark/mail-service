import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type UserPayload } from '../decorators/current-user.decorator';
import { EmailTokenGuard } from './guards/email-token.guard';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(EmailTokenGuard)
  @Post('send')
  sendEmail(
    @Body() sendMailDto: SendMailDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.mailService.sendEmail(user.id, sendMailDto);
  }

  @UseGuards(AuthGuard)
  @Get('logs')
  findAllLogs(@CurrentUser() user: UserPayload) {
    return this.mailService.findAllLogs(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('logs/:id')
  findLogOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.mailService.findLogById(+id, user.id);
  }

  @UseGuards(AuthGuard)
  @Delete('logs/:id')
  removeLog(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.mailService.removeLog(+id, user.id);
  }
}
