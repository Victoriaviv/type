import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { MoreThan, IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { PasswordResetRequest } from '../entities/PasswordResetRequest';
import {
  createUser,
  findUserByEmail,
  updateUserPassword,
  createPasswordResetRequest,
  markResetRequestAsUsed,
} from '../repositories/userRepostory';
import { sendResetEmail } from '../utils/email';


// or wherever your email code is
import { generateOtp } from '../utils/otpHelper';

export const requestPasswordResetWithOtp = async (email: string, ip: string, agent: string) => {
  const user = await findUserByEmail(email);
  if (!user) return; // silently fail

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 12);

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 12);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await createPasswordResetRequest(user, tokenHash, expiresAt, ip, agent, otpHash);

  await sendResetEmail(user.email!, otp);
};


const JWT_SECRET = 'vicky'; // Replace with process.env.JWT_SECRET in production

// -------------------- TOKEN UTILS --------------------
const generateToken = (): string => crypto.randomBytes(32).toString('hex');

// -------------------- REGISTER --------------------
export const registerUser = async (email: string, password: string): Promise<string> => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ email, password: hashedPassword });

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '2h' });
  return token;
};

// -------------------- LOGIN --------------------
export const loginUser = async (email: string, password: string): Promise<string> => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
  return token;
};

// -------------------- REQUEST PASSWORD RESET --------------------
export const requestPasswordReset = async (email: string, ip: string, agent: string): Promise<void> => {
  const user = await findUserByEmail(email);
  if (!user) return; // Avoid leaking whether the user exists

  const token = generateToken();
  const tokenHash = await bcrypt.hash(token, 12);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await createPasswordResetRequest(user, tokenHash, expiresAt, ip, agent);
  await sendResetEmail(user.email!, token); // 👈 Notice the "!"
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetRepo = AppDataSource.getRepository(PasswordResetRequest);

  const requests = await resetRepo.find({
    where: {
      usedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    },
    relations: {
      user: true,
    },
  });

  for (const request of requests) {
    const match = await bcrypt.compare(token, request.tokenHash);
    if (match) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(request.user.id, hashedPassword);
      await markResetRequestAsUsed(request.id);
      return;
    }
  }

  throw new Error('Invalid or expired token');
};
export const verifyOtpAndResetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
  const resetRepo = AppDataSource.getRepository(PasswordResetRequest);

  const requests = await resetRepo
    .createQueryBuilder('request')
    .leftJoinAndSelect('request.user', 'user')
    .where('request.usedAt IS NULL')
    .andWhere('request.expiresAt > :now', { now: new Date() })
    .andWhere('user.email = :email', { email })
    .getMany();

  console.log(`Found ${requests.length} reset requests for ${email}`);

  for (const request of requests) {
    if (!request.otpHash) {
      console.warn(`Reset request ${request.id} for ${email} missing otpHash`);
      continue;
    }

    console.log(`Comparing OTP for request ${request.id}:`);
    console.log(`OTP sent by user: ${otp}`);
    console.log(`Saved otpHash: ${request.otpHash}`);
  


    const otpMatch = await bcrypt.compare(otp, request.otpHash);
    console.log(`OTP match result: ${otpMatch}`);

    if (otpMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(request.user.id, hashedPassword);
      request.usedAt = new Date();
      await resetRepo.save(request);
      console.log(`Password updated for ${email}`);
      return;
    }
  }

  throw new Error('Invalid or expired OTP');
};
