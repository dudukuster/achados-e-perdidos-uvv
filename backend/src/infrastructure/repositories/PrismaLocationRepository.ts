import { Location, CreateLocationData, UpdateLocationData } from '../../entities/Location';
import { ILocationRepository } from '../../adapters/repositories/ILocationRepository';
import { prisma } from '../database/prismaClient';

export class PrismaLocationRepository implements ILocationRepository {
  async create(data: CreateLocationData): Promise<Location> {
    return prisma.location.create({ data }) as unknown as Location;
  }

  async findById(id: string): Promise<Location | null> {
    return prisma.location.findUnique({ where: { id } }) as unknown as Location | null;
  }

  async findAll(): Promise<Location[]> {
    return prisma.location.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Location[];
  }

  async update(id: string, data: UpdateLocationData): Promise<Location> {
    return prisma.location.update({ where: { id }, data }) as unknown as Location;
  }

  async delete(id: string): Promise<void> {
    await prisma.location.delete({ where: { id } });
  }

  async hasItems(locationId: string): Promise<boolean> {
    const count = await prisma.item.count({ where: { locationId } });
    return count > 0;
  }
}
