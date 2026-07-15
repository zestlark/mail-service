import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Credential } from '../../credentials/entities/credential.entity';
import { MailLog } from '../../mail/entities/mail-log.entity';

@Entity('mail_templates')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.templates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'creds_id' })
  credsId: number;

  @ManyToOne(() => Credential, credential => credential.templates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creds_id' })
  credential: Credential;

  @Column({ name: 'template_subject', default: '' })
  templateSubject: string;

  @Column({ name: 'template_raw', type: 'text' })
  templateRaw: string;

  @Column({ name: 'template_variables', type: 'simple-array', nullable: true })
  templateVariables: string[];

  @OneToMany(() => MailLog, mailLog => mailLog.template)
  mailLogs: MailLog[];
}
