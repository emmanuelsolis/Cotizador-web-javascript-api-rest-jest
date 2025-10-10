const request = require('supertest');

describe('Clients API (sqlite memory)', () => {
  let server;
  let app;
  beforeAll((done) => {
    process.env.DB_PATH = ':memory:';
    // require app after setting env to ensure initDb uses in-memory DB
    const mod = require('../src/index');
    app = mod.app;
    // wait for DB ready
    mod.ready.then(() => {
      server = mod.app.listen(0, () => done());
    }).catch(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('create and fetch client', async () => {
    const client = { name: 'ACME', contact_info: 'acme@example.com' };
    const res = await request(server).post('/api/clients').send(client).expect(201);
    expect(res.body).toHaveProperty('client_id');
    const id = res.body.client_id;
    const getRes = await request(server).get(`/api/clients/${id}`).expect(200);
    expect(getRes.body.name).toBe(client.name);
  });

  test('fail to create client with missing name', async () => {
    const client = { contact_info: 'acme@example.com' };
    const res = await request(server).post('/api/clients').send(client);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  test('fail to fetch client with invalid id', async () => {
    const res = await request(server).get('/api/clients/invalid-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('fail to fetch non-existent client', async () => {
    const res = await request(server).get('/api/clients/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('simulate database error on create', async () => {
    // Temporarily override app's db to simulate error
    const originalDb = app.db;
    app.db = null;
    const client = { name: 'ACME', contact_info: 'acme@example.com' };
    const res = await request(server).post('/api/clients').send(client);
    expect(res.status).toBeGreaterThanOrEqual(500);
    app.db = originalDb;
  });
});
