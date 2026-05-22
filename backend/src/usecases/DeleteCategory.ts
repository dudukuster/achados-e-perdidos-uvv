import { ICategoryRepository } from '../adapters/repositories/ICategoryRepository';
import { NotFoundError, BadRequestError } from '../shared/errors/AppError';

export class DeleteCategory {
  constructor(private repo: ICategoryRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Categoria não encontrada.');
    if (await this.repo.hasItems(id)) {
      throw new BadRequestError('Não é possível excluir categoria com itens vinculados.');
    }
    await this.repo.delete(id);
  }
}
