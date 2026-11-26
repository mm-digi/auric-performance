// HMAC signing helpers that work in middleware (Edge) and Node via Web Crypto.

export const b64 = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const unb64 = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

export async function sign(value: string, secret: string): Promise<string> {
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

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** "<b64 email>.<expiry ms>.<sig>", signed with `secret` under a `scope` so cookies can't be swapped. */
export async function createSignedEmail(scope: string, email: string, ttlMs: number, secret: string): Promise<string> {
  const payload = `${b64(email.toLowerCase())}.${Date.now() + ttlMs}`;
  return `${payload}.${await sign(`${scope}:${payload}`, secret)}`;
}

export async function readSignedEmail(scope: string, value: string | undefined, secret: string | undefined): Promise<string | null> {
  if (!secret || !value) return null;
  const [emailPart, expires, sig] = value.split(".");
  if (!emailPart || !expires || !sig || Number(expires) < Date.now()) return null;
  if (!safeEqual(sig, await sign(`${scope}:${emailPart}.${expires}`, secret))) return null;
  try {
    return unb64(emailPart);
  } catch {
    return null;
  }
}
