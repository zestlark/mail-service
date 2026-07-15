import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Credential } from '../credentials/entities/credential.entity';
import { Template } from '../templates/entities/template.entity';
import { MailLog } from '../mail/entities/mail-log.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: 'database.db',
  entities: [User, Credential, Template, MailLog],
  synchronize: true,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => typeOrmConfig,
};
