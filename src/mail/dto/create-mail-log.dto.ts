import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMailLogDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  templateId?: number;

  @IsNumber()
  @IsOptional()
  credsId?: number;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsOptional()
  sentAt?: Date;
}
