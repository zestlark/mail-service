import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Credential } from './entities/credential.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
  ) {}

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const isExists = await this.credentialRepo.findOne({
      where: { username: createCredentialDto.username },
    });
    if (isExists) {
      throw new BadRequestException('Credential with this user already exists');
    }
    const credential = this.credentialRepo.create({
      ...createCredentialDto,
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
    updateCredentialDto: UpdateCredentialDto,
  ) {
    const isExists = await this.credentialRepo.findOne({
      where: { id, userId },
    });
    if (!isExists) {
      throw new BadRequestException('Credential not found');
    }
    const credential = this.credentialRepo.merge(isExists, updateCredentialDto);
    return this.credentialRepo.save(credential);
  }

  async remove(id: number, userId: number) {
    const credential = await this.credentialRepo.findOne({
      where: { id, userId },
    });
    if (!credential) {
      throw new BadRequestException('Credential not found');
    }
    await this.credentialRepo.delete(credential);
    return { message: 'Credential deleted successfully' };
  }
}
