// Basic OpenAPI 3.0 spec for FocusFlow API
// Note: Keep in sync with controllers/routes for accuracy

const components = {
  schemas: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string', nullable: true },
        role: { type: 'string', enum: ['USER', 'ADMIN'] },
      },
      required: ['id', 'email', 'role'],
    },
    Task: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { type: 'string' },
        title: { type: 'string' },
        notes: { type: 'string', nullable: true },
        lane: { type: 'string', enum: ['NOW', 'NEXT', 'LATER'] },
        status: { type: 'string', enum: ['TODO', 'DOING', 'DONE', 'SKIPPED'] },
        energy: { type: 'string', enum: ['LOW', 'MED', 'HIGH'], nullable: true },
        friction: { type: 'integer', minimum: 0, maximum: 3, nullable: true },
        estimateMin: { type: 'integer', nullable: true },
        scheduledFor: { type: 'string', description: 'YYYY-MM-DD', nullable: true },
        dueAt: { type: 'string', format: 'date-time', nullable: true },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['_id', 'userId', 'title', 'lane', 'status'],
    },
    FocusSession: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { type: 'string' },
        taskId: { type: 'string', nullable: true },
        startedAt: { type: 'string', format: 'date-time' },
        endedAt: { type: 'string', format: 'date-time', nullable: true },
        plannedMinutes: { type: 'integer', nullable: true },
        actualMinutes: { type: 'integer', nullable: true },
        note: { type: 'string', nullable: true },
      },
      required: ['_id', 'userId', 'startedAt'],
    },
    Routine: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { type: 'string' },
        title: { type: 'string' },
        rrule: { type: 'string', enum: ['DAILY', 'WEEKLY'] },
        energy: { type: 'string', enum: ['LOW', 'MED', 'HIGH'], nullable: true },
        friction: { type: 'integer', minimum: 0, maximum: 3, nullable: true },
        estimateMin: { type: 'integer', nullable: true },
        preferredWindow: { type: 'string', nullable: true },
      },
      required: ['_id', 'userId', 'title', 'rrule'],
    },
    Error: {
      type: 'object',
      properties: { error: { type: 'string' } },
      required: ['error'],
    },
  },
};

export const openapiSpec = {
  openapi: '3.0.0',
  info: { title: 'FocusFlow API', version: '1.0.0' },
  components,
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' } }, required: ['email', 'password'] } } },
        },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '400': { description: 'Bad request' }, '409': { description: 'Email taken' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '401': { description: 'Unauthorized' } },
      },
    },
    '/auth/me': {
      get: { summary: 'Current user', responses: { '200': { description: 'OK' } } },
    },
    '/auth/logout': {
      post: { summary: 'Logout', responses: { '200': { description: 'OK' } } },
    },
    '/tasks': {
      get: {
        summary: 'List tasks by date',
        parameters: [{ name: 'date', in: 'query', required: false, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } }, '401': { description: 'Unauthorized' } },
      },
      post: {
        summary: 'Create task',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } }, '400': { description: 'Bad request' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/tasks/{id}': {
      patch: {
        summary: 'Update task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } }, '404': { description: 'Not found' } },
      },
    },
    '/tasks/{id}/done': {
      post: {
        summary: 'Mark task done',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } } },
      },
    },
    '/sessions': {
      get: {
        summary: 'List sessions',
        parameters: [
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/FocusSession' } } } } } },
      },
      post: {
        summary: 'Start session',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { taskId: { type: 'string' }, plannedMinutes: { type: 'integer' }, note: { type: 'string' } } } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/FocusSession' } } } } },
      },
    },
    '/sessions/{id}/stop': {
      patch: {
        summary: 'Stop session',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/FocusSession' } } } } },
      },
    },
    '/routines': {
      get: { summary: 'List routines', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Routine' } } } } } } },
      post: {
        summary: 'Create routine',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Routine' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Routine' } } } } },
      },
    },
    '/routines/materialize-today': {
      post: {
        summary: 'Materialize routines into today tasks',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } } },
      },
    },
  },
};

export default openapiSpec;



