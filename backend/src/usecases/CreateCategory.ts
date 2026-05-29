import { ICategoryRepository } from '../adapters/repositories/ICategoryRepository';
import { Category } from '../entities/Category';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export class CreateCategory {
  constructor(private repo: ICategoryRepository) {}
  async execute(data: { name: string }): Promise<Category> {
    const slug = generateSlug(data.name);
    return this.repo.create({ name: data.name, slug });
  }
}
