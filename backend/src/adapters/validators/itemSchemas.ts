import { z } from 'zod';
import { Category, Location, Status } from '../../entities/Item';

export const createItemSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres.'),
  category: z.nativeEnum(Category),
  location: z.nativeEnum(Location),
  lostDate: z.string().transform((val) => new Date(val)),
  photoUrl: z.string().url('URL da foto inválida.'),
});

export const updateItemSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres.').optional(),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres.').optional(),
  category: z.nativeEnum(Category).optional(),
  location: z.nativeEnum(Location).optional(),
  lostDate: z.string().transform((val) => new Date(val)).optional(),
  photoUrl: z.string().url('URL da foto inválida.').optional(),
  status: z.nativeEnum(Status).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'Nenhum campo para atualizar.' });
