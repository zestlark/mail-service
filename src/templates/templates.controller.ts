import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CurrentUser, type UserPayload } from '../decorators';
import { AuthGuard } from '../auth/auth.guard';

@Controller('templates')
@UseGuards(AuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.templatesService.create(createTemplateDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.templatesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.templatesService.findOne(Number.parseInt(id), user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.templatesService.update(
      Number.parseInt(id),
      user.id,
      updateTemplateDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.templatesService.remove(Number.parseInt(id), user.id);
  }
}
