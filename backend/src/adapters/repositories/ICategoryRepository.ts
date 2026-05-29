import { Category, CreateCategoryData, UpdateCategoryData } from '../../entities/Category';

export interface ICategoryRepository {
  create(data: CreateCategoryData): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: string, data: UpdateCategoryData): Promise<Category>;
  delete(id: string): Promise<void>;
  hasItems(categoryId: string): Promise<boolean>;
}
