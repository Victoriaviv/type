import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../repositories/userRepostory';
import { User } from '../entities/User';

const JWT_SECRET = 'vicky'; // you can move this to env if needed

export const registerUser = async (username: string, password: string): Promise<string> => {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, password: hashedPassword });

  // Generate token right after registration
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, {
    expiresIn: '2h',
  });

  return token;
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
