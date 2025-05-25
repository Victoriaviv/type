import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export const userRepository = AppDataSource.getRepository(User);

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const user = userRepository.create(userData);
  return await userRepository.save(user);
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  return await userRepository.findOneBy({ username });
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await userRepository.findOneBy({ id });
};
