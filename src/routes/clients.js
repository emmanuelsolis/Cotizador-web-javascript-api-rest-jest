const express = require('express');
const router = express.Router();
const clientsService = require('../services/clients');

module.exports = (db) => {
  router.get('/', async (req, res) => {
    const rows = await clientsService.listClients(db);
    res.json(rows);
  });

  router.get('/:id', async (req, res) => {
    const row = await clientsService.getClient(db, req.params.id);
    if (!row) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(row);
  });

  router.post('/', async (req, res) => {
    const { name, contact_info } = req.body;
    if (!name || !contact_info) return res.status(400).json({ error: 'name y contact_info son requeridos' });
    const created = await clientsService.createClient(db, { name, contact_info });
    res.status(201).json(created);
  });

  router.put('/:id', async (req, res) => {
    const existing = await clientsService.getClient(db, req.params.id);
    if (!existing) return res.status(404).json({ error: 'Cliente no encontrado' });
    const name = req.body.name ?? existing.name;
    const contact_info = req.body.contact_info ?? existing.contact_info;
    const updated = await clientsService.updateClient(db, req.params.id, { name, contact_info });
    res.json(updated);
  });

  router.delete('/:id', async (req, res) => {
    const removed = await clientsService.deleteClient(db, req.params.id);
    if (!removed) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(removed);
  });

  return router;
};
