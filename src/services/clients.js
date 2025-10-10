// Minimal data-access helpers for clients
const { run, all, get } = require('../db');

async function listClients(db) {
  const rows = await all(db, 'SELECT * FROM clients ORDER BY client_id DESC');
  return rows.map(r => ({
    client_id: r.client_id,
    id: r.client_id,
    name: r.name,
    contact_info: r.contact_info,
    email: r.contact_info,
    createdAt: r.created_at
  }));
}

async function getClient(db, id) {
  const r = await get(db, 'SELECT * FROM clients WHERE client_id = ?', [id]);
  if (!r) return null;
  return {
    client_id: r.client_id,
    id: r.client_id,
    name: r.name,
    contact_info: r.contact_info,
    email: r.contact_info,
    createdAt: r.created_at
  };
}

async function createClient(db, { name, contact_info }) {
  // support legacy `email` field
  const contact = contact_info || (arguments[1] && arguments[1].email) || null;
  await run(db, 'INSERT INTO clients (name, contact_info) VALUES (?, ?);', [name, contact]);
  const r = await get(db, 'SELECT * FROM clients ORDER BY client_id DESC LIMIT 1');
  return {
    client_id: r.client_id,
    id: r.client_id,
    name: r.name,
    contact_info: r.contact_info,
    email: r.contact_info,
    createdAt: r.created_at
  };
}

async function updateClient(db, id, { name, contact_info }) {
  // allow passing `email` as legacy field
  const contact = (contact_info === undefined) ? undefined : contact_info;
  if (contact === undefined) {
    // nothing to change in contact_info
    await run(db, 'UPDATE clients SET name = ? WHERE client_id = ?;', [name, id]);
  } else {
    await run(db, 'UPDATE clients SET name = ?, contact_info = ? WHERE client_id = ?;', [name, contact, id]);
  }
  const r = await get(db, 'SELECT * FROM clients WHERE client_id = ?', [id]);
  return {
    client_id: r.client_id,
    id: r.client_id,
    name: r.name,
    contact_info: r.contact_info,
    email: r.contact_info,
    createdAt: r.created_at,
    updatedAt: new Date().toISOString()
  };
}

async function deleteClient(db, id) {
  const existing = await get(db, 'SELECT * FROM clients WHERE client_id = ?', [id]);
  if (!existing) return null;
  await run(db, 'DELETE FROM clients WHERE client_id = ?', [id]);
  return {
    client_id: existing.client_id,
    id: existing.client_id,
    name: existing.name,
    contact_info: existing.contact_info,
    email: existing.contact_info,
    createdAt: existing.created_at
  };
}

module.exports = { listClients, getClient, createClient, updateClient, deleteClient };
