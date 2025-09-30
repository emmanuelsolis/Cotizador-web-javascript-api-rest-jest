const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const clients = [];

// Obtener todos los clientes
app.get('/clients', (req, res) => {
	// puede añadirse paginación/filtrado aquí
	res.json(clients);
});

// Crear un cliente
app.post('/clients', (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		return res.status(400).json({ error: 'name and email are required' });
	}
	const client = { id: uuidv4(), name, email, createdAt: new Date().toISOString() };
	clients.push(client);
	res.status(201).json(client);
});

// Obtener cliente por id
app.get('/clients/:id', (req, res) => {
    const { id } = req.params;
    const normalizedId = Number.isNaN(Number(id)) ? id : Number(id);
    const client = clients.find(c => c.id === normalizedId);
    if (!client) return res.status(404).json({ error: 'client not found' });
    const { password, ...safeClient } = client; // remove sensitive fields
    res.json(safeClient);
});

// Actualizar cliente por id
app.put('/clients/:id', (req, res) => {
	const { id } = req.params;
	const { name, email } = req.body;
	const idx = clients.findIndex(c => c.id === id);
	if (idx === -1) return res.status(404).json({ error: 'client not found' });
	if (!name && !email) return res.status(400).json({ error: 'nothing to update' });

	if (name) clients[idx].name = name;
	if (email) clients[idx].email = email;
	clients[idx].updatedAt = new Date().toISOString();

	res.json(clients[idx]);
});

// Eliminar cliente por id
app.delete('/clients/:id', (req, res) => {
	const { id } = req.params;
	const idx = clients.findIndex(c => c.id === id);
	if (idx === -1) return res.status(404).json({ error: 'client not found' });
	const removed = clients.splice(idx, 1)[0];
	res.json(removed);
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
