import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../repositories/userRepostory';
import { User } from '../entities/User';

const JWT_SECRET = 'vicky'; // you can move this to env if needed

export const registerUser = async (username: string, password: string): Promise<User> => {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser({ username, password: hashedPassword });
};

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // Create JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '2h',
  });

  return token;
};
