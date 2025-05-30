import express from 'express';
import {
  registerUserController,
  loginUserController,
  requestPasswordResetController,
  resetPasswordController,
  requestResetOtpController,
  verifyOtpController
} from '../controllers/auth.controller';
import {validate} from '../middlewares/validation.middleware';
import { emailSchema } from '../schemas/common.schema';

const router = express.Router();

router.post('/register',validate(emailSchema), registerUserController);
router.post('/login', loginUserController);
router.post('/forgot-password', requestPasswordResetController);
router.post('/reset-password', resetPasswordController);
router.post('/request-reset-otp', requestResetOtpController);
router.post('/verify-otp', verifyOtpController);

export default router;
