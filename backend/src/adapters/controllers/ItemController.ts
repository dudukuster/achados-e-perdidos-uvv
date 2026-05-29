import { Response, NextFunction } from 'express';
import { IItemRepository } from '../repositories/IItemRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CreateItem } from '../../usecases/CreateItem';
import { SearchItems } from '../../usecases/SearchItems';
import { GetItemById } from '../../usecases/GetItemById';
import { GetUserItems } from '../../usecases/GetUserItems';
import { UpdateItem } from '../../usecases/UpdateItem';
import { Status, UpdateItemData } from '../../entities/Item';
import { BadRequestError, ForbiddenError } from '../../shared/errors/AppError';
import { success } from '../../types/api';

export class ItemController {
  constructor(private itemRepository: IItemRepository) {}

  async uploadImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        throw new BadRequestError('Nenhuma imagem enviada.');
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const images = files.map((file) => `${baseUrl}/uploads/items/${file.filename}`);

      res.status(201).json(success({ images }));
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreateItem(this.itemRepository);
      const item = await useCase.execute({ ...req.body, userId: req.userId! });
      res.status(201).json(success(item));
    } catch (err) {
      next(err);
    }
  }

  async search(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId, locationId, status, search } = req.query;
      const useCase = new SearchItems(this.itemRepository);
      const items = await useCase.execute({
        categoryId: typeof categoryId === 'string' ? categoryId : undefined,
        locationId: typeof locationId === 'string' ? locationId : undefined,
        status: typeof status === 'string' ? (status as Status) : undefined,
        search: typeof search === 'string' ? search : undefined,
      });
      res.status(200).json(success(items));
    } catch (err) {
      next(err);
    }
  }

  async getMyItems(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetUserItems(this.itemRepository);
      const items = await useCase.execute(req.userId!);
      res.status(200).json(success(items));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetItemById(this.itemRepository);
      const item = await useCase.execute(req.params['id'] as string);
      res.status(200).json(success(item));
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new UpdateItem(this.itemRepository);
      const item = await useCase.execute({
        itemId: req.params['id'] as string,
        requestingUserId: req.userId!,
        requestingUserRole: req.userRole,
        data: req.body as UpdateItemData,
      });
      res.status(200).json(success(item));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetItemById(this.itemRepository);
      const item = await useCase.execute(req.params['id'] as string);

      if (item.userId !== req.userId && req.userRole !== 'ADMIN') {
        throw new ForbiddenError('Apenas o dono ou administradores podem excluir.');
      }

      await this.itemRepository.delete(req.params['id'] as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
