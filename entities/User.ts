import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PasswordResetRequest } from './PasswordResetRequest';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true }) // 👈 TEMPORARY
email?: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PasswordResetRequest, resetRequest => resetRequest.user)
  resetRequests!: PasswordResetRequest[];
}
