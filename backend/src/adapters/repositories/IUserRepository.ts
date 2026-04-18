import { CreateUserData, PublicUser, User } from '../../entities/User';

export interface IUserRepository {
  create(data: CreateUserData): Promise<PublicUser>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<PublicUser | null>;
}
