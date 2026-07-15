import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Credential } from '../../credentials/entities/credential.entity';
import { Template } from '../../templates/entities/template.entity';
import { MailLog } from '../../mail/entities/mail-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  emailToken: string;

  @OneToMany(() => Credential, credential => credential.user)
  credentials: Credential[];

  @OneToMany(() => Template, template => template.user)
  templates: Template[];

  @OneToMany(() => MailLog, mailLog => mailLog.user)
  mailLogs: MailLog[];
}
