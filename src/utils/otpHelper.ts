export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const sendResetEmail = async (email: string, otp: string): Promise<void> => {
  console.log(`Sending OTP ${otp} to ${email}`);
 
};

