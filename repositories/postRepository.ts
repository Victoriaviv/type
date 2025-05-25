import { AppDataSource } from '../config/database';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export const postRepository = AppDataSource.getRepository(Post);

export const createPost = async (title: string, body: string, author: User): Promise<Post> => {
  const post = postRepository.create({ title, body, author });
  return await postRepository.save(post);
};

export const getAllPosts = async (): Promise<Post[]> => {
  return await postRepository.find({ relations: ['author'] });
};

export const getPostById = async (id: number): Promise<Post | null> => {
  return await postRepository.findOne({ where: { id }, relations: ['author'] });
};
export const updatePost = async (id: number, title: string, body: string): Promise<Post | null> => {
    const post = await getPostById(id);
    if (!post) return null;
  
    post.title = title;
    post.body = body;
  
    return await postRepository.save(post);
  };
  
  export const deletePost = async (id: number): Promise<boolean> => {
    const result = await postRepository.delete(id);
    return result.affected !== 0;
  };