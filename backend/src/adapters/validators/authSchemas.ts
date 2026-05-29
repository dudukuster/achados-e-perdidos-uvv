import { z } from 'zod';

const institutionalEmail = z
  .string()
  .email('E-mail invalido.')
  .refine((value) => {
    const email = value.toLowerCase();
    return email.endsWith('@uvv.br') || email.endsWith('@uvvnet.com.br');
  }, {
    message: 'Use um e-mail institucional @uvv.br ou @uvvnet.com.br.',
  });

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
  email: institutionalEmail,
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});

export const loginSchema = z.object({
  email: institutionalEmail,
  password: z.string().min(1, 'Senha obrigatoria.'),
});

export const recoverPasswordSchema = z.object({
  email: institutionalEmail,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().regex(/^\d{6}$/, 'Codigo deve ter 6 digitos.'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'Confirmacao de senha obrigatoria.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });
