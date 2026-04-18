import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { Comment } from '../entities/Comment';
import { ForbiddenError, NotFoundError } from '../shared/errors/AppError';

interface UpdateCommentInput {
  commentId: string;
  requestingUserId: string;
  text: string;
}

export class UpdateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute({ commentId, requestingUserId, text }: UpdateCommentInput): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundError('Comentário não encontrado.');
    if (comment.authorId !== requestingUserId) {
      throw new ForbiddenError('Apenas o autor pode editar este comentário.');
    }

    return this.commentRepository.update(commentId, { text });
  }
}
