import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { User } from '../models/User';

// ✅ CREATE new post
export const createNewPost = async (
  userId: number,
  title: string,
  body: string,
  coverImage?: string,
  category?: string,
  tags?: string[],
  summary?: string,
  timePublished?: string
) => {
  const postRepo = AppDataSource.getRepository(Post);
  const userRepo = AppDataSource.getRepository(User);

  const author = await userRepo.findOneByOrFail({ id: userId });

  const newPost = postRepo.create({
    title,
    body,
    coverImage,
    category,
    tags,
    summary,
    timePublished: timePublished ? new Date(timePublished) : undefined,
    author,
  });

  return await postRepo.save(newPost);
};

// ✅ GET all posts
export const fetchAllPosts = async () => {
  return await AppDataSource.getRepository(Post).find({
    relations: ['author'],
    order: { createdAt: 'DESC' },
  });
};

// ✅ GET post by ID
export const fetchPostById = async (postId: number) => {
  const post = await AppDataSource.getRepository(Post).findOne({
    where: { id: postId },
    relations: ['author'],
  });

  if (!post) throw new Error('Post not found');
  return post;
};

// ✅ UPDATE post
export const editPost = async (
  postId: number,
  userId: number,
  title?: string,
  body?: string,
  coverImage?: string,
  category?: string,
  tags?: string[],
  summary?: string,
  timePublished?: string
) => {
  const repo = AppDataSource.getRepository(Post);
  const post = await repo.findOneBy({ id: postId });

  if (!post) throw new Error('Post not found');
  if (post.author.id !== userId) throw new Error('Unauthorized');

  post.title = title ?? post.title;
  post.body = body ?? post.body;
  post.coverImage = coverImage ?? post.coverImage;
  post.category = category ?? post.category;
  post.tags = tags ?? post.tags;
  post.summary = summary ?? post.summary;
  post.timePublished = timePublished ? new Date(timePublished) : post.timePublished;

  return await repo.save(post);
};

// ✅ DELETE post
export const removePost = async (postId: number, userId: number) => {
  const repo = AppDataSource.getRepository(Post);
  const post = await repo.findOne({
    where: { id: postId },
    relations: ['author'],
  });

  if (!post) throw new Error('Post not found');
  if (post.author.id !== userId) throw new Error('Unauthorized');

  await repo.remove(post);
};
