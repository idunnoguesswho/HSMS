// Per-client Salus configuration and per-client data storage.
//
// Each client gets its own SQLite file under data/db/<slug>.sqlite - so one
// client's imported documents never land in another client's database.
// Client registry (name + Salus credentials) lives in data/clients.json.
// Both are local files, gitignored, mode 600: the Salus client_secret has
// to be stored in a form the server can read back to call the API with,
// so unlike the login password it cannot be a one-way hash.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_DIR = path.join(DATA_DIR, "db");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");

const openDbs = new Map();

fs.mkdirSync(DB_DIR, { recursive: true });

function slugify(name) {
  const base = String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || crypto.randomBytes(4).toString("hex");
}

function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(CLIENTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveRegistry(clients) {
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2), { mode: 0o600 });
}

export function listClients() {
  return loadRegistry().map(({ salusClientSecret, ...safe }) => ({
    ...safe,
    salusConfigured: Boolean(safe.salusClientId && salusClientSecret),
    docCount: dbFor(safe.slug).prepare("SELECT COUNT(*) AS n FROM documents").get().n,
  }));
}

export function getClient(id) {
  return loadRegistry().find((c) => c.id === id) || null;
}

export function addClient({ name, salusClientId, salusClientSecret, salusTokenUrl, salusApiBase }) {
  const clients = loadRegistry();
  const trimmedName = String(name || "").trim();
  if (!trimmedName) throw new Error("Client name is required.");

  let slug = slugify(trimmedName);
  let suffix = 2;
  while (clients.some((c) => c.slug === slug)) {
    slug = `${slugify(trimmedName)}-${suffix++}`;
  }

  const client = {
    id: crypto.randomBytes(8).toString("hex"),
    slug,
    name: trimmedName,
    salusClientId: String(salusClientId || "").trim(),
    salusClientSecret: String(salusClientSecret || "").trim(),
    salusTokenUrl: String(salusTokenUrl || "").trim() || undefined,
    salusApiBase: String(salusApiBase || "").trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  clients.push(client);
  saveRegistry(clients);
  dbFor(client.slug); // create its database up front
  return client;
}

export function updateClientSalusConfig(id, { salusClientId, salusClientSecret, salusTokenUrl, salusApiBase }) {
  const clients = loadRegistry();
  const client = clients.find((c) => c.id === id);
  if (!client) throw new Error("No such client.");

  if (salusClientId !== undefined) client.salusClientId = String(salusClientId).trim();
  if (salusClientSecret !== undefined && salusClientSecret !== "") client.salusClientSecret = String(salusClientSecret).trim();
  if (salusTokenUrl !== undefined) client.salusTokenUrl = String(salusTokenUrl).trim() || undefined;
  if (salusApiBase !== undefined) client.salusApiBase = String(salusApiBase).trim() || undefined;

  saveRegistry(clients);
  return client;
}

export function removeClient(id) {
  const clients = loadRegistry();
  const client = clients.find((c) => c.id === id);
  const remaining = clients.filter((c) => c.id !== id);
  saveRegistry(remaining);
  if (client) {
    // Windows refuses to delete a file with an open handle - close the
    // cached connection first, or the .sqlite file is orphaned on disk
    // even though the client is gone from the registry.
    if (openDbs.has(client.slug)) {
      openDbs.get(client.slug).close();
      openDbs.delete(client.slug);
    }
    const dbPath = path.join(DB_DIR, `${client.slug}.sqlite`);
    fs.rmSync(dbPath, { force: true });
  }
}

export function dbFor(slug) {
  if (openDbs.has(slug)) return openDbs.get(slug);

  const dbPath = path.join(DB_DIR, `${slug}.sqlite`);
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      salus_id TEXT PRIMARY KEY,
      name TEXT,
      path TEXT,
      updated_at TEXT,
      raw_json TEXT,
      imported_at TEXT NOT NULL
    )
  `);
  openDbs.set(slug, db);
  return db;
}

export function getClientDocuments(slug) {
  return dbFor(slug).prepare("SELECT salus_id, name, path, updated_at, imported_at FROM documents ORDER BY imported_at DESC").all();
}

export function saveImportedDocuments(slug, docs) {
  const db = dbFor(slug);
  const upsert = db.prepare(`
    INSERT INTO documents (salus_id, name, path, updated_at, raw_json, imported_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(salus_id) DO UPDATE SET
      name = excluded.name,
      path = excluded.path,
      updated_at = excluded.updated_at,
      raw_json = excluded.raw_json,
      imported_at = excluded.imported_at
  `);

  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    for (const doc of docs) {
      const id = String(doc.id ?? doc.document_id ?? crypto.randomUUID());
      upsert.run(id, doc.name || null, doc.path || null, doc.updated_at || doc.updatedAt || null, JSON.stringify(doc), now);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
