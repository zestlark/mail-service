import { IsNumber, IsString } from 'class-validator';
import { Template } from '../entities/template.entity';
import { Type } from 'class-transformer';

export class CreateTemplateDto implements Pick<Template, 'credsId' | 'templateSubject' | 'templateRaw'> {
  @IsNumber()
  @Type(() => Number)
  credsId: number;

  @IsString()
  templateSubject: string;

  @IsString()
  templateRaw: string;
}
