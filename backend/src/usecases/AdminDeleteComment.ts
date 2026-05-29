import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { NotFoundError } from '../shared/errors/AppError';

export class AdminDeleteComment {
  constructor(private repo: ICommentRepository) {}
  async execute(commentId: string): Promise<void> {
    const comment = await this.repo.findById(commentId);
    if (!comment) throw new NotFoundError('Comentário não encontrado.');
    await this.repo.delete(commentId);
  }
}
