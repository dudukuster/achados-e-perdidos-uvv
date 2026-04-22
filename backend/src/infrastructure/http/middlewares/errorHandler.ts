import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../../../shared/errors/AppError';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Cada imagem deve ter no maximo 5MB.' });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: 'No maximo 5 imagens por envio.' });
      return;
    }
    res.status(400).json({ error: 'Falha no upload das imagens.' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
}
