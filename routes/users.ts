import express from 'express';
import { registerUser, loginUser } from '../services/userService';
import { authMiddleware } from '../middleware/AuthRequest';
import { AuthRequest } from '../middleware/AuthRequest'; 

const router = express.Router();

// @route   POST /api/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// @route   POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginUser(username, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  const user = (req as AuthRequest).user;
  res.status(200).json({ message: 'You are authenticated', user });
});


export default router;
