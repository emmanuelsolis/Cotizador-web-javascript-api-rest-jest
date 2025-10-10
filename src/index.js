const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Init DB and mount routers
let db;
(async () => {
  db = await initDb();
  // Mount clients router lazily
  const clientsRouter = require('./routes/clients')(db);
  app.use('/api/clients', clientsRouter);
  console.log('DB initialized and routers mounted');
})().catch((e) => {
  console.error('DB init error:', e);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = { app };
    const client = clients.find(c => c.id === normalizedId);
