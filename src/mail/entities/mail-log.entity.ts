import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Template } from '../../templates/entities/template.entity';
import { Credential } from '../../credentials/entities/credential.entity';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.mailLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'template_id', type: 'int', nullable: true })
  templateId: number | null;

  @ManyToOne(() => Template, template => template.mailLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ name: 'creds_id', type: 'int', nullable: true })
  credsId: number | null;

  @ManyToOne(() => Credential, credential => credential.mailLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creds_id' })
  credential: Credential;

  @Column({ name: 'to' })
  to: string;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'sent_at', type: 'datetime', nullable: true })
  sentAt: Date | null;
}
