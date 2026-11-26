import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/club/codes";
import { CUSTOMER_COOKIE, createCustomerSession, customerCookieOptions } from "@/lib/club/customer-session";
import { findOrCreateCustomer } from "@/lib/club/customers";

/** Check a customer's sign-in code and start their session. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  const code = String(body.code ?? "");
  try {
    if (!email || !(await verifyCode(email, "customer", code))) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { error: "That code isn’t right or has expired. Check the latest email, or send a new code." },
        { status: 400 },
      );
    }
    await findOrCreateCustomer(email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CUSTOMER_COOKIE, await createCustomerSession(email), customerCookieOptions);
    return res;
  } catch (err) {
    console.error("[280 Club] sign-in verify", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
