import express from 'express';
import { authMiddleware } from '../middlewares/AuthRequest';

import {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  editPostController,
  deletePostController,
} from '../controllers/post.controller';
import { emailSchema } from '../schemas/common.schema';


const router = express.Router();

router.post('/posts' , authMiddleware,createPostController);
router.get('/posts', getAllPostsController);
router.get('/posts/:id', getPostByIdController);
router.put('/posts/:id', authMiddleware, editPostController);
router.delete('/posts/:id', authMiddleware,  deletePostController);

export default router;
