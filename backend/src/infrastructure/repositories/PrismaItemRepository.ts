import { CreateItemData, Item, SearchFilters, UpdateItemData } from '../../entities/Item';
import { IItemRepository } from '../../adapters/repositories/IItemRepository';
import { prisma } from '../database/prismaClient';

function mapImageUrlsToCreate(images: string[]) {
  return images.map((url, index) => ({ url, position: index }));
}

const includeAll = {
  images: { orderBy: { position: 'asc' as const } },
  category: true,
  location: true,
  user: { select: { id: true, name: true, email: true } },
};

export class PrismaItemRepository implements IItemRepository {
  async create(data: CreateItemData): Promise<Item> {
    const { images, ...itemData } = data;
    const item = await prisma.item.create({
      data: { ...itemData, images: { create: mapImageUrlsToCreate(images) } },
      include: includeAll,
    });
    return item as unknown as Item;
  }

  async findById(id: string): Promise<Item | null> {
    const item = await prisma.item.findUnique({ where: { id }, include: includeAll });
    return item as unknown as Item | null;
  }

  async findAll(filters: SearchFilters): Promise<Item[]> {
    const where: Record<string, unknown> = {};
    if (filters.categoryId) where['categoryId'] = filters.categoryId;
    if (filters.locationId) where['locationId'] = filters.locationId;
    if (filters.status) where['status'] = filters.status;
    if (filters.search) {
      where['OR'] = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    const items = await prisma.item.findMany({ where, orderBy: { createdAt: 'desc' }, include: includeAll });
    return items as unknown as Item[];
  }

  async findByUserId(userId: string): Promise<Item[]> {
    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: includeAll,
    });
    return items as unknown as Item[];
  }

  async update(id: string, data: UpdateItemData): Promise<Item> {
    const { images, ...itemData } = data;
    const imageOp = images
      ? { images: { deleteMany: {}, create: mapImageUrlsToCreate(images) } }
      : {};
    const item = await prisma.item.update({
      where: { id },
      data: { ...itemData, ...imageOp },
      include: includeAll,
    });
    return item as unknown as Item;
  }

  async delete(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }
}
