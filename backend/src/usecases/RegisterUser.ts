import bcrypt from 'bcrypt';
import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { PublicUser } from '../entities/User';
import { ConflictError } from '../shared/errors/AppError';

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterUserInput): Promise<PublicUser> {
    const normalizedEmail = email.toLowerCase();
    const isInstitutionalEmail =
      normalizedEmail.endsWith('@uvv.br') || normalizedEmail.endsWith('@uvvnet.com.br');

    if (!isInstitutionalEmail) {
      throw new Error('Somente e-mails institucionais @uvv.br ou @uvvnet.com.br sao permitidos.');
    }

    const existing = await this.userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('Este e-mail ja esta cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userRepository.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
  }
}
