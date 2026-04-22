import { CreateUserData, PublicUser, User } from '../../entities/User';
import { IUserRepository } from '../../adapters/repositories/IUserRepository';
import { prisma } from '../database/prismaClient';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<PublicUser> {
    const user = await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
