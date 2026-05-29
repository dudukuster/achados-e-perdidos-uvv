import { IItemRepository } from '../adapters/repositories/IItemRepository';
import { Item, UpdateItemData } from '../entities/Item';
import { ForbiddenError, NotFoundError } from '../shared/errors/AppError';

interface UpdateItemInput {
  itemId: string;
  requestingUserId: string;
  requestingUserRole?: 'USER' | 'ADMIN';
  data: UpdateItemData;
}

export class UpdateItem {
  constructor(private itemRepository: IItemRepository) {}

  async execute({ itemId, requestingUserId, requestingUserRole, data }: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundError('Item não encontrado.');
    if (item.userId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('Apenas o dono ou administradores podem editar este item.');
    }
    return this.itemRepository.update(itemId, data);
  }
}
