import { NextResponse } from "next/server";
import { CLUB, WAIVER_VERSION } from "@/lib/club/config";
import { formatClassDate } from "@/lib/club/format";
import { db, payments, siteUrl, skipPayments } from "@/lib/club/server";
import { confirmBooking, getClass } from "@/lib/club/service";
import { cleanBooker, isToken, isUuid } from "@/lib/club/validate";

const MESSAGES: Record<string, string> = {
  not_found: "That class could not be found.",
  cancelled: "That class has been cancelled.",
  closed: "Booking has closed for that class.",
  duplicate: "You're already booked onto that class. Check your email for your confirmation.",
  offer_invalid: "That waiting-list offer has expired or already been used.",
  full: "Sorry, that class has just filled up. You can join the waiting list instead.",
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (body.website) return NextResponse.json({ error: "Rejected." }, { status: 400 }); // honeypot
  if (!isUuid(body.classId)) return NextResponse.json({ error: "Please choose a class." }, { status: 400 });
  const classId = body.classId;
  if (body.waiver !== true || body.waiverVersion !== WAIVER_VERSION) {
    return NextResponse.json({ error: "Please read and accept the waiver to book." }, { status: 400 });
  }
  const person = cleanBooker(body);
  if (typeof person === "string") return NextResponse.json({ error: person }, { status: 400 });
  const offerToken = isToken(body.offerToken) ? body.offerToken : null;

  const stripe = payments();
  if (!stripe && !skipPayments()) {
    return NextResponse.json(
      { error: "Online booking opens soon. Please email info@auricperformance.co.uk to reserve a place." },
      { status: 503 },
    );
  }

  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
    const { data, error } = await db().rpc("club_reserve_place", {
      p_class_id: classId,
      p_name: person.name,
      p_email: person.email,
      p_phone: person.phone,
      p_children: person.children,
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

    // No Stripe keys yet (local development only): confirm straight away.
    if (!stripe) {
      await confirmBooking({ bookingId: row.booking_id, sessionId: null, paymentIntent: null, amountPence: 0 });
      return NextResponse.json({ url: `/280-club/booking/${row.manage_token}?new=1` });
    }

    const cls = await getClass(classId);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: person.email,
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
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
