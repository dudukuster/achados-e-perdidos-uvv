export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type PublicUser = Omit<User, 'password'>;
