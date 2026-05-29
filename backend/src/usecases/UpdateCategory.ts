import { ICategoryRepository } from '../adapters/repositories/ICategoryRepository';
import { Category } from '../entities/Category';
import { NotFoundError } from '../shared/errors/AppError';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export class UpdateCategory {
  constructor(private repo: ICategoryRepository) {}
  async execute(id: string, data: { name?: string }): Promise<Category> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Categoria não encontrada.');
    const updateData: { name?: string; slug?: string } = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    return this.repo.update(id, updateData);
  }
}
