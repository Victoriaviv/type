// controllers/userController.ts
import { Request, Response,NextFunction  } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
  
} from '../services/user.Service';



interface AuthRequest extends Request {
  user?: { id: number; role: string };
}


export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Server Error' });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(parseInt(req.params.id));
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const updated = await updateUser(parseInt(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    await deleteUser(parseInt(req.params.id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
