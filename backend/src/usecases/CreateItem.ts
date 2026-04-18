import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Category, Item, Location } from '../entities/Item';

interface CreateItemInput {
  title: string;
  description: string;
  category: Category;
  location: Location;
  lostDate: Date;
  photoUrl: string;
  userId: string;
}

export class CreateItem {
  constructor(private itemRepository: IItemRepository) {}

  async execute(data: CreateItemInput): Promise<Item> {
    return this.itemRepository.create(data);
  }
}
