import { NextResponse } from "next/server";
import { listClasses, purgeExpired, sweep } from "@/lib/club/service";

export const dynamic = "force-dynamic";

/** Vercel Cron: keeps upcoming Saturdays created and moves the waiting list on. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  await listClasses();
  const offered = await sweep();
  const purged = await purgeExpired();
  return NextResponse.json({ ok: true, classesWithOffers: offered, purged });
}
