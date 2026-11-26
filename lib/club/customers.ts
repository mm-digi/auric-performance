import "server-only";
import {
  CLUB,
  HEALTH_CONSENT,
  HEALTH_CONSENT_VERSION,
  PERMISSIONS,
  PERMISSIONS_VERSION,
  SCREENING_QUESTIONS,
  SCREENING_VERSION,
  type PermissionKey,
  type ReviewStatus,
  type ScreeningAnswer,
} from "./config";
import { db } from "./server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Customer = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  adult_confirmed_at: string | null;
  emergency_name: string | null;
  emergency_relationship: string | null;
  emergency_phone: string | null;
  care_notes: string | null;
  profile_completed_at: string | null;
  created_at: string;
};

export type Child = { id: string; name: string; age: string; relationship: string };

export type Screening = {
  id: string;
  customer_id: string;
  kind: "full" | "no_change";
  questionnaire_version: string;
  answers: Record<string, ScreeningAnswer> | null;
  details: string | null;
  contact_privately: boolean;
  change_answer: "no" | "yes" | "unsure" | null;
  base_screening_id: string | null;
  needs_review: boolean;
  source: string;
  created_at: string;
};

export type Review = {
  id: string;
  screening_id: string;
  customer_id: string;
  status: ReviewStatus;
  reviewer_email: string;
  questionnaire_version: string;
  discussion: string | null;
  adjustments: string | null;
  clinical_evidence: string | null;
  follow_up_date: string | null;
  created_at: string;
};

export type HealthStatus =
  | "missing"
  | "consent_withdrawn"
  | "refresh_due"
  | "pending"
  | "awaiting_discussion"
  | "awaiting_clinical_evidence"
  | "suitable"
  | "suitable_with_adjustments"
  | "deferred";

export const HEALTH_STATUS_LABEL: Record<HealthStatus, string> = {
  missing: "No screening yet",
  consent_withdrawn: "Health consent withdrawn",
  refresh_due: "Screening refresh due",
  pending: "Review pending",
  awaiting_discussion: "Awaiting discussion",
  awaiting_clinical_evidence: "Awaiting clinical evidence",
  suitable: "Reviewed – suitable",
  suitable_with_adjustments: "Reviewed – suitable with adjustments",
  deferred: "Exercise deferred",
};

export const isReviewedSuitable = (s: HealthStatus) => s === "suitable" || s === "suitable_with_adjustments";

export type HealthState = {
  consent: boolean;
  status: HealthStatus;
  latestFull: Screening | null;
  review: Review | null;
  lastActivityAt: string | null;
};

export type Permissions = Record<PermissionKey, boolean>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const phoneOk = (v: string) => /^[+\d][\d\s()-]{6,}$/.test(v);

export function profileComplete(c: Customer | null): boolean {
  return Boolean(
    c?.name && c.phone && c.adult_confirmed_at && c.emergency_name && c.emergency_relationship && c.emergency_phone,
  );
}

function monthsSince(iso: string): number {
  const then = new Date(iso);
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth()) - (now.getDate() < then.getDate() ? 1 : 0);
}

/** Work out where a customer's screening stands. Lists must be newest first. */
export function computeHealth(screenings: Screening[], reviews: Review[], consent: boolean): HealthState {
  const latestFull = screenings.find((s) => s.kind === "full") ?? null;
  const review = latestFull ? (reviews.find((r) => r.screening_id === latestFull.id) ?? null) : null;
  let status: HealthStatus;
  if (!consent) status = screenings.length ? "consent_withdrawn" : "missing";
  else if (!latestFull) status = "missing";
  else if (monthsSince(latestFull.created_at) >= CLUB.screeningRefreshMonths) status = "refresh_due";
  else if (!review || review.status === "submitted") status = "pending";
  else status = review.status;
  return { consent, status, latestFull, review, lastActivityAt: screenings[0]?.created_at ?? null };
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export async function findOrCreateCustomer(email: string): Promise<Customer> {
  const clean = email.trim().toLowerCase();
  const existing = await getCustomerByEmail(clean);
  if (existing) {
    await db().from("club_customers").update({ last_sign_in_at: new Date().toISOString() }).eq("id", existing.id);
    return existing;
  }
  const { data, error } = await db()
    .from("club_customers")
    .insert({ email: clean, last_sign_in_at: new Date().toISOString() })
    .select("*")
    .single();
  if (error?.code === "23505") return (await getCustomerByEmail(clean))!;
  if (error) throw new Error(error.message);
  return data as Customer;
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const { data } = await db().from("club_customers").select("*").eq("email", email.trim().toLowerCase()).maybeSingle();
  return (data as Customer) ?? null;
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const { data } = await db().from("club_customers").select("*").eq("id", id).maybeSingle();
  return (data as Customer) ?? null;
}

export async function listChildren(customerId: string): Promise<Child[]> {
  return check(
    await db()
      .from("club_children")
      .select("id, name, age, relationship")
      .eq("customer_id", customerId)
      .is("archived_at", null)
      .order("created_at"),
  ) as Child[];
}

async function latestConsents(customerIds: string[]) {
  const rows = check(
    await db()
      .from("club_consents")
      .select("customer_id, kind, granted, created_at")
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false }),
  ) as { customer_id: string; kind: string; granted: boolean }[];
  const out = new Map<string, Record<string, boolean>>();
  for (const r of rows) {
    const m = out.get(r.customer_id) ?? {};
    if (!(r.kind in m)) m[r.kind] = r.granted;
    out.set(r.customer_id, m);
  }
  return out;
}

/** Current consents and permissions for many customers (latest choice per kind). */
export async function currentPermissions(customerIds: string[]): Promise<Map<string, Record<string, boolean>>> {
  const ids = [...new Set(customerIds)].filter(Boolean);
  return ids.length ? latestConsents(ids) : new Map();
}

export async function getPermissions(customerId: string): Promise<Permissions & { health: boolean }> {
  const m = (await latestConsents([customerId])).get(customerId) ?? {};
  const perms = Object.fromEntries(
    (Object.keys(PERMISSIONS) as PermissionKey[]).map((k) => [k, Boolean(m[k])]),
  ) as Permissions;
  return { ...perms, health: Boolean(m.health) };
}

export async function listScreenings(customerId: string): Promise<Screening[]> {
  return check(
    await db().from("club_screenings").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
  ) as Screening[];
}

export async function listReviews(customerId: string): Promise<Review[]> {
  return check(
    await db()
      .from("club_screening_reviews")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
  ) as Review[];
}

export async function getHealth(customerId: string): Promise<HealthState> {
  const [screenings, reviews, perms] = await Promise.all([
    listScreenings(customerId),
    listReviews(customerId),
    getPermissions(customerId),
  ]);
  return computeHealth(screenings, reviews, perms.health);
}

/** Health status for many customers at once (class rosters). No answers are returned. */
export async function healthStatuses(customerIds: string[]): Promise<Map<string, HealthState>> {
  const ids = [...new Set(customerIds)].filter(Boolean);
  const out = new Map<string, HealthState>();
  if (!ids.length) return out;
  const [screenings, reviews, consents] = await Promise.all([
    db()
      .from("club_screenings")
      .select("id, customer_id, kind, created_at, needs_review, questionnaire_version, change_answer, base_screening_id, contact_privately, source")
      .in("customer_id", ids)
      .order("created_at", { ascending: false }),
    db().from("club_screening_reviews").select("*").in("customer_id", ids).order("created_at", { ascending: false }),
    latestConsents(ids),
  ]);
  const s = check(screenings) as Screening[];
  const r = check(reviews) as Review[];
  for (const id of ids) {
    out.set(
      id,
      computeHealth(
        s.filter((x) => x.customer_id === id),
        r.filter((x) => x.customer_id === id),
        Boolean(consents.get(id)?.health),
      ),
    );
  }
  return out;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ProfileInput = {
  name: string;
  phone: string;
  adult: boolean;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  careNotes: string;
};

export function cleanProfile(body: Record<string, unknown>): ProfileInput | string {
  const p: ProfileInput = {
    name: text(body.name, 120),
    phone: text(body.phone, 40),
    adult: body.adult === true,
    emergencyName: text(body.emergencyName, 120),
    emergencyRelationship: text(body.emergencyRelationship, 60),
    emergencyPhone: text(body.emergencyPhone, 40),
    careNotes: text(body.careNotes, 1000),
  };
  if (p.name.length < 2) return "Please enter your full name.";
  if (!phoneOk(p.phone)) return "Please enter a mobile number we can reach you on.";
  if (!p.adult) return "Please confirm you are 18 or over.";
  if (p.emergencyName.length < 2) return "Please enter an emergency contact name.";
  if (p.emergencyRelationship.length < 2) return "Please enter your emergency contact’s relationship to you.";
  if (!phoneOk(p.emergencyPhone)) return "Please enter a phone number for your emergency contact.";
  return p;
}

export type ChildInput = { id: string | null; name: string; age: string; relationship: string; attending: boolean };

export function cleanChildren(list: unknown): ChildInput[] | string {
  if (!Array.isArray(list)) return [];
  if (list.length > 30) return "Please contact us to add that many children.";
  const out: ChildInput[] = [];
  for (const raw of list as Record<string, unknown>[]) {
    const c: ChildInput = {
      id: typeof raw.id === "string" && /^[0-9a-f-]{36}$/i.test(raw.id) ? raw.id : null,
      name: text(raw.name, 80),
      age: text(raw.age, 30),
      relationship: text(raw.relationship, 60),
      attending: raw.attending === true,
    };
    if (!c.name && !c.age && !c.relationship && !c.id) continue; // empty row
    if (c.name.length < 1) return "Please enter each child’s name.";
    if (c.age.length < 1) return `Please enter ${c.name}’s age (months is fine for a baby).`;
    if (c.relationship.length < 2) return `Please enter your relationship to ${c.name}.`;
    out.push(c);
  }
  return out;
}

export type ScreeningInput = {
  answers: Record<string, ScreeningAnswer>;
  details: string;
  contactPrivately: boolean;
};

export function cleanScreening(body: Record<string, unknown>): ScreeningInput | string {
  const raw = (body.answers ?? {}) as Record<string, unknown>;
  const answers: Record<string, ScreeningAnswer> = {};
  for (const q of SCREENING_QUESTIONS) {
    const a = raw[q.id];
    if (a !== "yes" && a !== "no" && a !== "unsure") return "Please answer every health question.";
    answers[q.id] = a;
  }
  if (body.accurate !== true) return "Please confirm your health answers are accurate.";
  return { answers, details: text(body.details, 3000), contactPrivately: body.contactPrivately === true };
}

// ---------------------------------------------------------------------------
// Saving (each change keeps a read-only copy of what was there before)
// ---------------------------------------------------------------------------

async function snapshot(customerId: string, changedBy: string, reason: string) {
  const [customer, children] = await Promise.all([getCustomer(customerId), listChildren(customerId)]);
  check(
    await db().from("club_customer_history").insert({
      customer_id: customerId,
      changed_by: changedBy,
      reason,
      snapshot: { customer, children },
    }),
  );
}

export async function saveProfile(customer: Customer, p: ProfileInput, changedBy = "customer"): Promise<Customer> {
  const next = {
    name: p.name,
    phone: p.phone,
    emergency_name: p.emergencyName,
    emergency_relationship: p.emergencyRelationship,
    emergency_phone: p.emergencyPhone,
    care_notes: p.careNotes || null,
  };
  const changed =
    !customer.adult_confirmed_at ||
    (Object.keys(next) as (keyof typeof next)[]).some((k) => (customer[k] ?? null) !== (next[k] ?? null));
  if (!changed) return customer;
  const now = new Date().toISOString();
  const updated = check(
    await db()
      .from("club_customers")
      .update({
        ...next,
        adult_confirmed_at: customer.adult_confirmed_at ?? now,
        profile_completed_at: customer.profile_completed_at ?? now,
        updated_at: now,
      })
      .eq("id", customer.id)
      .select("*")
      .single(),
  ) as Customer;
  await snapshot(customer.id, changedBy, "profile");
  return updated;
}

/**
 * Save the customer's children list. Children left out of the list are archived
 * (never deleted). Returns the saved list in the same order as the input, with ids.
 */
export async function saveChildren(customerId: string, list: ChildInput[], changedBy = "customer"): Promise<(Child & { attending: boolean })[]> {
  const existing = await listChildren(customerId);
  const byId = new Map(existing.map((c) => [c.id, c]));
  const now = new Date().toISOString();
  const result: (Child & { attending: boolean })[] = [];
  let changed = false;

  for (const c of list) {
    const prev = c.id ? byId.get(c.id) : undefined;
    if (prev) {
      byId.delete(prev.id);
      if (prev.name !== c.name || prev.age !== c.age || prev.relationship !== c.relationship) {
        check(
          await db()
            .from("club_children")
            .update({ name: c.name, age: c.age, relationship: c.relationship, updated_at: now })
            .eq("id", prev.id)
            .eq("customer_id", customerId),
        );
        changed = true;
      }
      result.push({ id: prev.id, name: c.name, age: c.age, relationship: c.relationship, attending: c.attending });
    } else {
      const row = check(
        await db()
          .from("club_children")
          .insert({ customer_id: customerId, name: c.name, age: c.age, relationship: c.relationship })
          .select("id, name, age, relationship")
          .single(),
      ) as Child;
      changed = true;
      result.push({ ...row, attending: c.attending });
    }
  }
  for (const gone of byId.values()) {
    check(await db().from("club_children").update({ archived_at: now }).eq("id", gone.id));
    changed = true;
  }
  if (changed) await snapshot(customerId, changedBy, "children");
  return result;
}

/** Record a consent or permission change (only if it actually changes). */
export async function setConsent(
  customerId: string,
  kind: "health" | PermissionKey,
  granted: boolean,
  source: "booking" | "account" | "coach",
  ip: string | null,
): Promise<boolean> {
  const current = await getPermissions(customerId);
  if (current[kind] === granted) return false;
  const statement = kind === "health" ? HEALTH_CONSENT : PERMISSIONS[kind].text;
  const version = kind === "health" ? HEALTH_CONSENT_VERSION : PERMISSIONS_VERSION;
  check(
    await db().from("club_consents").insert({
      customer_id: customerId,
      kind,
      granted,
      version,
      statement: granted ? statement : `Withdrawn: ${statement}`,
      source,
      ip,
    }),
  );
  return true;
}

export async function submitScreening(opts: {
  customerId: string;
  input: ScreeningInput;
  changeAnswer: "yes" | "unsure" | null;
  baseScreeningId: string | null;
  source: "booking" | "account";
  ip: string | null;
}): Promise<Screening> {
  return check(
    await db()
      .from("club_screenings")
      .insert({
        customer_id: opts.customerId,
        kind: "full",
        questionnaire_version: SCREENING_VERSION,
        answers: opts.input.answers,
        details: opts.input.details || null,
        contact_privately: opts.input.contactPrivately,
        change_answer: opts.changeAnswer,
        base_screening_id: opts.baseScreeningId,
        needs_review: true,
        source: opts.source,
        ip: opts.ip,
      })
      .select("*")
      .single(),
  ) as Screening;
}

export async function confirmNoChange(opts: { customerId: string; baseScreeningId: string; ip: string | null }): Promise<Screening> {
  return check(
    await db()
      .from("club_screenings")
      .insert({
        customer_id: opts.customerId,
        kind: "no_change",
        questionnaire_version: SCREENING_VERSION,
        change_answer: "no",
        base_screening_id: opts.baseScreeningId,
        needs_review: false,
        source: "booking",
        ip: opts.ip,
      })
      .select("*")
      .single(),
  ) as Screening;
}

export const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
