import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item, SearchFilters } from '../entities/Item';

export class SearchItems {
  constructor(private itemRepository: IItemRepository) {}

  async execute(filters: SearchFilters): Promise<Item[]> {
    return this.itemRepository.findAll(filters);
  }
}
