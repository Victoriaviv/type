import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  requestPasswordResetWithOtp,
  verifyOtpAndResetPassword,
} from '../services/auth.Service';

export const registerUserController = async (req: Request, res: Response) => {
  const { username,email, password } = req.body;
  try {
    const token = await registerUser(username,email, password);
    res.status(201).json({ message: 'User registered', token, });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const requestPasswordResetController = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const ip = req.ip || '';
    await requestPasswordReset(email, ip, req.headers['user-agent'] || '');
    res.status(200).json({ message: "If the user exists, a reset link was sent." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    await resetPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successful." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const requestResetOtpController = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('OTP request received for email:', email);
  try {
    await requestPasswordResetWithOtp(email, req.ip || '', req.headers['user-agent'] as string || '');
    res.status(200).json({ message: 'OTP sent' });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  try {
    await verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({ message: 'OTP verified and password reset successful' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid or expired OTP' });
  }
};
