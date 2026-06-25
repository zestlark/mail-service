import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mail_creds')
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
