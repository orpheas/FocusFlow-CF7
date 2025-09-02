import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth.routes';
import { taskRouter } from './routes/task.routes';
import { sessionRouter } from './routes/session.routes';
// Routines removed from MVP UI; keep API unmounted
// import { routineRouter } from './routes/routine.routes';
import { activityRouter } from './routes/activity.routes';
import { requireAuth } from './middleware/requireAuth';
import { sessionController } from './controllers/session.controller';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './docs/openapi';

export function createApp(sessionStore?: session.Store) {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true,
    })
  );

  app.use(
    session({
      name: config.cookieName,
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: sessionStore,
    })
  );

  // Swagger setup
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec as any));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/auth', authRouter);
  app.use('/tasks', taskRouter);
  app.use('/sessions', sessionRouter);
  // app.use('/routines', routineRouter);
  app.use('/activity', activityRouter);

  // Temporary explicit bindings to avoid any router mount issues
  app.get('/sessions', requireAuth, (req, res, next) => sessionController.list(req, res).catch(next));
  app.post('/sessions', requireAuth, (req, res, next) => sessionController.start(req, res).catch(next));
  app.patch('/sessions/:id/stop', requireAuth, (req, res, next) => sessionController.stop(req, res).catch(next));

  app.use(errorHandler);

  return app;
}

export default createApp;


