import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from './User';
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    title!: string;
  
    @Column()
    body!: string;
  
    @ManyToOne(() => User, (user) => user.id)
    author!: User;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  