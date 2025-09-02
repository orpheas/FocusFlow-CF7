import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { routineController } from '../controllers/routine.controller';

export const routineRouter = Router();
routineRouter.use(requireAuth);

routineRouter.get('/', (req, res, next) => routineController.list(req, res).catch(next));
routineRouter.post('/', (req, res, next) => routineController.create(req, res).catch(next));
routineRouter.post('/materialize-today', (req, res, next) => routineController.materializeToday(req, res).catch(next));


