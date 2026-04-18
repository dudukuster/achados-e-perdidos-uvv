import { Comment, CreateCommentData, UpdateCommentData } from '../../entities/Comment';
import { ICommentRepository } from '../../adapters/repositories/ICommentRepository';
import { prisma } from '../database/prismaClient';

export class PrismaCommentRepository implements ICommentRepository {
  async create(data: CreateCommentData): Promise<Comment> {
    return prisma.comment.create({ data }) as unknown as Comment;
  }

  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id } }) as unknown as Comment | null;
  }

  async findByItemId(itemId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' },
    }) as unknown as Comment[];
  }

  async update(id: string, data: UpdateCommentData): Promise<Comment> {
    return prisma.comment.update({ where: { id }, data }) as unknown as Comment;
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
