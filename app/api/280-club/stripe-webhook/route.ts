import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db, payments } from "@/lib/club/server";
import { confirmBooking, offerSpaces } from "@/lib/club/service";

export async function POST(req: Request) {
  const stripe = payments();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!stripe || !secret || !signature) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (bookingId && session.payment_status === "paid") {
        await confirmBooking({
          bookingId,
          sessionId: session.id,
          paymentIntent:
            typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
          amountPence: session.amount_total,
        });
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      if (bookingId) {
        const { data } = await db()
          .from("club_bookings")
          .update({ status: "expired" })
          .eq("id", bookingId)
          .eq("status", "pending")
          .select("class_id")
          .maybeSingle();
        const classId = data?.class_id ?? session.metadata?.class_id;
        if (classId) await offerSpaces(classId);
      }
    }
  } catch (err) {
    console.error("[280 Club] webhook", event.type, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 }); // Stripe retries
  }
  return NextResponse.json({ received: true });
}
