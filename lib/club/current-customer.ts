import "server-only";
import { redirect } from "next/navigation";
import { customerEmail } from "./customer-session";
import { findOrCreateCustomer, getCustomerByEmail, type Customer } from "./customers";

/** For pages: the signed-in customer, or a redirect to sign in. */
export async function requireCustomer(next: string): Promise<Customer> {
  const email = await customerEmail();
  if (!email) redirect(`/280-club/sign-in?next=${encodeURIComponent(next)}`);
  return (await getCustomerByEmail(email)) ?? findOrCreateCustomer(email);
}

/** For API routes: the signed-in customer, or null. */
export async function currentCustomer(): Promise<Customer | null> {
  const email = await customerEmail();
  if (!email) return null;
  return (await getCustomerByEmail(email)) ?? findOrCreateCustomer(email);
}
