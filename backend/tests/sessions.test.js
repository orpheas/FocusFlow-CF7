const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../dist/app').default;

describe('Sessions', () => {
  let app, agent;
  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    app = createApp();
    agent = request.agent(app);
    await agent.post('/auth/register').send({ email: 't3@example.com', password: 'pass1234' });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('starts and stops a session', async () => {
    const start = await agent.post('/sessions').send({ plannedMinutes: 1, note: 'focus' });
    expect(start.status).toBe(201);
    const stop = await agent.patch(`/sessions/${start.body._id}/stop`).send();
    expect(stop.status).toBe(200);
    expect(typeof stop.body.actualMinutes).toBe('number');
  });
});



