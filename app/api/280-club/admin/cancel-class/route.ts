import { NextResponse } from "next/server";
import { cancelClass } from "@/lib/club/service";
import { isUuid } from "@/lib/club/validate";

// Protected by middleware.ts (CLUB_ADMIN_PASSWORD).
export async function POST(req: Request) {
  const { classId, reason } = (await req.json().catch(() => ({}))) as { classId?: string; reason?: string };
  if (!isUuid(classId)) return NextResponse.json({ error: "Missing class." }, { status: 400 });
  try {
    const result = await cancelClass(classId, reason?.trim().slice(0, 500) || null);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[280 Club] cancel class", err);
    return NextResponse.json({ error: "Could not cancel the class." }, { status: 500 });
  }
}
