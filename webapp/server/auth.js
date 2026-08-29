// Session auth for the HSMS gate.
//
// Isolated on purpose: this does not share Snowflake's Postgres session
// store or user table. One shared login, sessions kept in a local JSON
// file under data/ (gitignored) so a restart doesn't sign everyone out
// but nothing here depends on the wider ekat stack. Lives in data/ - not
// the server/ directory itself - because that's the only path the
// production systemd unit's ProtectSystem=strict leaves writable.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPassword, DUMMY_HASH } from "./passwords.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

export const COOKIE_NAME = "hsms_sid";
const SESSION_DAYS = 7;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

const MAX_FAILURES = 8;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map(); // ip -> [timestamps]

function loadSessions() {
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveSessions(sessions) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions), { mode: 0o600 });
}

function pruneSessions(sessions) {
  const now = Date.now();
  for (const [id, s] of Object.entries(sessions)) {
    if (s.expires < now) delete sessions[id];
  }
  return sessions;
}

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket?.remoteAddress || "unknown";
}

function isLockedOut(ip) {
  const now = Date.now();
  const recent = (failures.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  failures.set(ip, recent);
  return recent.length >= MAX_FAILURES;
}

function recordFailure(ip) {
  const recent = failures.get(ip) || [];
  recent.push(Date.now());
  failures.set(ip, recent);
}

function cookieOptions(req) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: req.protocol === "https",
    path: "/",
    maxAge: SESSION_MS,
  };
}

export function requireAuth(req, res, next) {
  const loginUrl = `/login.html?next=${encodeURIComponent(req.originalUrl)}`;
  const sid = req.cookies?.[COOKIE_NAME];
  if (!sid) return res.redirect(loginUrl);

  const sessions = pruneSessions(loadSessions());
  const session = sessions[sid];
  if (!session) return res.redirect(loginUrl);

  next();
}

export function attachAuthRoutes(app) {
  app.post("/login", async (req, res) => {
    const ip = clientIp(req);
    const password = String(req.body?.password || "");

    if (isLockedOut(ip)) {
      return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
    }

    const storedHash = process.env.HSMS_AUTH_HASH || "";
    const ok = storedHash
      ? await verifyPassword(password, storedHash)
      : await verifyPassword(password, DUMMY_HASH).then(() => false);

    if (!ok) {
      recordFailure(ip);
      return res.status(401).json({ error: "Wrong password." });
    }

    const sid = crypto.randomBytes(32).toString("base64url");
    const sessions = pruneSessions(loadSessions());
    sessions[sid] = { createdAt: Date.now(), expires: Date.now() + SESSION_MS, ip };
    saveSessions(sessions);

    res.cookie(COOKIE_NAME, sid, cookieOptions(req));
    res.json({ ok: true });
  });

  app.post("/logout", (req, res) => {
    const sid = req.cookies?.[COOKIE_NAME];
    if (sid) {
      const sessions = loadSessions();
      delete sessions[sid];
      saveSessions(sessions);
    }
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ ok: true });
  });
}
