import bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { IPasswordResetTokenRepository } from '../adapters/repositories/IPasswordResetTokenRepository';
import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { BadRequestError } from '../shared/errors/AppError';

interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export class ResetPassword {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
  ) {}

  async execute({ token, password, confirmPassword }: ResetPasswordInput): Promise<void> {
    const tokenHash = this.hashToken(token);
    const resetToken = await this.passwordResetTokenRepository.findByTokenHash(tokenHash);

    if (!resetToken) {
      throw new BadRequestError('Código de recuperação inválido.');
    }

    if (resetToken.usedAt) {
      throw new BadRequestError('Este código já foi utilizado.');
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      throw new BadRequestError('Código de recuperação expirado.');
    }

    if (resetToken.attempts >= resetToken.maxAttempts) {
      throw new BadRequestError('Código bloqueado por excesso de tentativas.');
    }

    if (password !== confirmPassword) {
      await this.passwordResetTokenRepository.incrementAttempts(resetToken.id);
      throw new BadRequestError('As senhas precisam ser iguais.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userRepository.updatePassword(resetToken.userId, hashedPassword);
    await this.passwordResetTokenRepository.markAsUsed(resetToken.id);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}

