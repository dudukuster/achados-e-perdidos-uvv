import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { IUserRepository } from '../repositories/IUserRepository';
import { ICategoryRepository } from '../repositories/ICategoryRepository';
import { ILocationRepository } from '../repositories/ILocationRepository';
import { IItemRepository } from '../repositories/IItemRepository';
import { ICommentRepository } from '../repositories/ICommentRepository';
import { ListUsers } from '../../usecases/ListUsers';
import { UpdateUserRole } from '../../usecases/UpdateUserRole';
import { CreateCategory } from '../../usecases/CreateCategory';
import { UpdateCategory } from '../../usecases/UpdateCategory';
import { DeleteCategory } from '../../usecases/DeleteCategory';
import { CreateLocation } from '../../usecases/CreateLocation';
import { UpdateLocation } from '../../usecases/UpdateLocation';
import { DeleteLocation } from '../../usecases/DeleteLocation';
import { AdminDeleteItem } from '../../usecases/AdminDeleteItem';
import { AdminDeleteComment } from '../../usecases/AdminDeleteComment';
import { success } from '../../types/api';

export class AdminController {
  constructor(
    private userRepository: IUserRepository,
    private categoryRepository: ICategoryRepository,
    private locationRepository: ILocationRepository,
    private itemRepository: IItemRepository,
    private commentRepository: ICommentRepository,
  ) {}

  async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await new ListUsers(this.userRepository).execute();
      res.json(success(users));
    } catch (err) { next(err); }
  }

  async updateUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await new UpdateUserRole(this.userRepository).execute(req.params['id'] as string, req.body.role);
      res.json(success({ message: 'Role atualizada.' }));
    } catch (err) { next(err); }
  }

  async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await new CreateCategory(this.categoryRepository).execute({ name: req.body.name });
      res.status(201).json(success(cat));
    } catch (err) { next(err); }
  }

  async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await new UpdateCategory(this.categoryRepository).execute(req.params['id'] as string, { name: req.body.name });
      res.json(success(cat));
    } catch (err) { next(err); }
  }

  async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteCategory(this.categoryRepository).execute(req.params['id'] as string);
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async createLocation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const loc = await new CreateLocation(this.locationRepository).execute({ name: req.body.name });
      res.status(201).json(success(loc));
    } catch (err) { next(err); }
  }

  async updateLocation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const loc = await new UpdateLocation(this.locationRepository).execute(req.params['id'] as string, { name: req.body.name });
      res.json(success(loc));
    } catch (err) { next(err); }
  }

  async deleteLocation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteLocation(this.locationRepository).execute(req.params['id'] as string);
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async deleteItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await new AdminDeleteItem(this.itemRepository).execute(req.params['id'] as string);
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await new AdminDeleteComment(this.commentRepository).execute(req.params['id'] as string);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}
