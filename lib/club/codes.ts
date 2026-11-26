import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { db } from "./server";

// One-time sign-in codes, emailed to customers and coaches. Only a hash is stored.

export const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_WINDOW = 5;
const WINDOW_MINUTES = 15;

export type CodePurpose = "customer" | "coach";

function sessionSecret(): string {
  const s = process.env.CLUB_SESSION_SECRET;
  if (!s) throw new Error("CLUB_SESSION_SECRET must be set");
  return s;
}

const hash = (email: string, purpose: CodePurpose, code: string) =>
  createHmac("sha256", sessionSecret()).update(`${purpose}:${email.toLowerCase()}:${code}`).digest("hex");

/** Returns the code to email, or null if too many codes were requested recently. */
export async function issueCode(email: string, purpose: CodePurpose): Promise<string | null> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db()
    .from("club_auth_codes")
    .select("id", { count: "exact", head: true })
    .eq("email", email.toLowerCase())
    .eq("purpose", purpose)
    .gt("created_at", since);
  if ((count ?? 0) >= MAX_CODES_PER_WINDOW) return null;

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const { error } = await db()
    .from("club_auth_codes")
    .insert({
      email: email.toLowerCase(),
      purpose,
      code_hash: hash(email, purpose, code),
      expires_at: new Date(Date.now() + CODE_MINUTES * 60_000).toISOString(),
    });
  if (error) throw new Error(error.message);
  return code;
}

/** Checks the most recent unused code for this email. */
export async function verifyCode(email: string, purpose: CodePurpose, code: string): Promise<boolean> {
  const clean = code.replace(/\D/g, "");
  if (clean.length !== 6) return false;
  const { data } = await db()
    .from("club_auth_codes")
    .select("id, code_hash, attempts, expires_at")
    .eq("email", email.toLowerCase())
    .eq("purpose", purpose)
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data || new Date(data.expires_at) <= new Date() || data.attempts >= MAX_ATTEMPTS) return false;

  const expected = Buffer.from(data.code_hash, "hex");
  const given = Buffer.from(hash(email, purpose, clean), "hex");
  const ok = expected.length === given.length && timingSafeEqual(expected, given);
  await db()
    .from("club_auth_codes")
    .update(ok ? { used_at: new Date().toISOString() } : { attempts: data.attempts + 1 })
    .eq("id", data.id);
  return ok;
}
