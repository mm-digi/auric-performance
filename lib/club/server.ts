import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { Resend } from "resend";

let supabase: SupabaseClient | null = null;
let stripe: Stripe | null = null;
let resend: Resend | null = null;

export function db(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    supabase = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabase;
}

/** Null when Stripe isn't configured yet. */
export function payments(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

/**
 * Until Stripe keys are added, local development confirms bookings without
 * payment so the rest of the flow can be tested. Production refuses bookings.
 */
export function skipPayments(): boolean {
  return !payments() && process.env.NODE_ENV !== "production";
}

export function mailer(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
