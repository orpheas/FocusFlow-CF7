import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const user = await authService.register(email, password, name);
    // create session
    (req.session as any).user = user;
    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    (req.session as any).user = user;
    res.json(user);
  },

  async me(req: Request, res: Response) {
    res.json((req.session as any).user || null);
  },

  async logout(req: Request, res: Response) {
    req.session.destroy(() => {});
    res.json({ ok: true });
  },
};



