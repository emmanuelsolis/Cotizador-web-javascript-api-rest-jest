const request = require('supertest');

describe('Clients API (sqlite memory)', () => {
  let server;
  beforeAll((done) => {
    process.env.DB_PATH = ':memory:';
    // require app after setting env to ensure initDb uses in-memory DB
    const mod = require('../src/index');
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
});
