import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mail_templates')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'creds_id' })
  credsId: number;

  @Column({ name: 'template_subject' })
  templateSubject: string;

  @Column({ name: 'template_raw', type: 'text' })
  templateRaw: string;

  @Column({ name: 'template_variables', type: 'simple-array', nullable: true })
  templateVariables: string[];
}
