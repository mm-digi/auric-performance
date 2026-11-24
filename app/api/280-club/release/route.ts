import { NextResponse } from "next/server";
import { releaseHold } from "@/lib/club/service";
import { siteUrl } from "@/lib/club/server";

export const dynamic = "force-dynamic";

/** Stripe Checkout "back" link: free the held place and return to the page. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("b");
  if (token && /^[a-f0-9]{48}$/.test(token)) {
    await releaseHold(token).catch((err) => console.error("[280 Club] release", err));
  }
  return NextResponse.redirect(`${siteUrl()}/280-club?checkout=cancelled#book`, 303);
}
