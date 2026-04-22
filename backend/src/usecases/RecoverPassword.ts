import { createHash, randomInt } from 'crypto';
import { IPasswordResetTokenRepository } from '../adapters/repositories/IPasswordResetTokenRepository';
import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { IEmailService } from '../adapters/services/IEmailService';

interface RecoverPasswordInput {
  email: string;
}

export class RecoverPassword {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetTokenRepository: IPasswordResetTokenRepository,
    private emailService: IEmailService,
  ) {}

  async execute({ email }: RecoverPasswordInput): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    // Mensagem de retorno deve ser neutra para nao revelar existencia de conta.
    if (!user) return;

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const tokenHash = this.hashToken(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetTokenRepository.create({
      tokenHash,
      userId: user.id,
      expiresAt,
      maxAttempts: 5,
    });

    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(code)}`;

    await this.emailService.sendPasswordResetEmail({
      to: normalizedEmail,
      code,
      resetLink,
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}

