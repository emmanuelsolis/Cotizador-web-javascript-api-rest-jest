const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Mount legacy in-memory clients endpoints for backwards compatibility
const legacyClients = require('./routes/legacyClients');
app.use('/clients', legacyClients);

// Init DB and mount routers
let db;
let readyResolve;
const ready = new Promise((r) => { readyResolve = r; });
(async () => {
  db = await initDb();
  // Store db in app for testing purposes
  app.db = db;
  // Mount clients router lazily (defensive: avoid crashing tests if the module shape differs)
  try {
    const clientsModule = require('./routes/clients');
    let clientsRouter = null;
    if (typeof clientsModule === 'function') {
      clientsRouter = clientsModule(app);
    } else if (clientsModule && typeof clientsModule.default === 'function') {
      clientsRouter = clientsModule.default(app);
    }
    if (clientsRouter) app.use('/api/clients', clientsRouter);
    else console.warn('clients router module loaded but did not export a function');
  } catch (e) {
    console.error('Failed to mount /api/clients router:', e);
  }
  console.log('DB initialized and routers mounted');
  if (typeof readyResolve === 'function') readyResolve();
})().catch((e) => {
  console.error('DB init error:', e);
  if (process.env.NODE_ENV !== 'test') process.exit(1);
});

const PORT = process.env.PORT || 3000;
let server = null;
// Only start the server if this file is run directly (not imported by tests)
if (require.main === module) {
  server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = { app, ready, server };

