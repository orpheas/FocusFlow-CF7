import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { activityController } from '../controllers/activity.controller';

export const activityRouter = Router();
activityRouter.use(requireAuth);

activityRouter.get('/', (req, res, next) => activityController.list(req, res).catch(next));


