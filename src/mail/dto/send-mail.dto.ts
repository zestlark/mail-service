import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMailDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  templateId: number;

  @IsNotEmpty()
  to: string | string[];

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;
}
