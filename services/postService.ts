import { createPost, getAllPosts, getPostById,updatePost, deletePost  } from '../repositories/postRepository';
import { findUserById } from '../repositories/userRepostory';

export const createNewPost = async (userId: number, title: string, body: string) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  return await createPost(title, body, user);
};

export const fetchAllPosts = async () => {
  return await getAllPosts();
};

export const fetchPostById = async (id: number) => {
  const post = await getPostById(id);
  if (!post) throw new Error('Post not found');
  return post;
};
export const editPost = async (postId: number, userId: number, title: string, body: string) => {
    const post = await getPostById(postId);
    if (!post) throw new Error('Post not found');
    if (post.author.id !== userId) throw new Error('Unauthorized');
  
    return await updatePost(postId, title, body);
  };
  
  export const removePost = async (postId: number, userId: number) => {
    const post = await getPostById(postId);
    if (!post) throw new Error('Post not found');
    if (post.author.id !== userId) throw new Error('Unauthorized');
  
    const deleted = await deletePost(postId);
    if (!deleted) throw new Error('Delete failed');
    return true;
  };
