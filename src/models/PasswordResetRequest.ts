import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class PasswordResetRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.resetRequests, { eager: true })
  user!: User;
  
  @Column()
  tokenHash!: string;

  @Column({ nullable: true })
  otpHash?: string;

  @Column()
  expiresAt!: Date;

  @Column({ nullable: true })
  usedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  ipAddress!: string;

  @Column()
  userAgent!: string;
}

