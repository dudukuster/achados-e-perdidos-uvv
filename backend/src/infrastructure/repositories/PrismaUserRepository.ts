import { CreateUserData, PublicUser, User } from '../../entities/User';
import { IUserRepository } from '../../adapters/repositories/IUserRepository';
import { prisma } from '../database/prismaClient';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<PublicUser> {
    const user = await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return user as PublicUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } }) as unknown as User | null;
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } }) as unknown as User | null;
  }

  async findAll(): Promise<PublicUser[]> {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    }) as unknown as PublicUser[];
  }

  async updateRole(userId: string, role: 'USER' | 'ADMIN'): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
