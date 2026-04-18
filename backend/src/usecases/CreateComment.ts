import { ICommentRepository } from '../adapters/repositories/ICommentRepository';
import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Comment } from '../entities/Comment';
import { NotFoundError } from '../shared/errors/AppError';

interface CreateCommentInput {
  text: string;
  itemId: string;
  authorId: string;
}

export class CreateComment {
  constructor(
    private commentRepository: ICommentRepository,
    private itemRepository: IItemRepository,
  ) {}

  async execute({ text, itemId, authorId }: CreateCommentInput): Promise<Comment> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundError('Item não encontrado.');

    return this.commentRepository.create({ text, itemId, authorId });
  }
}
