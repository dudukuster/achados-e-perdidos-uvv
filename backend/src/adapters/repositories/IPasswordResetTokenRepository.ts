import { CreatePasswordResetTokenData, PasswordResetToken } from '../../entities/PasswordResetToken';

export interface IPasswordResetTokenRepository {
  create(data: CreatePasswordResetTokenData): Promise<PasswordResetToken>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
  incrementAttempts(id: string): Promise<PasswordResetToken>;
  markAsUsed(id: string): Promise<void>;
}

