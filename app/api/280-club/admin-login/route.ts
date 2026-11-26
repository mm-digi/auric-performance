import { NextResponse } from "next/server";
import { ADMIN_PENDING_COOKIE, ADMIN_PENDING_MINUTES, checkAdminPassword, createPendingAdmin } from "@/lib/club/admin-session";
import { issueCode } from "@/lib/club/codes";
import { sendSignInCode } from "@/lib/club/email";

/** Coach sign-in step 1: email + shared password, then a code is emailed. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") ?? "").trim().toLowerCase();
  const password = String(form?.get("password") ?? "");
  const base = new URL(req.url);
  const back = (params: Record<string, string>) => {
    const url = new URL("/admin/sign-in", base);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return NextResponse.redirect(url, 303);
  };

  if (!checkAdminPassword(email, password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return back({ error: "1" });
  }

  try {
    const code = await issueCode(email, "coach");
    if (!code) return back({ error: "rate" });
    await sendSignInCode(email, code, true);
    if (process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY) {
      console.info(`[280 Club] coach sign-in code for ${email}: ${code}`);
    }
    const res = back({ step: "code" });
    res.cookies.set(ADMIN_PENDING_COOKIE, (await createPendingAdmin(email))!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_PENDING_MINUTES * 60,
    });
    return res;
  } catch (err) {
    console.error("[280 Club] coach sign-in", err);
    return back({ error: "server" });
  }
}
