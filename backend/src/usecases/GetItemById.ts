import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item } from '../entities/Item';
import { NotFoundError } from '../shared/errors/AppError';

export class GetItemById {
  constructor(private itemRepository: IItemRepository) {}

  async execute(id: string): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) throw new NotFoundError('Item não encontrado.');
    return item;
  }
}
