import { NextResponse } from "next/server";
import { CLUB, HEALTH_CONSENT_VERSION, PRIVACY_VERSION, WAIVER_VERSION, type PermissionKey, PERMISSIONS } from "@/lib/club/config";
import { currentCustomer } from "@/lib/club/current-customer";
import {
  cleanChildren,
  cleanProfile,
  cleanScreening,
  clientIp,
  confirmNoChange,
  getHealth,
  saveChildren,
  saveProfile,
  setConsent,
  submitScreening,
} from "@/lib/club/customers";
import { sendReviewNeeded } from "@/lib/club/email";
import { formatClassDate } from "@/lib/club/format";
import { bookingOpen, db, payments, siteUrl } from "@/lib/club/server";
import { confirmBooking, getClass } from "@/lib/club/service";
import { isToken, isUuid } from "@/lib/club/validate";

const MESSAGES: Record<string, string> = {
  not_found: "That class could not be found.",
  cancelled: "That class has been cancelled.",
  closed: "Booking has closed for that class.",
  duplicate: "You're already booked onto that class. Check your email for your confirmation.",
  offer_invalid: "That waiting-list offer has expired or already been used.",
  full: "Sorry, that class has just filled up. You can join the waiting list instead.",
};

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (body.website) return bad("Rejected.");

  const customer = await currentCustomer();
  if (!customer) return bad("Please sign in again.", 401);
  if (!bookingOpen()) {
    return bad(`Online booking opens soon. Please email ${CLUB.replyTo} to reserve a place.`, 503);
  }

  // ---- Validate everything before saving anything ------------------------
  if (!isUuid(body.classId)) return bad("Please choose a class.");
  const classId = body.classId;
  if (body.detailsConfirmed !== true) return bad("Please confirm your details are correct.");
  const profile = cleanProfile((body.profile ?? {}) as Record<string, unknown>);
  if (typeof profile === "string") return bad(profile);

  const kids = cleanChildren(body.children);
  if (typeof kids === "string") return bad(kids);
  const bringing = body.bringingChildren === true;
  if (bringing && !kids.some((k) => k.attending)) return bad("Please tick which children are coming.");

  if (body.waiver !== true || body.waiverVersion !== WAIVER_VERSION) {
    return bad("Please read the latest waiver and tick the acknowledgement.");
  }

  const ip = clientIp(req);
  const health = await getHealth(customer.id);
  const h = (body.health ?? {}) as Record<string, unknown>;
  const requireFull = health.status === "missing" || health.status === "consent_withdrawn" || health.status === "refresh_due";
  if (!health.consent && h.consent !== true) {
    return bad(`Please tick the health information consent box, or email ${CLUB.healthContact} to talk privately.`);
  }
  const change = requireFull ? null : h.changeAnswer;
  if (!requireFull && change !== "no" && change !== "yes" && change !== "unsure") {
    return bad("Please answer the health-change question.");
  }
  const needsQuestionnaire = requireFull || change === "yes" || change === "unsure";
  const screeningInput = needsQuestionnaire ? cleanScreening((h.screening ?? {}) as Record<string, unknown>) : null;
  if (typeof screeningInput === "string") return bad(screeningInput);

  const permsIn = (body.permissions ?? {}) as Record<string, unknown>;
  const offerToken = isToken(body.offerToken) ? body.offerToken : null;
  if (offerToken) {
    const { data: offer } = await db().from("club_waitlist").select("email").eq("offer_token", offerToken).maybeSingle();
    if (offer && offer.email.toLowerCase() !== customer.email.toLowerCase()) {
      return bad("That offer was sent to a different email address.");
    }
  }

  try {
    // ---- Save profile, children, consents and screening ------------------
    const saved = await saveProfile(customer, profile);
    const children = await saveChildren(customer.id, kids);
    const attending = bringing ? children.filter((c) => c.attending) : [];

    if (!health.consent) await setConsent(customer.id, "health", true, "booking", ip);
    for (const k of Object.keys(PERMISSIONS) as PermissionKey[]) {
      await setConsent(customer.id, k, permsIn[k] === true, "booking", ip);
    }

    let screeningId: string;
    let healthCheck: "first" | "no_change" | "updated";
    if (screeningInput) {
      const s = await submitScreening({
        customerId: customer.id,
        input: screeningInput,
        changeAnswer: requireFull ? null : (change as "yes" | "unsure"),
        baseScreeningId: health.latestFull?.id ?? null,
        source: "booking",
        ip,
      });
      screeningId = s.id;
      healthCheck = health.latestFull ? "updated" : "first";
      await sendReviewNeeded(
        saved,
        healthCheck === "first" ? "submitted health screening with a booking" : "reported a health change with a booking",
      );
    } else {
      const s = await confirmNoChange({ customerId: customer.id, baseScreeningId: health.latestFull!.id, ip });
      screeningId = s.id;
      healthCheck = "no_change";
    }

    // ---- Reserve the place ------------------------------------------------
    const { data, error } = await db().rpc("club_reserve_place", {
      p_class_id: classId,
      p_name: profile.name,
      p_email: customer.email,
      p_phone: profile.phone,
      p_children: attending.length,
      p_waiver_version: WAIVER_VERSION,
      p_ip: ip,
      p_hold_minutes: CLUB.holdMinutes,
      p_offer_token: offerToken,
    });
    if (error) throw error;
    const row = (data as { result: string; booking_id: string; manage_token: string }[])[0];
    if (!row || row.result !== "ok") {
      return NextResponse.json(
        { error: MESSAGES[row?.result] ?? "Could not book that class.", code: row?.result },
        { status: 409 },
      );
    }

    // Keep exactly what was accepted for this booking.
    const { error: updateError } = await db()
      .from("club_bookings")
      .update({
        customer_id: customer.id,
        details_snapshot: {
          name: profile.name,
          phone: profile.phone,
          emergency_name: profile.emergencyName,
          emergency_relationship: profile.emergencyRelationship,
          emergency_phone: profile.emergencyPhone,
          care_notes: profile.careNotes || null,
          adult_confirmed: true,
        },
        children_snapshot: attending.map((c) => ({ id: c.id, name: c.name, age: c.age, relationship: c.relationship })),
        waiver_acknowledged: true,
        privacy_version: PRIVACY_VERSION,
        health_consent_version: HEALTH_CONSENT_VERSION,
        permissions_snapshot: Object.fromEntries(
          (Object.keys(PERMISSIONS) as PermissionKey[]).map((k) => [k, permsIn[k] === true]),
        ),
        screening_id: screeningId,
        health_check: healthCheck,
      })
      .eq("id", row.booking_id);
    if (updateError) throw updateError;

    const stripe = payments();
    // No Stripe keys yet (local development only): confirm straight away.
    if (!stripe) {
      await confirmBooking({ bookingId: row.booking_id, sessionId: null, paymentIntent: null, amountPence: 0 });
      return NextResponse.json({ url: `/280-club/booking/${row.manage_token}?new=1` });
    }

    const cls = await getClass(classId);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: CLUB.pricePence,
            product_data: {
              name: `Auric 280 Club: ${formatClassDate(cls.starts_at)}`,
              description: `${CLUB.time} · ${CLUB.venue}`,
            },
          },
        },
      ],
      // Only booking references go to Stripe: never health or children's details.
      metadata: { booking_id: row.booking_id, class_id: classId },
      payment_intent_data: { metadata: { booking_id: row.booking_id, class_id: classId } },
      expires_at: Math.floor(Date.now() / 1000) + (CLUB.holdMinutes - 1) * 60,
      success_url: `${siteUrl()}/280-club/booking/${row.manage_token}?new=1`,
      cancel_url: `${siteUrl()}/api/280-club/release?b=${row.manage_token}`,
    });
    await db().from("club_bookings").update({ stripe_session_id: session.id }).eq("id", row.booking_id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[280 Club] book", err);
    return bad("Something went wrong. Please try again.", 500);
  }
}
