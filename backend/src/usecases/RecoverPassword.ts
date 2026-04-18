import { IUserRepository } from '../adapters/repositories/IUserRepository';

interface RecoverPasswordInput {
  email: string;
}

export class RecoverPassword {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email }: RecoverPasswordInput): Promise<void> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    // Não revelamos se o e-mail existe ou não por segurança
    if (!user) return;

    // TODO: integrar com serviço de e-mail (Nodemailer, SendGrid, etc.)
    // Por ora, apenas loga que o e-mail seria enviado
    console.log(`[RecoverPassword] Link de recuperação seria enviado para: ${email}`);
  }
}
