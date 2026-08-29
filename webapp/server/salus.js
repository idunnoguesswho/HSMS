// Client for the SALUS Developer API (https://docs.salussafety.io).
//
// Auth is client_credentials against SALUS Guardian (their IdP), which
// returns a short-lived bearer JWT. Credentials are per-client (see
// clients.js) — each client has its own Salus client_id/secret and its own
// SQLite database, so importing for one client can never leak into
// another's data or use another's credentials.
//
// Only beta/dev Guardian URLs are publicly documented; a production URL
// comes from the Salus account team for a client that has one, and can be
// set per-client via the admin page's advanced fields.

const DEFAULT_TOKEN_URL = "https://guardian.beta.salussafety.io/token";
const DEFAULT_API_BASE = "https://developer.beta.salussafety.io";

const tokenCache = new Map(); // client.id -> { accessToken, expiresAt }

export function isConfigured(client) {
  return Boolean(client?.salusClientId && client?.salusClientSecret);
}

async function getAccessToken(client) {
  const cached = tokenCache.get(client.id);
  if (cached && cached.expiresAt > Date.now() + 5000) {
    return cached.accessToken;
  }

  const tokenUrl = client.salusTokenUrl || DEFAULT_TOKEN_URL;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: client.salusClientId,
      client_secret: client.salusClientSecret,
      scope: "sls:idn",
    }),
  });

  if (!res.ok) {
    throw new Error(`Salus token request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const entry = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in || 3600) * 1000),
  };
  tokenCache.set(client.id, entry);
  return entry.accessToken;
}

export async function searchDocuments(client, term) {
  const token = await getAccessToken(client);
  const apiBase = client.salusApiBase || DEFAULT_API_BASE;
  const url = new URL("/v1/document/", apiBase);
  if (term) url.searchParams.set("search", term);

  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Salus document search failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
