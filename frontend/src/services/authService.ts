import api from './api';
import { AuthResponse } from '../types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse['user']> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async recoverPassword(email: string): Promise<void> {
    await api.post('/auth/recover-password', { email });
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post('/auth/reset-password', data);
  },
};
