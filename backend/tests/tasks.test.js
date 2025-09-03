const request = require('supertest');
const mongoose = require('mongoose');
const createApp = require('../dist/app').default;

describe('Tasks', () => {
  let app, agent, date;
  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    app = createApp();
    agent = request.agent(app);
    await agent.post('/auth/register').send({ email: 't2@example.com', password: 'pass1234' });
    date = new Date().toISOString().slice(0, 10);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('rejects empty title', async () => {
    const res = await agent.post('/tasks').send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('creates and lists tasks for today', async () => {
    const created = await agent.post('/tasks').send({ title: 'Hello' });
    expect(created.status).toBe(201);
    const list = await agent.get(`/tasks?date=${date}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.find(t => t.title === 'Hello')).toBeTruthy();
  });

  it('marks task done', async () => {
    const created = await agent.post('/tasks').send({ title: 'Done me' });
    const done = await agent.post(`/tasks/${created.body._id}/done`).send();
    expect(done.status).toBe(200);
    expect(done.body.status).toBe('DONE');
  });
});



