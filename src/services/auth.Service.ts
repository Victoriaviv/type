// services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt,{ SignOptions }from 'jsonwebtoken';
import crypto from 'crypto';
import { MoreThan, IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { PasswordResetRequest } from '../models/PasswordResetRequest';
import { sendResetEmail } from '../utils/email';
import { generateOtp } from '../utils/otpHelper';

const userRepo = AppDataSource.getRepository(User);
const resetRepo = AppDataSource.getRepository(PasswordResetRequest);
const JWT_EXPIRES_IN = '1h';

const generateResetToken = (): string => crypto.randomBytes(32).toString('hex');
type AllowedRole = 'user' | 'admin';
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ token: string; user: { id: number; username: string; email: string; role: string } }> => {
  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) throw new Error('Email is already registered');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepo.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  const savedUser = await userRepo.save(newUser);
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = {
    id: savedUser.id,
    email: savedUser.email as string,
    role: savedUser.role,
  };

  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'],
  };

  const token = jwt.sign(payload, secret, options);

  return {
    token,
    user: {
      id: savedUser.id,
      username: savedUser.username ?? '',
      email: savedUser.email as string,
      role: savedUser.role,
    },
  };
};

 // adjust path to where your Prisma client is

 export const loginUser = async (email: string, password: string): Promise<string> => {
  // 1) Look up the user via TypeORM
  const user = await userRepo.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // 2) Compare plaintext password against the hashed one
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  // 3) Build payload and sign a JWT
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

  const token = jwt.sign(payload, secret, options);
  return token;
};
export const requestPasswordReset = async (email: string, ip: string, agent: string): Promise<void> => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user) return;

  const token = generateResetToken();
  const resetRequest = resetRepo.create({
    user,
    tokenHash: token,
    ipAddress: ip,
    userAgent: agent,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  });

  await resetRepo.save(resetRequest);
  const resetUrl = `https://your-app.com/reset-password?token=${token}`;
  await sendResetEmail(email, resetUrl, 'Reset your password');
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetRequest = await resetRepo.findOne({
    where: { tokenHash: token, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
    relations: ['user'],
  });

  if (!resetRequest) throw new Error('Invalid or expired reset token');

  resetRequest.user.password = await bcrypt.hash(newPassword, 10);
  resetRequest.usedAt = new Date();

  await userRepo.save(resetRequest.user);
  await resetRepo.save(resetRequest);
};

export const requestPasswordResetWithOtp = async (email: string, ip: string, agent: string) => {
  
  const user = await userRepo.findOne({ where: { email } });
  if (!user?.email) return;

  const otp = generateOtp();
  const resetRequest = resetRepo.create({
    user,
    tokenHash: otp,
    ipAddress: ip,
    userAgent: agent,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  await resetRepo.save(resetRequest);
  console.log(`👉 About to send OTP ${otp} to ${user.email}`);
  
};

export const verifyOtpAndResetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error('Invalid request');

  const resetRequest = await resetRepo.findOne({
    where: { user: { id: user.id }, tokenHash: otp, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
    relations: ['user'],
  });

  if (!resetRequest) throw new Error('Invalid or expired OTP');

  user.password = await bcrypt.hash(newPassword, 10);
  resetRequest.usedAt = new Date();

  await userRepo.save(user);
  await resetRepo.save(resetRequest);
};
