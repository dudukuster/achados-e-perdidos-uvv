import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { ForbiddenError } from '../../shared/errors/AppError';

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'ADMIN') {
    next(new ForbiddenError('Acesso restrito a administradores.'));
    return;
  }
  next();
}
