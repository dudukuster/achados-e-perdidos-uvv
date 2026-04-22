import nodemailer from 'nodemailer';
import { IEmailService } from '../../adapters/services/IEmailService';

export class NodemailerEmailService implements IEmailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env['SMTP_HOST'],
    port: Number(process.env['SMTP_PORT'] ?? 587),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth:
      process.env['SMTP_USER'] && process.env['SMTP_PASS']
        ? {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASS'],
          }
        : undefined,
  });

  async sendPasswordResetEmail(input: { to: string; code: string; resetLink: string }): Promise<void> {
    const from = process.env['SMTP_FROM'] ?? 'no-reply@uvv.br';

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: 'Recuperacao de senha - UVV Achados e Perdidos',
      text: `Use este link para redefinir sua senha: ${input.resetLink}\n\nValidade: 15 minutos.`,
    });
  }
}
