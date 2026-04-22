import { IEmailService } from '../../adapters/services/IEmailService';

export class ConsoleEmailService implements IEmailService {
  async sendPasswordResetEmail(input: { to: string; code: string; resetLink: string }): Promise<void> {
    console.log(`[PasswordReset] destinatario=${input.to} codigo=${input.code} link=${input.resetLink}`);
  }
}

