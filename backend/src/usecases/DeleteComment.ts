import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { ForbiddenError, NotFoundError } from '../shared/errors/AppError';

interface DeleteCommentInput {
  commentId: string;
  requestingUserId: string;
  requestingUserRole?: 'USER' | 'ADMIN';
}

export class DeleteComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ commentId, requestingUserId, requestingUserRole }: DeleteCommentInput): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('Comentário não encontrado.');
    if (comment.authorId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('Apenas o autor ou administradores podem excluir este comentário.');
    }
    await this.commentRepository.delete(commentId);
  }
}
