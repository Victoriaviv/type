import { AppDataSource } from '../config/database';
import { PasswordResetRequest } from '../entities/PasswordResetRequest';
import { User } from '../entities/User';

export const findUserByEmail = (email: string) => {
  return AppDataSource.getRepository(User).findOneBy({ email });
};

export const createUser = async (data: { email: string, password: string }) => {
  const repo = AppDataSource.getRepository(User);
  const user = repo.create(data);
  return await repo.save(user);
};

export const updateUserPassword = async (userId: number, newPassword: string) => {
  await AppDataSource.getRepository(User).update(userId, { password: newPassword });
};

export const markResetRequestAsUsed = async (requestId: number) => {
  await AppDataSource.getRepository(PasswordResetRequest).update(requestId, { usedAt: new Date() });
};

export const createPasswordResetRequest = async (
  user: User,
  tokenHash: string,
  expiresAt: Date,
  ip: string,
  agent: string,
  otpHash?: string
) => {
  const repo = AppDataSource.getRepository(PasswordResetRequest);
  const request = repo.create({ user, tokenHash, otpHash, expiresAt, ipAddress: ip, userAgent: agent });
  console.log('Saving reset request with OTP hash:', otpHash);
  await repo.save(request);
};
