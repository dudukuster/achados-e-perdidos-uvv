import { Comment, CreateCommentData, UpdateCommentData } from '../../entities/Comment';

export interface ICommentRepository {
  create(data: CreateCommentData): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findByItemId(itemId: string): Promise<Comment[]>;
  update(id: string, data: UpdateCommentData): Promise<Comment>;
  delete(id: string): Promise<void>;
}
