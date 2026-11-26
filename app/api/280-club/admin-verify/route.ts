import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_PENDING_COOKIE,
  ADMIN_SESSION_DAYS,
  createAdminSession,
  pendingAdminEmail,
} from "@/lib/club/admin-session";
import { verifyCode } from "@/lib/club/codes";

/** Coach sign-in step 2: the emailed code. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const code = String(form?.get("code") ?? "");
  const base = new URL(req.url);
  const cookie = req.headers.get("cookie")?.match(new RegExp(`${ADMIN_PENDING_COOKIE}=([^;]+)`))?.[1];
  const email = await pendingAdminEmail(cookie ? decodeURIComponent(cookie) : undefined);

  if (!email) return NextResponse.redirect(new URL("/admin/sign-in?error=expired", base), 303);
  if (!(await verifyCode(email, "coach", code))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.redirect(new URL("/admin/sign-in?step=code&error=code", base), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", base), 303);
  res.cookies.set(ADMIN_PENDING_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, (await createAdminSession(email))!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DAYS * 86_400,
  });
  return res;
}
