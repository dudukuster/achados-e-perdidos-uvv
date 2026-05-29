import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { NotFoundError } from '../shared/errors/AppError';

export class UpdateUserRole {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string, role: 'USER' | 'ADMIN'): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('Usuário não encontrado.');
    await this.userRepository.updateRole(userId, role);
  }
}
