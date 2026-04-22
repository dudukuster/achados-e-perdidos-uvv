import { IPasswordResetTokenRepository } from '../../adapters/repositories/IPasswordResetTokenRepository';
import { CreatePasswordResetTokenData, PasswordResetToken } from '../../entities/PasswordResetToken';
import { prisma } from '../database/prismaClient';

export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  async create(data: CreatePasswordResetTokenData): Promise<PasswordResetToken> {
    return (prisma as any).passwordResetToken.create({ data }) as Promise<PasswordResetToken>;
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return (prisma as any).passwordResetToken.findUnique({ where: { tokenHash } }) as Promise<PasswordResetToken | null>;
  }

  async incrementAttempts(id: string): Promise<PasswordResetToken> {
    return (prisma as any).passwordResetToken.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    }) as Promise<PasswordResetToken>;
  }

  async markAsUsed(id: string): Promise<void> {
    await (prisma as any).passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}

