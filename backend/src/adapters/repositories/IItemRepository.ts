import { CreateItemData, Item, SearchFilters, UpdateItemData } from '../../entities/Item';

export interface IItemRepository {
  create(data: CreateItemData): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findAll(filters: SearchFilters): Promise<Item[]>;
  findByUserId(userId: string): Promise<Item[]>;
  update(id: string, data: UpdateItemData): Promise<Item>;
}
