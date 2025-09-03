import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';

export const sessionController = {
  async start(req: Request, res: Response) {
    const user = (req.session as any).user;
    const s = await sessionService.start(user.id, req.body);
    res.status(201).json(s);
  },
  async stop(req: Request, res: Response) {
    const user = (req.session as any).user;
    const s = await sessionService.stop(user.id, req.params.id);
    res.json(s);
  },
  async list(req: Request, res: Response) {
    const user = (req.session as any).user;
    const { from, to } = req.query as any;
    const list = await sessionService.list(user.id, from, to);
    res.json(list);
  },
};



