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
    if (!email.toLowerCase().endsWith('@uvv.br')) {
      throw new Error('Somente e-mails institucionais @uvv.br são permitidos.');
    }

    const existing = await this.userRepository.findByEmail(email.toLowerCase());
    if (existing) {
      throw new ConflictError('Este e-mail já está cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
  }
}
