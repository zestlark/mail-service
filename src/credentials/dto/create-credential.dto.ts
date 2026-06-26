import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Credential } from '../entities/credential.entity';

export class CreateCredentialDto implements Omit<Credential, 'id' | 'userId'> {
  @IsString()
  host: string;

  @IsInt()
  @Type(() => Number)
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
