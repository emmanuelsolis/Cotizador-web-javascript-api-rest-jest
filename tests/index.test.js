const request = require('supertest');

require('../src/index'); // starts the server on port 3000
const api = request('http://localhost:3000');

describe('clients API', () => {
    let createdClient;

    test('POST /clients - missing fields returns 400', async () => {
        const res = await api.post('/clients').send({ name: 'OnlyName' }).expect(400);
        expect(res.body).toHaveProperty('error', 'name and email are required');
    });

    test('POST /clients - valid payload returns 201 and client object', async () => {
        const payload = { name: `Test ${Date.now()}`, email: `test${Date.now()}@example.com` };
        const res = await api.post('/clients').send(payload).expect(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toMatchObject({ name: payload.name, email: payload.email });
        expect(res.body).toHaveProperty('createdAt');
        createdClient = res.body;
    });

    test('GET /clients/:id - returns the created client', async () => {
        const res = await api.get(`/clients/${createdClient.id}`).expect(200);
        expect(res.body).toMatchObject(createdClient);
    });

    test('GET /clients - returns an array that includes the created client', async () => {
        const res = await api.get('/clients').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        const found = res.body.find(c => c.id === createdClient.id);
        expect(found).toBeDefined();
        expect(found).toMatchObject({ id: createdClient.id, name: createdClient.name, email: createdClient.email });
    });

    test('GET /clients/:id - non-existent id returns 404', async () => {
        const res = await api.get('/clients/non-existent-id-xyz').expect(404);
        expect(res.body).toHaveProperty('error', 'client not found');
    });
});
describe('clients API - idx (update/delete) tests', () => {
	let client;

	beforeAll(async () => {
		const payload = { name: `IdxTest ${Date.now()}`, email: `idx${Date.now()}@example.com` };
		const res = await api.post('/clients').send(payload).expect(201);
		client = res.body;
	});

	test('PUT /clients/:id - update name returns 200 and sets updatedAt', async () => {
		const newName = `Updated ${Date.now()}`;
		const res = await api.put(`/clients/${client.id}`).send({ name: newName }).expect(200);
		expect(res.body).toHaveProperty('id', client.id);
		expect(res.body).toHaveProperty('name', newName);
		expect(res.body).toHaveProperty('email', client.email);
		expect(res.body).toHaveProperty('updatedAt');
		client = res.body;
	});

	test('PUT /clients/:id - nothing to update returns 400', async () => {
		const res = await api.put(`/clients/${client.id}`).send({}).expect(400);
		expect(res.body).toHaveProperty('error', 'nothing to update');
	});

	test('PUT /clients/:id - non-existent id returns 404', async () => {
		const res = await api.put('/clients/non-existent-id-idx').send({ name: 'Nope' }).expect(404);
		expect(res.body).toHaveProperty('error', 'client not found');
	});

	test('DELETE /clients/:id - deletes the client and returns it', async () => {
		const res = await api.delete(`/clients/${client.id}`).expect(200);
		expect(res.body).toHaveProperty('id', client.id);
		expect(res.body).toHaveProperty('name', client.name);
		expect(res.body).toHaveProperty('email', client.email);
	});

	test('GET /clients/:id - after delete returns 404', async () => {
		const res = await api.get(`/clients/${client.id}`).expect(404);
		expect(res.body).toHaveProperty('error', 'client not found');
	});

	test('GET /clients - deleted client is not present in list', async () => {
		const res = await api.get('/clients').expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		const found = res.body.find(c => c.id === client.id);
		expect(found).toBeUndefined();
	});
});