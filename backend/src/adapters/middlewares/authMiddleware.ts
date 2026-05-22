import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: 'USER' | 'ADMIN';
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    res.status(500).json({ error: 'Configuração do servidor inválida.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string; userRole?: 'USER' | 'ADMIN' };
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
