// services/user.service.ts
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async () => {
  return await userRepo.find({ select: ['id', 'username', 'email', 'role', 'createdAt'] });
};

export const getUserById = async (id: number) => {
  const user = await userRepo.findOne({ where: { id }, select: ['id', 'username', 'email', 'createdAt'] });
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (id: number, updates: Partial<User>) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw new Error('User not found');

  Object.assign(user, updates);
  return await userRepo.save(user);
};

export const deleteUser = async (id: number) => {
  const result = await userRepo.delete(id);
  if (result.affected === 0) throw new Error('User not found');
};
