import { z } from 'zod';
import { Status } from '../../entities/Item';

const imageUrlSchema = z.string().url('URL da imagem inválida.');

export const createItemSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres.'),
  categoryId: z.string().uuid('Categoria inválida.'),
  locationId: z.string().uuid('Local inválido.'),
  lostDate: z.string().transform((val) => new Date(val)),
  images: z.array(imageUrlSchema).min(1, 'Envie pelo menos 1 imagem.').max(5, 'Máximo de 5 imagens por item.'),
});

export const updateItemSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    categoryId: z.string().uuid().optional(),
    locationId: z.string().uuid().optional(),
    lostDate: z.string().transform((val) => new Date(val)).optional(),
    status: z.nativeEnum(Status).optional(),
    images: z.array(imageUrlSchema).min(1).max(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nenhum campo para atualizar.' });
