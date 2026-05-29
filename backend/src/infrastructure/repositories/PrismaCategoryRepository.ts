import { Category, CreateCategoryData, UpdateCategoryData } from '../../entities/Category';
import { ICategoryRepository } from '../../adapters/repositories/ICategoryRepository';
import { prisma } from '../database/prismaClient';

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(data: CreateCategoryData): Promise<Category> {
    return prisma.category.create({ data }) as unknown as Category;
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } }) as unknown as Category | null;
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Category[];
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    return prisma.category.update({ where: { id }, data }) as unknown as Category;
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async hasItems(categoryId: string): Promise<boolean> {
    const count = await prisma.item.count({ where: { categoryId } });
    return count > 0;
  }
}
