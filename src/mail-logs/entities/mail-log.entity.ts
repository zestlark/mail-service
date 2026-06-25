import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
