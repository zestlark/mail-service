import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailLog } from './entities/mail-log.entity';
import { Template } from '../templates/entities/template.entity';
import { Credential } from '../credentials/entities/credential.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateMailLogDto } from './dto/create-mail-log.dto';
import { UpdateMailLogDto } from './dto/update-mail-log.dto';
import { SendMailDto } from './dto/send-mail.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { decrypt } from '../credentials/credentials.helper';
import { ENV_KEYS } from '../config/env.keys';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(MailLog)
    private readonly mailLogRepo: Repository<MailLog>,
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @InjectRepository(Credential)
    private readonly credRepo: Repository<Credential>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async sendEmail(userId: number, sendMailDto: SendMailDto) {
    const { templateId, to, variables } = sendMailDto;

    const template = await this.templateRepo.findOne({
      where: { id: templateId, userId },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const cred = await this.credRepo.findOne({
      where: { id: template.credsId, userId },
    });
    if (!cred) {
      throw new NotFoundException('Credentials not found for this template');
    }

    if (template.templateVariables && template.templateVariables.length > 0) {
      if (!variables) {
        throw new BadRequestException(
          `Missing required variables: ${template.templateVariables.join(', ')}`,
        );
      }
      const missingVars = template.templateVariables.filter(
        (v) => variables[v.trim()] === undefined || variables[v.trim()] === null,
      );
      if (missingVars.length > 0) {
        throw new BadRequestException(
          `Missing required variables: ${missingVars.join(', ')}`,
        );
      }
    }

    let finalBody = template.templateRaw;
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        finalBody = finalBody.replace(
          new RegExp(String.raw`{{\s*${escapedKey}\s*}}`, 'gi'),
          String(value),
        );
      }
    }

    const key = this.configService.get<string>(ENV_KEYS.SMTP_ENCRYPTION_KEY)!;
    const decryptedPassword = decrypt(cred.password, key);

    const transporter = nodemailer.createTransport({
      host: cred.host,
      port: cred.port,
      secure: cred.port === 465,
      auth: {
        user: cred.username,
        pass: decryptedPassword,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let mailLog: MailLog;
    try {
      mailLog = queryRunner.manager.create(MailLog, {
        userId,
        templateId,
        credsId: cred.id,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: template.templateSubject,
        body: finalBody,
        status: 'pending',
      });
      mailLog = await queryRunner.manager.save(mailLog);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to initialize mail log');
    } finally {
      await queryRunner.release();
    }

    let status = 'success';
    let errorMessage = null;

    try {
      await transporter.sendMail({
        from: cred.username,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: template.templateSubject,
        html: finalBody,
      });
    } catch (error) {
      status = 'failed';
      errorMessage = error.message;
    } finally {
      transporter.close();
    }

    mailLog.status = status;
    mailLog.errorMessage = errorMessage;
    mailLog.sentAt = status === 'success' ? new Date() : null;
    await this.mailLogRepo.save(mailLog);

    if (status === 'failed') {
      throw new BadRequestException(`Failed to send email: ${errorMessage}`);
    }

    return { message: 'Email sent successfully', logId: mailLog.id };
  }

  async createLog(createMailLogDto: CreateMailLogDto) {
    const mailLog = this.mailLogRepo.create(createMailLogDto);
    return await this.mailLogRepo.save(mailLog);
  }

  async findAllLogs(userId: number) {
    return await this.mailLogRepo.find({ where: { userId } });
  }

  async findLogById(id: number, userId: number) {
    return await this.mailLogRepo.findOne({ where: { id, userId } });
  }

  async updateLog(id: number, updateMailLogDto: UpdateMailLogDto) {
    await this.mailLogRepo.update(id, updateMailLogDto);
    return this.mailLogRepo.findOne({ where: { id } });
  }

  async removeLog(id: number, userId: number) {
    const log = await this.mailLogRepo.findOne({ where: { id, userId } });
    if (!log) {
      throw new NotFoundException('Mail log not found');
    }
    await this.mailLogRepo.remove(log);
    return { message: 'Mail log deleted successfully' };
  }
}
