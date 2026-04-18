import { CreateItemData, Item, SearchFilters, UpdateItemData } from '../../entities/Item';
import { IItemRepository } from '../../adapters/repositories/IItemRepository';
import { prisma } from '../database/prismaClient';

export class PrismaItemRepository implements IItemRepository {
  async create(data: CreateItemData): Promise<Item> {
    return prisma.item.create({ data }) as unknown as Item;
  }

  async findById(id: string): Promise<Item | null> {
    return prisma.item.findUnique({ where: { id } }) as unknown as Item | null;
  }

  async findAll(filters: SearchFilters): Promise<Item[]> {
    const where: Record<string, unknown> = {};

    if (filters.category) where['category'] = filters.category;
    if (filters.location) where['location'] = filters.location;
    if (filters.status) where['status'] = filters.status;
    if (filters.search) {
      where['OR'] = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }) as unknown as Item[];
  }

  async findByUserId(userId: string): Promise<Item[]> {
    return prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }) as unknown as Item[];
  }

  async update(id: string, data: UpdateItemData): Promise<Item> {
    return prisma.item.update({ where: { id }, data }) as unknown as Item;
  }
}
