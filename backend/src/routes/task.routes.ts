import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { taskController } from '../controllers/task.controller';

export const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.get('/', (req, res, next) => taskController.list(req, res).catch(next));
taskRouter.post('/', (req, res, next) => taskController.create(req, res).catch(next));
taskRouter.patch('/:id', (req, res, next) => taskController.update(req, res).catch(next));
taskRouter.post('/:id/done', (req, res, next) => taskController.done(req, res).catch(next));






