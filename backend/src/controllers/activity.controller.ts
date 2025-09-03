import { Request, Response } from 'express';
import { activityRepository } from '../repositories/activity.repo';

export const activityController = {
  async list(req: Request, res: Response) {
    const user = (req.session as any).user;
    const { from, to } = req.query as any;
    const items = await activityRepository.list(user.id, from, to);
    res.json(items);
  },
};



