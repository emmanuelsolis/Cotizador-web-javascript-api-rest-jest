PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS clients (
  client_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  service_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  service_name TEXT NOT NULL,
  description  TEXT,
  price        REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  quote_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id    INTEGER NOT NULL,
  quote_date   TEXT NOT NULL,
  total_amount REAL,
  status       TEXT DEFAULT 'draft',
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quote_services (
  quote_id   INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  qty        REAL NOT NULL DEFAULT 1,
  price      REAL NOT NULL,
  line_total REAL NOT NULL,
  PRIMARY KEY (quote_id, service_id),
  FOREIGN KEY (quote_id) REFERENCES quotes(quote_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_id       INTEGER NOT NULL,
  payment_amount REAL NOT NULL,
  payment_date   TEXT NOT NULL,
  FOREIGN KEY (quote_id) REFERENCES quotes(quote_id) ON DELETE CASCADE
);
