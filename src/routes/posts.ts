import express, {Router} from 'express';
import { authMiddleware } from '../middlewares/AuthRequest';
import { upload } from '../middlewares/upload';

import {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  editPostController,
  deletePostController,
} from '../controllers/post.controller';
import { emailSchema } from '../schemas/common.schema';
import { isAdmin } from '../middlewares/AuthRequest'; 

const router: Router = express.Router();


router.post('/posts', authMiddleware, isAdmin, upload.single('project_image'), createPostController);
router.get('/posts', getAllPostsController);
router.get('/posts/:id', getPostByIdController);


// Admin only for update
router.put('/posts/:id', authMiddleware, isAdmin, editPostController);

// Admin only for delete
router.delete('/posts/:id', authMiddleware, isAdmin, deletePostController);


export default router;
