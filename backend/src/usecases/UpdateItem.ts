import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item, UpdateItemData } from '../entities/Item';
import { ForbiddenError, NotFoundError } from '../shared/errors/AppError';

interface UpdateItemInput {
  itemId: string;
  requestingUserId: string;
  data: UpdateItemData;
}

export class UpdateItem {
  constructor(private itemRepository: IItemRepository) {}

  async execute({ itemId, requestingUserId, data }: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundError('Item não encontrado.');
    if (item.userId !== requestingUserId) {
      throw new ForbiddenError('Apenas o dono da publicação pode editar este item.');
    }

    return this.itemRepository.update(itemId, data);
  }
}
