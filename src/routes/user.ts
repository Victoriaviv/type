import { Router } from 'express';
import {
  getAllUsersController,
  getUserProfile,
  getUserByIdController,
  updateUserController,
  deleteUserController,
 
} from '../controllers/user.controller';

import { authMiddleware } from '../middlewares/AuthRequest';
import { isAdmin } from '../middlewares/AuthRequest'; 
const router = Router();

// User must be authenticated for all routes below
router.use(authMiddleware);

// Admin-only routes
router.get('/users', isAdmin, getAllUsersController);
router.get('/users/:id', isAdmin, getUserByIdController);
router.put('/users/:id', isAdmin, updateUserController);
router.delete('/users/:id', isAdmin, deleteUserController);

// Profile route for logged-in user (no admin needed)
router.get('/profile', getUserProfile);

export default router;
