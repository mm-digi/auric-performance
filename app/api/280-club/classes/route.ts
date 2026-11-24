import { NextResponse } from "next/server";
import { listClasses } from "@/lib/club/service";
import { payments, skipPayments } from "@/lib/club/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const classes = await listClasses();
    const bookingOpen = Boolean(payments()) || skipPayments();
    return NextResponse.json({ classes, bookingOpen }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[280 Club] classes", err);
    return NextResponse.json({ error: "Booking is unavailable right now." }, { status: 503 });
  }
}
