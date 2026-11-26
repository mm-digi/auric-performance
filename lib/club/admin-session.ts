// Coach sign-in. Two steps:
//   1. an email listed in CLUB_ADMIN_EMAILS and the shared CLUB_ADMIN_PASSWORD
//   2. a one-time code emailed to that coach
// The session cookie is signed with the password and CLUB_SESSION_SECRET, so
// changing either signs everyone out, and removing an email from the list locks
// that person out straight away.
//
// Health answers are only visible to emails in CLUB_HEALTH_REVIEWERS.

import { createSignedEmail, readSignedEmail, safeEqual } from "./signing";

export const ADMIN_COOKIE = "club_admin";
export const ADMIN_PENDING_COOKIE = "club_admin_pending";
export const ADMIN_SESSION_DAYS = 7;
export const ADMIN_PENDING_MINUTES = 10;

const list = (v: string | undefined) =>
  (v ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const adminEmails = () => list(process.env.CLUB_ADMIN_EMAILS);
export const healthReviewers = () => list(process.env.CLUB_HEALTH_REVIEWERS);

function secret(): string | null {
  const password = process.env.CLUB_ADMIN_PASSWORD;
  const session = process.env.CLUB_SESSION_SECRET;
  return password && session ? `${password}|${session}` : null;
}

export async function createAdminSession(email: string): Promise<string | null> {
  const s = secret();
  return s ? createSignedEmail("coach", email, ADMIN_SESSION_DAYS * 86_400_000, s) : null;
}

export async function createPendingAdmin(email: string): Promise<string | null> {
  const s = secret();
  return s ? createSignedEmail("coach-pending", email, ADMIN_PENDING_MINUTES * 60_000, s) : null;
}

export async function pendingAdminEmail(cookie: string | undefined): Promise<string | null> {
  const email = await readSignedEmail("coach-pending", cookie, secret() ?? undefined);
  return email && adminEmails().includes(email) ? email : null;
}

/** The signed-in coach's email, or null. */
export async function adminSessionEmail(cookie: string | undefined): Promise<string | null> {
  const email = await readSignedEmail("coach", cookie, secret() ?? undefined);
  return email && adminEmails().includes(email) ? email : null;
}

export async function isValidAdminSession(cookie: string | undefined): Promise<boolean> {
  return (await adminSessionEmail(cookie)) !== null;
}

export const isHealthReviewer = (email: string | null) => Boolean(email && healthReviewers().includes(email));

export function checkAdminPassword(email: string, password: string): boolean {
  const expected = process.env.CLUB_ADMIN_PASSWORD;
  const emailOk = adminEmails().includes(email.trim().toLowerCase());
  const passwordOk = Boolean(expected) && safeEqual(password, expected!);
  return emailOk && passwordOk;
}
