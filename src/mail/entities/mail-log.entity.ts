import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'template_id', type: 'int', nullable: true })
  templateId: number | null;

  @Column({ name: 'creds_id', type: 'int', nullable: true })
  credsId: number | null;

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
