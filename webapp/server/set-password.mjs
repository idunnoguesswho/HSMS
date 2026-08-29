// Sets the HSMS login password. Run with: npm run set-password -- "some passphrase"
// Writes the scrypt hash into server/.env as HSMS_AUTH_HASH — never the plaintext.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "./passwords.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, ".env");

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error("Usage: npm run set-password -- \"a passphrase at least 8 characters long\"");
  process.exit(1);
}

const hash = await hashPassword(password);

let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
if (/^HSMS_AUTH_HASH=/m.test(env)) {
  env = env.replace(/^HSMS_AUTH_HASH=.*$/m, `HSMS_AUTH_HASH=${hash}`);
} else {
  env += `${env && !env.endsWith("\n") ? "\n" : ""}HSMS_AUTH_HASH=${hash}\n`;
}

fs.writeFileSync(ENV_PATH, env, { mode: 0o600 });
console.log("Password set. server/.env updated.");
