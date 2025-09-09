import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req.session as any).user;
  if (!user) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  next();
}






