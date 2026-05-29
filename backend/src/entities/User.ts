export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserData = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>;
export type PublicUser = Omit<User, 'password'>;
