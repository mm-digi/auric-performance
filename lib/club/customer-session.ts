import "server-only";
import { cookies } from "next/headers";
import { createSignedEmail, readSignedEmail } from "./signing";

// Customers sign in with a one-time code sent to their email. The cookie holds
// their verified email, signed with CLUB_SESSION_SECRET.

export const CUSTOMER_COOKIE = "club_customer";
export const CUSTOMER_SESSION_DAYS = 14;

export async function createCustomerSession(email: string): Promise<string> {
  const secret = process.env.CLUB_SESSION_SECRET;
  if (!secret) throw new Error("CLUB_SESSION_SECRET must be set");
  return createSignedEmail("customer", email, CUSTOMER_SESSION_DAYS * 86_400_000, secret);
}

export async function customerEmail(): Promise<string | null> {
  const value = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  return readSignedEmail("customer", value, process.env.CLUB_SESSION_SECRET);
}

export const customerCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: CUSTOMER_SESSION_DAYS * 86_400,
};
