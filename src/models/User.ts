import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PasswordResetRequest } from './PasswordResetRequest';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: 'user' | 'admin';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PasswordResetRequest, resetRequest => resetRequest.user)
  resetRequests!: PasswordResetRequest[];
}
