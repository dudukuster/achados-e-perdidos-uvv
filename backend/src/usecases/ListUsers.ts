import { IUserRepository } from '../adapters/repositories/IUserRepository';
import { PublicUser } from '../entities/User';

export class ListUsers {
  constructor(private userRepository: IUserRepository) {}
  async execute(): Promise<PublicUser[]> {
    return this.userRepository.findAll();
  }
}
