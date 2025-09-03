import { Request, Response } from 'express';
import { taskService } from '../services/task.service';

export const taskController = {
  async list(req: Request, res: Response) {
    const user = (req.session as any).user;
    const date = (req.query.date as string) || '';
    const tasks = await taskService.list(user.id, date);
    res.json(tasks);
  },

  async create(req: Request, res: Response) {
    const user = (req.session as any).user;
    const task = await taskService.create(user.id, req.body);
    res.status(201).json(task);
  },

  async update(req: Request, res: Response) {
    const user = (req.session as any).user;
    const updated = await taskService.update(user.id, req.params.id, req.body);
    res.json(updated);
  },

  async done(req: Request, res: Response) {
    const user = (req.session as any).user;
    const task = await taskService.markDone(user.id, req.params.id);
    res.json(task);
  },
};



