import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { Comment } from '../entities/Comment';

export class GetItemComments {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(itemId: string): Promise<Comment[]> {
    return this.commentRepository.findByItemId(itemId);
  }
}
