// Minimal data-access helpers for clients
const { run, all, get } = require('../db');

async function listClients(db) {
  return all(db, 'SELECT * FROM clients ORDER BY client_id DESC');
}

async function getClient(db, id) {
  return get(db, 'SELECT * FROM clients WHERE client_id = ?', [id]);
}

async function createClient(db, { name, contact_info }) {
  await run(db, 'INSERT INTO clients (name, contact_info) VALUES (?, ?);', [name, contact_info]);
  return get(db, 'SELECT * FROM clients ORDER BY client_id DESC LIMIT 1');
}

async function updateClient(db, id, { name, contact_info }) {
  await run(db, 'UPDATE clients SET name = ?, contact_info = ? WHERE client_id = ?;', [name, contact_info, id]);
  return get(db, 'SELECT * FROM clients WHERE client_id = ?', [id]);
}

async function deleteClient(db, id) {
  const existing = await getClient(db, id);
  if (!existing) return null;
  await run(db, 'DELETE FROM clients WHERE client_id = ?', [id]);
  return existing;
}

module.exports = { listClients, getClient, createClient, updateClient, deleteClient };
