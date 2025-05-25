import express from 'express';
import { authMiddleware } from '../middleware/AuthRequest';
import {
  createNewPost,
  fetchAllPosts,
  fetchPostById,
  editPost,
  removePost,
} from '../services/postService';
import { AuthRequest } from '../middleware/AuthRequest';
import { Response } from 'express';

const router = express.Router();

// POST /api/posts
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, body } = req.body;
  const user = (req as AuthRequest).user;

  try {
    const post = await createNewPost(user.id, title, body);
    res.status(201).json(post);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/posts
router.get('/posts', async (_req, res: Response) => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:id
router.get('/posts/:id', async (req, res: Response) => {
  try {
    const post = await fetchPostById(parseInt(req.params.id));
    res.status(200).json(post);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// PUT /api/posts/:id
router.put('/posts/:id', authMiddleware, async (req, res: Response) => {
  const { title, body } = req.body;
  const user = (req as AuthRequest).user;

  try {
    const post = await editPost(parseInt(req.params.id), user.id, title, body);
    res.status(200).json(post);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/posts/:id', authMiddleware, async (req, res: Response) => {
  const user = (req as AuthRequest).user;

  try {
    await removePost(parseInt(req.params.id), user.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
