// Signed admin session cookie. Works in middleware (Edge) and Node via Web Crypto.
// Coaches sign in with an email listed in CLUB_ADMIN_EMAILS and the shared
// CLUB_ADMIN_PASSWORD. The cookie is "<email b64>.<expiry>.<hmac>", signed with
// the password, so changing the password signs everyone out, and removing an
// email from the list locks that person out straight away.

export const ADMIN_COOKIE = "club_admin";
export const ADMIN_SESSION_DAYS = 30;

const b64 = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminEmails(): string[] {
  return (process.env.CLUB_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function createAdminSession(email: string): Promise<string | null> {
  const secret = process.env.CLUB_ADMIN_PASSWORD;
  if (!secret) return null;
  const payload = `${b64(email.toLowerCase())}.${Date.now() + ADMIN_SESSION_DAYS * 86_400_000}`;
  return `${payload}.${await sign(payload, secret)}`;
}

/** The signed-in coach's email, or null. */
export async function adminSessionEmail(cookie: string | undefined): Promise<string | null> {
  const secret = process.env.CLUB_ADMIN_PASSWORD;
  if (!secret || !cookie) return null;
  const [emailPart, expires, sig] = cookie.split(".");
  if (!emailPart || !expires || !sig || Number(expires) < Date.now()) return null;
  if (!safeEqual(sig, await sign(`${emailPart}.${expires}`, secret))) return null;
  let email: string;
  try {
    email = unb64(emailPart);
  } catch {
    return null;
  }
  return adminEmails().includes(email) ? email : null;
}

export async function isValidAdminSession(cookie: string | undefined): Promise<boolean> {
  return (await adminSessionEmail(cookie)) !== null;
}

export function checkAdminLogin(email: string, password: string): boolean {
  const expected = process.env.CLUB_ADMIN_PASSWORD;
  const emailOk = adminEmails().includes(email.trim().toLowerCase());
  const passwordOk = Boolean(expected) && safeEqual(password, expected!);
  return emailOk && passwordOk;
}
