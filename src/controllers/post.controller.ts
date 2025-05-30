import { Request, Response } from 'express';
import {
  createNewPost,
  fetchAllPosts,
  fetchPostById,
  editPost,
  removePost,
} from '../services/post.Service';
import { AuthRequest } from '../middlewares/AuthRequest';

export const createPostController = async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { title, content } = req.body;
    const user = authReq.user;
    console.log("authReq",authReq)
  
    try {
      if (!user) throw new Error('Unauthorized');
      const post = await createNewPost(user.id, title, content);
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

export const getAllPostsController = async (_req: Request, res: Response) => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const post = await fetchPostById(parseInt(req.params.id));
    res.status(200).json(post);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const editPostController = async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { title, body } = authReq.body;
    const user = authReq.user;
  
    try {
      if (!user) throw new Error('Unauthorized');
      const post = await editPost(parseInt(authReq.params.id), user.id, title, body);
      res.status(200).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  export const deletePostController = async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const user = authReq.user;
  
    try {
      if (!user) throw new Error('Unauthorized');
      await removePost(parseInt(authReq.params.id), user.id);
      res.status(200).json({ message: 'Post deleted' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
