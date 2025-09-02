import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', (req, res, next) => authController.register(req, res).catch(next));
authRouter.post('/login', (req, res, next) => authController.login(req, res).catch(next));
authRouter.get('/me', (req, res, next) => authController.me(req, res).catch(next));
authRouter.post('/logout', (req, res, next) => authController.logout(req, res).catch(next));


