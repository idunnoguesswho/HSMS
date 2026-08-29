import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

import { config as loadEnv } from "dotenv";
loadEnv({ path: path.join(__dirname, ".env") });

import express from "express";
import cookieParser from "cookie-parser";
import { requireAuth, attachAuthRoutes } from "./auth.js";
import { isConfigured, searchDocuments } from "./salus.js";
import { listClients, getClient, addClient, updateClientSalusConfig, removeClient, saveImportedDocuments, getClientDocuments } from "./clients.js";
import { grafanaDashboardHandler } from "./grafana.js";

const PORT = Number(process.env.PORT || 8099);

const app = express();
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public: the login page, the shared stylesheet it needs, and the login/logout API.
app.get("/login.html", (req, res) => res.sendFile(path.join(ROOT, "login.html")));
app.get("/hsms.css", (req, res) => res.sendFile(path.join(ROOT, "hsms.css")));
attachAuthRoutes(app);

// Everything past this point requires a valid session.
app.use(requireAuth);

// --- Clients: each has its own Salus credentials and its own SQLite db ---

app.get("/api/clients", (req, res) => {
  res.json({ clients: listClients() });
});

app.post("/api/clients", (req, res) => {
  try {
    const client = addClient(req.body || {});
    const { salusClientSecret, ...safe } = client;
    res.status(201).json({ client: safe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/clients/:id/salus", (req, res) => {
  try {
    const client = updateClientSalusConfig(req.params.id, req.body || {});
    const { salusClientSecret, ...safe } = client;
    res.json({ client: safe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/clients/:id", (req, res) => {
  removeClient(req.params.id);
  res.json({ ok: true });
});

app.get("/api/clients/:id/grafana-dashboard", grafanaDashboardHandler(getClient, getClientDocuments));

// --- Salus import, scoped to one client at a time ---

app.post("/api/salus/import", async (req, res) => {
  const clientId = String(req.body?.clientId || "");
  const client = clientId && getClient(clientId);
  if (!client) {
    return res.status(400).json({ error: "Pick a client first — add one below if none exist yet." });
  }
  if (!isConfigured(client)) {
    return res.status(400).json({ error: `${client.name} has no Salus client ID/secret configured yet.` });
  }

  const term = String(req.body?.search || "");

  try {
    const results = await searchDocuments(client, term);
    const docs = results?.data || results?.items || (Array.isArray(results) ? results : []);
    if (Array.isArray(docs) && docs.length) {
      saveImportedDocuments(client.slug, docs);
    }
    res.json({ ok: true, results, imported: Array.isArray(docs) ? docs.length : 0 });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.use(express.static(ROOT, { extensions: ["html"] }));

app.listen(PORT, () => {
  console.log(`HSMS server listening on http://localhost:${PORT}`);
  if (!process.env.HSMS_AUTH_HASH) {
    console.warn("No HSMS_AUTH_HASH set in server/.env — run `npm run set-password` before relying on the login gate.");
  }
});
