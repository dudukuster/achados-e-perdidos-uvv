import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z.string().min(1, 'Comentário não pode ser vazio.').max(1000, 'Comentário muito longo.'),
});

export const updateCommentSchema = z.object({
  text: z.string().min(1, 'Comentário não pode ser vazio.').max(1000, 'Comentário muito longo.'),
});
