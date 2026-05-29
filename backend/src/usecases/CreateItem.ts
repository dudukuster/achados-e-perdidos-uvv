import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item } from '../entities/Item';

interface CreateItemInput {
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  lostDate: Date;
  userId: string;
  images: string[];
}

export class CreateItem {
  constructor(private itemRepository: IItemRepository) {}

  async execute(data: CreateItemInput): Promise<Item> {
    return this.itemRepository.create(data);
  }
}
