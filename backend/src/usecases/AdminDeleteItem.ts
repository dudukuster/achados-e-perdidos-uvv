import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { NotFoundError } from '../shared/errors/AppError';

export class AdminDeleteItem {
  constructor(private repo: IItemRepository) {}
  async execute(itemId: string): Promise<void> {
    const item = await this.repo.findById(itemId);
    if (!item) throw new NotFoundError('Item não encontrado.');
    await this.repo.delete(itemId);
  }
}
