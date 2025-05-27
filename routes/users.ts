import express, { Request, Response } from 'express';
import { 
  registerUser, loginUser, requestPasswordReset, resetPassword,
  requestPasswordResetWithOtp, verifyOtpAndResetPassword
} from '../services/userService';
import { authMiddleware } from '../middleware/AuthRequest';
import { AuthRequest } from '../middleware/AuthRequest';

const router = express.Router();

// POST /api/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await registerUser(email, password);
    res.status(201).json({ message: 'User registered', token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});



// POST /api/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const ip = req.ip || req.connection.remoteAddress || '';
    await requestPasswordReset(email, ip, req.headers['user-agent'] || '');
    res.status(200).json({ message: "If the user exists, a reset link was sent." });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
});

// POST /api/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    await resetPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successful." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/request-reset-otp
router.post('/request-reset-otp', async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await requestPasswordResetWithOtp(
      email, 
      req.ip || '', 
      (req.headers['user-agent'] as string) || ''
    );
    res.status(200).json({ message: 'If the email exists, an OTP has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST /api/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  try {
    await verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({ message: 'OTP verified and password reset successful' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid or expired OTP' });
  }
});

export default router;
