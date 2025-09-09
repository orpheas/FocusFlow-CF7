import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { sessionController } from '../controllers/session.controller';

export const sessionRouter = Router();
sessionRouter.use(requireAuth);

sessionRouter.post('/', (req, res, next) => sessionController.start(req, res).catch(next));
sessionRouter.patch('/:id/stop', (req, res, next) => sessionController.stop(req, res).catch(next));
sessionRouter.get('/', (req, res, next) => sessionController.list(req, res).catch(next));






