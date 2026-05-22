import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { UnauthorizedError } from '../shared/errors/AppError';

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginUserOutput {
  token: string;
  user: { id: string; name: string; email: string; role: 'USER' | 'ADMIN' };
}

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError('E-mail ou senha incorretos.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('E-mail ou senha incorretos.');
    }

    const secret = process.env['JWT_SECRET'];
    if (!secret) throw new Error('JWT_SECRET não configurado.');

    const token = jwt.sign({ userId: user.id, userRole: user.role }, secret, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
