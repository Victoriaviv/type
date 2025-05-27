import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // load .env

export const sendResetEmail = async (to: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is not defined');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for Password Reset',
    html: `
      <p>You requested to reset your password.</p>
      <p><strong>Your OTP is: ${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
