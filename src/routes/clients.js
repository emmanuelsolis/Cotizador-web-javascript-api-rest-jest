const express = require('express');
const router = express.Router();
const clientsService = require('../services/clients');

module.exports = (app) => {
  router.get('/', async (req, res) => {
    try {
      const rows = await clientsService.listClients(app.db);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const row = await clientsService.getClient(app.db, req.params.id);
      if (!row) return res.status(404).json({ error: 'Client not found' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { name, contact_info } = req.body;
      if (!name || !contact_info) return res.status(400).json({ error: 'name and contact_info are required' });
      const created = await clientsService.createClient(app.db, { name, contact_info });
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const existing = await clientsService.getClient(app.db, req.params.id);
      if (!existing) return res.status(404).json({ error: 'Client not found' });
      const name = req.body.name ?? existing.name;
      const contact_info = req.body.contact_info ?? existing.contact_info;
      const updated = await clientsService.updateClient(app.db, req.params.id, { name, contact_info });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const removed = await clientsService.deleteClient(app.db, req.params.id);
      if (!removed) return res.status(404).json({ error: 'Client not found' });
      res.json(removed);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};
