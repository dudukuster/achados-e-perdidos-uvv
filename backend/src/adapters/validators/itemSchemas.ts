import { z } from 'zod';
import { Category, Location, Status } from '../../entities/Item';

const imageUrlSchema = z.string().url('URL da imagem invalida.');

export const createItemSchema = z.object({
  title: z.string().min(3, 'Titulo deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres.'),
  category: z.nativeEnum(Category),
  location: z.nativeEnum(Location),
  lostDate: z.string().transform((val) => new Date(val)),
  images: z.array(imageUrlSchema).min(1, 'Envie pelo menos 1 imagem.').max(5, 'Maximo de 5 imagens por item.'),
});

export const updateItemSchema = z
  .object({
    title: z.string().min(3, 'Titulo deve ter pelo menos 3 caracteres.').optional(),
    description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres.').optional(),
    category: z.nativeEnum(Category).optional(),
    location: z.nativeEnum(Location).optional(),
    lostDate: z.string().transform((val) => new Date(val)).optional(),
    status: z.nativeEnum(Status).optional(),
    images: z.array(imageUrlSchema).min(1, 'Envie pelo menos 1 imagem.').max(5, 'Maximo de 5 imagens por item.').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nenhum campo para atualizar.' });
