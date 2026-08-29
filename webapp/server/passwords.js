// Password hashing for the HSMS login gate.
//
// scrypt is memory-hard - 64 MiB per guess - so it resists GPU cracking far
// better than a fast hash like SHA-256, and it ships in Node core.
// Parameters follow the OWASP Password Storage Cheat Sheet:
//   N = 2^16 (65536), r = 8, p = 1  ->  64 MiB, roughly 100 ms per hash.

import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

const N = 65536;
const R = 8;
const P = 1;
const KEYLEN = 32;
const SALT_BYTES = 16;
const MAXMEM = 128 * N * R * 2;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return ["scrypt", N, R, P, salt.toString("base64"), Buffer.from(derived).toString("base64")].join("$");
}

export async function verifyPassword(password, stored) {
  const hash = String(stored || "");
  if (!hash.startsWith("scrypt$")) return false;

  const [, nStr, rStr, pStr, saltB64, keyB64] = hash.split("$");
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(keyB64, "base64");
  const params = { N: Number(nStr), r: Number(rStr), p: Number(pStr) };
  const derived = await scrypt(password, salt, expected.length, {
    ...params,
    maxmem: 128 * params.N * params.r * 2,
  });

  // Constant-time compare: byte-by-byte would leak how much matched.
  return crypto.timingSafeEqual(Buffer.from(derived), expected);
}

/** A hash of a value nobody knows, so "no such secret" and "wrong password" take equally long. */
export const DUMMY_HASH = await hashPassword(crypto.randomBytes(32).toString("hex"));
