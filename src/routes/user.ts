import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controller';

import { authMiddleware } from '../middlewares/AuthRequest';  // your auth middleware
import { isAdmin } from '../middlewares/AuthRequest';        // admin check middleware

const router = Router();

// Apply auth and admin check before all user routes
router.use(authMiddleware, isAdmin);

router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);
router.get('/users', (req, res) => {
  res.json({ message: 'List of users' });
});

export default router;
