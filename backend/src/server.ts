import mongoose from 'mongoose';
import createApp from './app';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from './config';

async function connectMongoWithFallback(uri: string): Promise<{ usedFallback: boolean }> {
  try {
    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
    return { usedFallback: false };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('MongoDB not available, starting in-memory server for dev...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri();
    await mongoose.connect(memUri);
    // eslint-disable-next-line no-console
    console.log('Connected to in-memory MongoDB');
    return { usedFallback: true };
  }
}

async function start() {
  const { usedFallback } = await connectMongoWithFallback(config.mongoUri);

  // Use MongoStore only when connected to a real Mongo instance
  let store: session.Store | undefined;
  if (!usedFallback) {
    try {
      store = MongoStore.create({ mongoUrl: config.mongoUri });
    } catch {
      // leave undefined to use MemoryStore
    }
  }

  const app = createApp(store);
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${config.port}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger UI at http://localhost:${config.port}/docs`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


