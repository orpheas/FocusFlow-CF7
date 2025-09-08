import { Request, Response } from 'express';
import { routineService } from '../services/routine.service';

export const routineController = {
  async list(req: Request, res: Response) {
    const user = (req.session as any).user;
    const list = await routineService.list(user.id);
    res.json(list);
  },
  async create(req: Request, res: Response) {
    const user = (req.session as any).user;
    const r = await routineService.create(user.id, req.body);
    res.status(201).json(r);
  },
  async materializeToday(req: Request, res: Response) {
    const user = (req.session as any).user;
    const created = await routineService.materializeToday(user.id);
    res.json(created);
  },
};





