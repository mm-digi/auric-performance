import { NextResponse } from "next/server";
import { CLUB } from "@/lib/club/config";
import { currentCustomer } from "@/lib/club/current-customer";
import { cleanProfile, saveProfile } from "@/lib/club/customers";
import { sendWaitlistJoined } from "@/lib/club/email";
import { bookingOpen, db } from "@/lib/club/server";
import { getClass } from "@/lib/club/service";
import { isUuid } from "@/lib/club/validate";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (body.website) return NextResponse.json({ error: "Rejected." }, { status: 400 });
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!isUuid(body.classId)) return NextResponse.json({ error: "Please choose a class." }, { status: 400 });
  if (!bookingOpen()) {
    return NextResponse.json({ error: `Online booking opens soon. Email ${CLUB.replyTo} to reserve a place.` }, { status: 503 });
  }
  const profile = cleanProfile((body.profile ?? {}) as Record<string, unknown>);
  if (typeof profile === "string") return NextResponse.json({ error: profile }, { status: 400 });

  try {
    const cls = await getClass(body.classId);
    if (cls.status !== "scheduled" || new Date(cls.starts_at) <= new Date()) {
      return NextResponse.json({ error: "That class isn't taking bookings." }, { status: 409 });
    }
    const { data: booked } = await db()
      .from("club_bookings")
      .select("id")
      .eq("class_id", body.classId)
      .eq("email", customer.email.toLowerCase())
      .eq("status", "confirmed")
      .maybeSingle();
    if (booked) return NextResponse.json({ error: "You're already booked onto that class." }, { status: 409 });

    await saveProfile(customer, profile);
    const { error } = await db().from("club_waitlist").insert({
      class_id: body.classId,
      customer_id: customer.id,
      name: profile.name,
      email: customer.email.toLowerCase(),
      phone: profile.phone,
      children: 0,
    });
    if (error?.code === "23505") {
      return NextResponse.json({ error: "You're already on the waiting list for that class." }, { status: 409 });
    }
    if (error) throw error;
    await sendWaitlistJoined({ name: profile.name, email: customer.email }, cls);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[280 Club] waitlist", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
