import { CreateItemData, Item, SearchFilters, UpdateItemData } from '../../entities/Item';
import { IItemRepository } from '../../adapters/repositories/IItemRepository';
import { prisma } from '../database/prismaClient';

function mapImageUrlsToCreate(images: string[]) {
  return images.map((url, index) => ({
    url,
    position: index,
  }));
}

const includeImages = {
  images: {
    orderBy: {
      position: 'asc' as const,
    },
  },
};

export class PrismaItemRepository implements IItemRepository {
  async create(data: CreateItemData): Promise<Item> {
    const { images, ...itemData } = data;

    return (prisma as any).item.create({
      data: {
        ...itemData,
        images: {
          create: mapImageUrlsToCreate(images),
        },
      },
      include: includeImages,
    }) as Promise<Item>;
  }

  async findById(id: string): Promise<Item | null> {
    return (prisma as any).item.findUnique({ where: { id }, include: includeImages }) as Promise<Item | null>;
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

    return (prisma as any).item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: includeImages,
    }) as Promise<Item[]>;
  }

  async findByUserId(userId: string): Promise<Item[]> {
    return (prisma as any).item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: includeImages,
    }) as Promise<Item[]>;
  }

  async update(id: string, data: UpdateItemData): Promise<Item> {
    const { images, ...itemData } = data;

    const imageOperation = images
      ? {
          images: {
            deleteMany: {},
            create: mapImageUrlsToCreate(images),
          },
        }
      : {};

    return (prisma as any).item.update({
      where: { id },
      data: {
        ...itemData,
        ...imageOperation,
      },
      include: includeImages,
    }) as Promise<Item>;
  }
}
