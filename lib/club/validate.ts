import { CLUB } from "./config";

export type BookerInput = { name: string; email: string; phone: string; children: number };

/** Returns cleaned input or an error message. */
export function cleanBooker(body: Record<string, unknown>, phoneRequired = true): BookerInput | string {
  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const children = Number(body.children ?? 0);
  if (name.length < 2) return "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (phoneRequired && !/^[+\d][\d\s()-]{6,}$/.test(phone)) return "Please enter a phone number we can reach you on.";
  if (!Number.isInteger(children) || children < 0 || children > CLUB.maxChildren) {
    return `You can bring up to ${CLUB.maxChildren} children.`;
  }
  return { name, email, phone, children };
}

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const isToken = (v: unknown): v is string => typeof v === "string" && /^[a-f0-9]{48}$/.test(v);
