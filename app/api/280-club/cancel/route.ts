import { NextResponse } from "next/server";
import { cancelByCustomer } from "@/lib/club/service";

export async function POST(req: Request) {
  const { token } = (await req.json().catch(() => ({}))) as { token?: string };
  if (!token || !/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  try {
    const result = await cancelByCustomer(token);
    if (result === "not_found") return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    if (result === "started") return NextResponse.json({ error: "This class has already started." }, { status: 409 });
    if (result === "already") return NextResponse.json({ error: "This booking is already cancelled." }, { status: 409 });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[280 Club] cancel", err);
    return NextResponse.json({ error: "Something went wrong. Please email info@auricperformance.co.uk." }, { status: 500 });
  }
}
