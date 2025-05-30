import { AppDataSource } from '../config/database';
import { Post } from '../models/Post';
import { User } from '../models/User';

export const createNewPost = async (userId: number, title: string, body: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new Error('User not found');

  const newPost = postRepo.create({ title, body, author: user });
  return await postRepo.save(newPost);
};

export const fetchAllPosts = async () => {
  const postRepo = AppDataSource.getRepository(Post);
  return await postRepo.find({ relations: ['author'] });
};

export const fetchPostById = async (id: number) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id }, relations: ['author'] });
  if (!post) throw new Error('Post not found');
  return post;
};

export const editPost = async (postId: number, userId: number, title: string, body: string) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: postId }, relations: ['author'] });

  if (!post) throw new Error('Post not found');
  if (post.author.id !== userId) throw new Error('Unauthorized');

  post.title = title;
  post.body = body;
  return await postRepo.save(post);
};

export const removePost = async (postId: number, userId: number) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: postId }, relations: ['author'] });

  if (!post) throw new Error('Post not found');
  if (post.author.id !== userId) throw new Error('Unauthorized');

  await postRepo.remove(post);
  return true;
};
