import express from 'express';
import {
  registerUserController,
  loginUserController,
  requestPasswordResetController,
  resetPasswordController,
  requestResetOtpController,
  verifyOtpController,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/password-reset/request', requestPasswordResetController);
router.post('/password-reset/reset', resetPasswordController);
router.post('/password-reset/request-otp', requestResetOtpController);
router.post('/password-reset/verify-otp', verifyOtpController);

export default router;
