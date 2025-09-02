const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../dist/app').default;

function makeApp() {
  // Use default MemoryStore session
  return createApp();
}

describe('Auth', () => {
  let app;
  beforeAll(async () => {
    // connect mongoose to in-memory server by importing server's helper is complex, so connect to a mem server here
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    app = makeApp();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('registers and returns user', async () => {
    const agent = request.agent(app);
    const res = await agent.post('/auth/register').send({ email: 't1@example.com', password: 'pass1234' });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('t1@example.com');
    const me = await agent.get('/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('t1@example.com');
  });
});


