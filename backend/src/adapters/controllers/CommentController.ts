import { Response, NextFunction } from 'express';
import { ICommentRepository } from '../repositories/ICommentRepository';
import { IItemRepository } from '../repositories/IItemRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CreateComment } from '../../usecases/CreateComment';
import { GetItemComments } from '../../usecases/GetItemComments';
import { UpdateComment } from '../../usecases/UpdateComment';
import { DeleteComment } from '../../usecases/DeleteComment';
import { success } from '../../types/api';

export class CommentController {
  constructor(
    private commentRepository: ICommentRepository,
    private itemRepository: IItemRepository,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreateComment(this.commentRepository, this.itemRepository);
      const comment = await useCase.execute({
        text: req.body.text,
        itemId: req.params['itemId'] as string,
        authorId: req.userId!,
      });
      res.status(201).json(success(comment));
    } catch (err) {
      next(err);
    }
  }

  async getByItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetItemComments(this.commentRepository);
      const comments = await useCase.execute(req.params['itemId'] as string);
      res.status(200).json(success(comments));
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new UpdateComment(this.commentRepository);
      const comment = await useCase.execute({
        commentId: req.params['id'] as string,
        requestingUserId: req.userId!,
        requestingUserRole: req.userRole,
        text: req.body.text,
      });
      res.status(200).json(success(comment));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new DeleteComment(this.commentRepository);
      await useCase.execute({
        commentId: req.params['id'] as string,
        requestingUserId: req.userId!,
        requestingUserRole: req.userRole,
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
