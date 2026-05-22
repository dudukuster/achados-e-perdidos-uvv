import { CreateUserData, PublicUser, User } from '../../entities/User';

export interface IUserRepository {
  create(data: CreateUserData): Promise<PublicUser>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<PublicUser[]>;
  updateRole(userId: string, role: 'USER' | 'ADMIN'): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
