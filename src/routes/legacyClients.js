const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const clients = [];

// Obtener todos los clientes
router.get('/', (_req, res) => {
  res.json(clients);
});

// Crear un cliente
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const client = { id: uuidv4(), name, email, createdAt: new Date().toISOString() };
  clients.push(client);
  res.status(201).json(client);
});

// Obtener cliente por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const normalizedId = Number.isNaN(Number(id)) ? id : Number(id);
  const client = clients.find(c => c.id === normalizedId);
  if (!client) return res.status(404).json({ error: 'client not found' });
  const { password, ...safeClient } = client;
  res.json(safeClient);
});

// Actualizar cliente por id
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'client not found' });
  const removed = clients.splice(idx, 1)[0];
  res.json(removed);
});

module.exports = router;
