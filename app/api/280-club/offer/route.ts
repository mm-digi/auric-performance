import { NextResponse } from "next/server";
import { db } from "@/lib/club/server";

export const dynamic = "force-dynamic";

/** Look up a waiting-list offer so the booking form can prefill it. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return NextResponse.json({ valid: false });
  const { data } = await db()
    .from("club_waitlist")
    .select("class_id, name, email, phone, children, status, offer_expires_at")
    .eq("offer_token", token)
    .maybeSingle();
  if (!data || data.status !== "offered" || new Date(data.offer_expires_at) <= new Date()) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({
    valid: true,
    classId: data.class_id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    children: data.children,
    expiresAt: data.offer_expires_at,
  });
}
