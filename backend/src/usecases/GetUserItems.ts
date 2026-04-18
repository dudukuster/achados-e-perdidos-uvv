import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item } from '../entities/Item';

export class GetUserItems {
  constructor(private itemRepository: IItemRepository) {}

  async execute(userId: string): Promise<Item[]> {
    return this.itemRepository.findByUserId(userId);
  }
}
