import "server-only";
import { CLUB } from "./config";
import { db, payments } from "./server";
import { getHealth, isReviewedSuitable } from "./customers";
import {
  sendBookingConfirmation,
  sendCancellation,
  sendClassCancelled,
  sendLatePaymentRefunded,
  sendSpaceOffered,
} from "./email";

export type PublicClass = {
  id: string;
  startsAt: string;
  endsAt: string;
  cancelled: boolean;
  spacesLeft: number;
  capacity: number;
  pricePence: number;
};

type ClassRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  price_pence: number;
  status: "scheduled" | "cancelled";
  cancelled_reason: string | null;
  taken: number;
  confirmed: number;
  waiting: number;
};

export type BookingRow = {
  id: string;
  class_id: string;
  name: string;
  email: string;
  phone: string;
  children: number;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  stripe_payment_intent_id: string | null;
  amount_pence: number | null;
  manage_token: string;
  refund_status: string;
  cancelled_by: string | null;
  confirmed_at: string | null;
  created_at: string;
  customer_id: string | null;
  children_snapshot: { name: string; age: string; relationship: string }[] | null;
  health_consent_version: string | null;
};

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export async function getClass(id: string) {
  return check(await db().from("club_classes").select("*").eq("id", id).single()) as {
    id: string;
    starts_at: string;
    ends_at: string;
    status: string;
    cancelled_reason: string | null;
  };
}

/** Upcoming classes with live availability. Also nudges the waiting list along. */
export async function listClasses(): Promise<PublicClass[]> {
  check(await db().rpc("club_ensure_classes", { p_first: CLUB.firstClassDate, p_weeks: CLUB.weeksAhead }));

  const load = async () =>
    check(
      await db()
        .from("club_class_availability")
        .select("*")
        .gt("starts_at", new Date().toISOString())
        .order("starts_at")
        .limit(CLUB.weeksAhead),
    ) as ClassRow[];

  let rows = await load();
  // If a hold or offer has lapsed and people are waiting, offer the space on.
  const needsOffer = rows.filter((r) => r.status === "scheduled" && r.waiting > 0 && r.taken < r.capacity);
  if (needsOffer.length) {
    await Promise.all(needsOffer.map((r) => offerSpaces(r.id)));
    rows = await load();
  }

  return rows.map((r) => ({
    id: r.id,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    cancelled: r.status === "cancelled",
    spacesLeft: Math.max(0, r.capacity - r.taken),
    capacity: r.capacity,
    pricePence: r.price_pence,
  }));
}

/** Offer any free spaces to the waiting list and email the people offered. */
export async function offerSpaces(classId: string) {
  const offered = check(
    await db().rpc("club_offer_spaces", { p_class_id: classId, p_offer_hours: CLUB.offerHours }),
  ) as { class_id: string; name: string; email: string; offer_token: string; offer_expires_at: string }[];
  if (!offered?.length) return;
  const cls = await getClass(classId);
  await Promise.all(offered.map((p) => sendSpaceOffered(p, cls)));
}

async function refund(paymentIntent: string | null): Promise<string | null> {
  const stripe = payments();
  if (!stripe || !paymentIntent) return null;
  try {
    const r = await stripe.refunds.create({ payment_intent: paymentIntent });
    return r.id;
  } catch (err) {
    console.error("[280 Club] refund failed", paymentIntent, err);
    return null;
  }
}

/** Called once payment succeeds (Stripe webhook, or straight away in dev without Stripe). */
export async function confirmBooking(opts: {
  bookingId: string;
  sessionId: string | null;
  paymentIntent: string | null;
  amountPence: number | null;
}) {
  const result = check(
    await db().rpc("club_confirm_booking", {
      p_booking_id: opts.bookingId,
      p_session_id: opts.sessionId,
      p_payment_intent: opts.paymentIntent,
      p_amount: opts.amountPence,
    }),
  ) as string;

  if (result !== "confirmed" && result !== "full") return result;

  const booking = check(
    await db().from("club_bookings").select("*").eq("id", opts.bookingId).single(),
  ) as BookingRow;
  const cls = await getClass(booking.class_id);

  if (result === "confirmed") {
    const health = booking.customer_id ? await getHealth(booking.customer_id) : null;
    await sendBookingConfirmation(
      booking,
      cls,
      health
        ? {
            childrenAttending: booking.children_snapshot ?? [],
            reviewed: isReviewedSuitable(health.status),
            deferred: health.status === "deferred",
            healthConsentGiven: Boolean(booking.health_consent_version),
          }
        : null,
    );
  } else {
    const refundId = await refund(opts.paymentIntent);
    await db()
      .from("club_bookings")
      .update({ refund_status: refundId ? "refunded" : "failed", stripe_refund_id: refundId })
      .eq("id", booking.id);
    await sendLatePaymentRefunded(booking, cls);
  }
  return result;
}

export async function cancelByCustomer(manageToken: string) {
  const [row] = check(
    await db().rpc("club_cancel_booking", { p_manage_token: manageToken, p_cutoff_hours: CLUB.refundCutoffHours }),
  ) as { result: string; booking_id: string | null; class_id: string | null }[];

  if (!row || (row.result !== "refund" && row.result !== "no_refund")) return row?.result ?? "not_found";

  const booking = check(
    await db().from("club_bookings").select("*").eq("id", row.booking_id!).single(),
  ) as BookingRow;
  const cls = await getClass(booking.class_id);

  let outcome: "refund" | "no_refund" | "refund_failed" = "no_refund";
  if (row.result === "refund") {
    if (booking.stripe_payment_intent_id) {
      const refundId = await refund(booking.stripe_payment_intent_id);
      outcome = refundId ? "refund" : "refund_failed";
      await db()
        .from("club_bookings")
        .update({ refund_status: refundId ? "refunded" : "failed", stripe_refund_id: refundId })
        .eq("id", booking.id);
    } else {
      outcome = "refund"; // nothing was charged (dev / free booking)
      await db().from("club_bookings").update({ refund_status: "refunded" }).eq("id", booking.id);
    }
  }

  await sendCancellation(booking, cls, outcome);
  // The cancellation has already happened; don't fail it if the waiting-list
  // step hiccups (the next page view or cron run will offer the place).
  await offerSpaces(booking.class_id).catch((err) => console.error("[280 Club] offer after cancel", err));
  return outcome;
}

export async function cancelClass(classId: string, reason: string | null) {
  const cancelled = check(
    await db().rpc("club_cancel_class", { p_class_id: classId, p_reason: reason }),
  ) as BookingRow[];
  const cls = await getClass(classId);
  let failed = 0;
  for (const b of cancelled) {
    const refundId = b.stripe_payment_intent_id ? await refund(b.stripe_payment_intent_id) : "none";
    if (!refundId) failed++;
    await db()
      .from("club_bookings")
      .update({ refund_status: refundId ? "refunded" : "failed", stripe_refund_id: refundId === "none" ? null : refundId })
      .eq("id", b.id);
    await sendClassCancelled(b, cls, reason, Boolean(refundId));
  }
  return { cancelled: cancelled.length, refundFailures: failed };
}

/** Customer backed out of Stripe Checkout: free the place straight away. */
export async function releaseHold(manageToken: string) {
  const { data } = await db()
    .from("club_bookings")
    .update({ status: "expired" })
    .eq("manage_token", manageToken)
    .eq("status", "pending")
    .select("class_id, stripe_session_id")
    .maybeSingle();
  if (!data) return;
  const stripe = payments();
  if (stripe && data.stripe_session_id) {
    await stripe.checkout.sessions.expire(data.stripe_session_id).catch(() => {});
  }
  await offerSpaces(data.class_id).catch((err) => console.error("[280 Club] offer after release", err));
}

/** Housekeeping for the cron job: expire lapsed holds/offers and move the waiting list on. */
export async function sweep() {
  const rows = check(
    await db()
      .from("club_class_availability")
      .select("id, status, taken, capacity, waiting")
      .gt("starts_at", new Date().toISOString()),
  ) as ClassRow[];
  const due = rows.filter((r) => r.status === "scheduled" && r.waiting > 0 && r.taken < r.capacity);
  for (const r of due) await offerSpaces(r.id);
  return due.length;
}

/**
 * Retention clean-up (see the 280 Club privacy notice, section 6):
 * - sign-in codes after 30 days
 * - waiting-list entries 12 months after their session
 */
export async function purgeExpired() {
  const codesBefore = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { count: codes } = await db()
    .from("club_auth_codes")
    .delete({ count: "exact" })
    .lt("created_at", codesBefore);

  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const oldClasses = (check(
    await db().from("club_classes").select("id").lt("starts_at", yearAgo.toISOString()),
  ) as { id: string }[]).map((c) => c.id);
  let waitlist = 0;
  if (oldClasses.length) {
    const ids = (check(
      await db().from("club_waitlist").select("id").in("class_id", oldClasses),
    ) as { id: string }[]).map((w) => w.id);
    if (ids.length) {
      check(await db().from("club_bookings").update({ waitlist_id: null }).in("waitlist_id", ids));
      const { count } = await db().from("club_waitlist").delete({ count: "exact" }).in("id", ids);
      waitlist = count ?? 0;
    }
  }
  return { codes: codes ?? 0, waitlist };
}
