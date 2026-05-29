import { ICategoryRepository } from '../adapters/repositories/ICategoryRepository';
import { Category } from '../entities/Category';

export class ListCategories {
  constructor(private repo: ICategoryRepository) {}
  async execute(): Promise<Category[]> {
    return this.repo.findAll();
  }
}
