import { NextResponse } from "next/server";
import { issueCode } from "@/lib/club/codes";
import { sendSignInCode } from "@/lib/club/email";

/** Email a one-time sign-in code to a customer. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    const code = await issueCode(email, "customer");
    if (!code) {
      return NextResponse.json(
        { error: "Too many codes requested. Please wait 15 minutes and try again." },
        { status: 429 },
      );
    }
    await sendSignInCode(email, code);
    if (process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY) {
      console.info(`[280 Club] sign-in code for ${email}: ${code}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[280 Club] sign-in request", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
