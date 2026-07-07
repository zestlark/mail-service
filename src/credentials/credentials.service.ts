import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Credential } from './entities/credential.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { encrypt } from './credentials.helper';
import { ENV_KEYS } from '../config/env.keys';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    private readonly configService: ConfigService,
  ) {}

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const isExists = await this.credentialRepo.findOne({
      where: { username: createCredentialDto.username },
    });
    if (isExists) {
      throw new BadRequestException('Credential with this user already exists');
    }

    const key = this.configService.get<string>(ENV_KEYS.SMTP_ENCRYPTION_KEY)!;
    const encryptedPassword = encrypt(createCredentialDto.password, key);

    const credential = this.credentialRepo.create({
      ...createCredentialDto,
      password: encryptedPassword,
      userId,
    });
    return this.credentialRepo.save(credential);
  }

  findAll(userId: number) {
    return this.credentialRepo.find({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const credential = await this.credentialRepo.findOne({
      where: { id, userId },
    });
    if (!credential) {
      throw new BadRequestException('Credential not found');
    }
    return credential;
  }

  async update(
    id: number,
    userId: number,
    updateTemplateDto: UpdateCredentialDto,
  ) {
    const isExists = await this.credentialRepo.findOne({
      where: { id, userId },
    });
    if (!isExists) {
      throw new BadRequestException('Credential not found');
    }

    let encryptedPassword = updateTemplateDto.password;
    if (encryptedPassword) {
      const key = this.configService.get<string>(ENV_KEYS.SMTP_ENCRYPTION_KEY)!;
      encryptedPassword = encrypt(encryptedPassword, key);
    }

    const credential = this.credentialRepo.merge(isExists, {
      ...updateTemplateDto,
      ...(encryptedPassword ? { password: encryptedPassword } : {}),
    });
    return this.credentialRepo.save(credential);
  }

  async remove(id: number, userId: number) {
    const credential = await this.credentialRepo.findOne({
      where: { id, userId },
    });
    if (!credential) {
      throw new BadRequestException('Credential not found');
    }
    await this.credentialRepo.delete(credential.id);
    return { message: 'Credential deleted successfully' };
  }
}
