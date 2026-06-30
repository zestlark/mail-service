import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { Repository } from 'typeorm';
import { Credential } from '../credentials/entities/credential.entity';
import { extractVariables } from './templates.helper';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @InjectRepository(Credential)
    private readonly credsRepo: Repository<Credential>,
  ) {}
  async create(createTemplateDto: CreateTemplateDto, userId: number) {
    const template = await this.templateRepo.findOne({
      where: { templateSubject: createTemplateDto.templateSubject, userId },
    });
    if (template) {
      throw new BadRequestException('Template already exists');
    }
    const isCredExist = await this.credsRepo.findOne({
      where: { id: createTemplateDto.credsId, userId },
    });
    if (!isCredExist) {
      throw new BadRequestException('Creds does not exist');
    }

    const variables = extractVariables(createTemplateDto.templateRaw);

    const newTemplate = this.templateRepo.create({
      ...createTemplateDto,
      userId,
      templateVariables: variables,
    });
    return await this.templateRepo.save(newTemplate);
  }

  async findAll(userId: number) {
    return await this.templateRepo.find({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const template = await this.templateRepo.findOne({
      where: { id, userId },
    });
    if (!template) {
      throw new BadRequestException('Template not found');
    }
    return template;
  }

  async update(
    id: number,
    userId: number,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    const template = await this.templateRepo.findOne({
      where: { id, userId },
    });
    if (!template) {
      throw new BadRequestException('Template not found');
    }

    if (updateTemplateDto.credsId) {
      const isCredExist = await this.credsRepo.findOne({
        where: { id: updateTemplateDto.credsId, userId },
      });
      if (!isCredExist) {
        throw new BadRequestException('Creds does not exist');
      }
    }

    const updatedTemplate = this.templateRepo.merge(
      template,
      updateTemplateDto,
    );
    return await this.templateRepo.save(updatedTemplate);
  }

  async remove(id: number, userId: number) {
    const template = await this.templateRepo.findOne({
      where: { id, userId },
    });
    if (!template) {
      throw new BadRequestException('Template not found');
    }
    await this.templateRepo.delete(template.id);
    return { message: 'Template deleted successfully' };
  }
}
