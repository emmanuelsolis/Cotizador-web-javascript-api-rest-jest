const request = require('supertest');
const { app } = require('../src/index');

describe('Clients API (sqlite memory)', () => {
  let server;
  beforeAll((done) => {
    process.env.DB_PATH = ':memory:';
    // require app already initializes DB on import; give it a moment
    server = app.listen(0, () => done());
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
});
