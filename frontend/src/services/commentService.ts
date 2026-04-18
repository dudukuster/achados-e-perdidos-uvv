import api from './api';
import { Comment } from '../types';

export const commentService = {
  async getByItem(itemId: string): Promise<Comment[]> {
    const response = await api.get(`/items/${itemId}/comments`);
    return response.data;
  },

  async create(itemId: string, text: string): Promise<Comment> {
    const response = await api.post(`/items/${itemId}/comments`, { text });
    return response.data;
  },

  async update(commentId: string, text: string): Promise<Comment> {
    const response = await api.patch(`/comments/${commentId}`, { text });
    return response.data;
  },

  async delete(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
