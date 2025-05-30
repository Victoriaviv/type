import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { PasswordResetRequest } from '../models/PasswordResetRequest';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT || '6543'),
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, 
  },
  entities: [User, Post, PasswordResetRequest],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during database initialization', error);
    throw error;
  }
};
