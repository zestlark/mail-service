import { IsNumber, IsString } from 'class-validator';
import { Template } from '../entities/template.entity';
import { Type } from 'class-transformer';

export class CreateTemplateDto implements Omit<
  Template,
  'id' | 'userId' | 'templateVariables'
> {
  @IsNumber()
  @Type(() => Number)
  credsId: number;

  @IsString()
  templateSubject: string;

  @IsString()
  templateRaw: string;
}
