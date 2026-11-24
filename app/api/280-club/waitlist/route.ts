import { NextResponse } from "next/server";
import { db, payments, skipPayments } from "@/lib/club/server";
import { sendWaitlistJoined } from "@/lib/club/email";
import { getClass } from "@/lib/club/service";
import { cleanBooker, isUuid } from "@/lib/club/validate";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (body.website) return NextResponse.json({ error: "Rejected." }, { status: 400 });
  if (!isUuid(body.classId)) return NextResponse.json({ error: "Please choose a class." }, { status: 400 });
  const person = cleanBooker(body, false);
  if (typeof person === "string") return NextResponse.json({ error: person }, { status: 400 });
  if (!payments() && !skipPayments()) {
    return NextResponse.json({ error: "Online booking opens soon." }, { status: 503 });
  }

  try {
    const cls = await getClass(body.classId);
    if (cls.status !== "scheduled" || new Date(cls.starts_at) <= new Date()) {
      return NextResponse.json({ error: "That class isn't taking bookings." }, { status: 409 });
    }
    const { data: booked } = await db()
      .from("club_bookings")
      .select("id")
      .eq("class_id", body.classId)
      .eq("email", person.email)
      .eq("status", "confirmed")
      .maybeSingle();
    if (booked) return NextResponse.json({ error: "You're already booked onto that class." }, { status: 409 });

    const { error } = await db().from("club_waitlist").insert({
      class_id: body.classId,
      name: person.name,
      email: person.email,
      phone: person.phone || null,
      children: person.children,
    });
    if (error?.code === "23505") {
      return NextResponse.json({ error: "You're already on the waiting list for that class." }, { status: 409 });
    }
    if (error) throw error;
    await sendWaitlistJoined(person, cls);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[280 Club] waitlist", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
