import { PartialType } from '@nestjs/mapped-types';
import { CreateMailLogDto } from './create-mail-log.dto';

export class UpdateMailLogDto extends PartialType(CreateMailLogDto) {}
