const fs = require('fs');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'cotizador.db');
if (fs.existsSync(dbPath)) {
  fs.rmSync(dbPath);
  console.log('DB removed:', dbPath);
} else {
  console.log('No DB to remove at', dbPath);
}
process.exit(0);
