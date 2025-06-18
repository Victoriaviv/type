import { Request, Response } from 'express';
import {
  createNewPost,
  fetchAllPosts,
  fetchPostById,
  editPost,
  removePost,
} from '../services/post.Service';

// ✅ Custom request type with authenticated user
interface AuthRequest extends Request {
  user?: { id: string };
  file?: Express.Multer.File;
}

// ✅ CREATE post
export const createPostController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      summary,
      description, // stringified JSON from WYSIWYG editor
      category,
      tags,
      time_published, // note underscore to match frontend
    } = req.body;

    const coverImage = req.file?.path || undefined;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Normalize tags: string => array, or keep if already array
    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim())
      : tags;

    // Pass description as stringified JSON (not parsed object)
    // Pass time_published as string, convert in service layer
    const newPost = await createNewPost(
      Number(req.user.id),
      title,
      summary,
      description,
      coverImage,
      category,
      parsedTags,
      time_published
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// ✅ EDIT post
export const editPostController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, summary, description, coverImage, category, tags, time_published } = req.body;

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim())
      : tags;

    const updatedPost = await editPost(
      parseInt(req.params.id),
      Number(req.user.id),
      title,
      summary,
      description,
      coverImage,
      category,
      parsedTags,
      time_published
    );

    res.status(200).json(updatedPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET all posts
export const getAllPostsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await fetchAllPosts();
    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET post by ID
export const getPostByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await fetchPostById(parseInt(req.params.id));
    res.status(200).json(post);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// ✅ DELETE post
export const deletePostController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await removePost(parseInt(req.params.id), Number(req.user.id));
    res.status(200).json({ message: 'Post deleted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
