import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { Comment } from '../entities/Comment';
import { ForbiddenError, NotFoundError } from '../shared/errors/AppError';

interface UpdateCommentInput {
  commentId: string;
  requestingUserId: string;
  requestingUserRole?: 'USER' | 'ADMIN';
  text: string;
}

export class UpdateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ commentId, requestingUserId, requestingUserRole, text }: UpdateCommentInput): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('Comentário não encontrado.');
    if (comment.authorId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('Apenas o autor ou administradores podem editar este comentário.');
    }
    return this.commentRepository.update(commentId, { text });
  }
}
