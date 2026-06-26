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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser, type UserPayload } from '../decorators';

@Controller('credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.credentialsService.create(createCredentialDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.credentialsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.credentialsService.findOne(Number.parseInt(id), user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.credentialsService.update(
      Number.parseInt(id),
      user.id,
      updateCredentialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.credentialsService.remove(Number.parseInt(id), user.id);
  }
}
