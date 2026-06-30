import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { Credential } from '../credentials/entities/credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template, Credential])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
