import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Template } from '../../templates/entities/template.entity';
import { MailLog } from '../../mail/entities/mail-log.entity';

@Entity('mail_creds')
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Template, template => template.credential)
  templates: Template[];

  @OneToMany(() => MailLog, mailLog => mailLog.credential)
  mailLogs: MailLog[];
}
