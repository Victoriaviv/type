import { Post } from './../models/Post';
import express from 'express';
import userRoutes from './user';
import postsRoutes from './posts';
import authRoutes from './auth';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts',postsRoutes);
router.use('/auth',authRoutes);

export default router;