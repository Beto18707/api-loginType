import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from './config';

// Segurança: configura headers HTTP
export const securityMiddleware = helmet();

// Limita número de requisições por IP para prevenir ataques
export const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: { message: 'Muitas requisições, tente depois.' },
});

export const logger = morgan('combined');

export function validateUserInput(req: Request, res: Response, next: NextFunction): void {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    return;
  }
  next();
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }
    (req as any).user = user;
    next();
  });
}

export function authorizeRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }
    next();
  };
}
