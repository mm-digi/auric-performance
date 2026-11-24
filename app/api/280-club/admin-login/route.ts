import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_DAYS, checkAdminLogin, createAdminSession } from "@/lib/club/admin-session";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") ?? "").trim().toLowerCase();
  const password = String(form?.get("password") ?? "");
  const base = new URL(req.url);

  if (!checkAdminLogin(email, password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    const back = new URL("/admin/sign-in", base);
    back.searchParams.set("error", "1");
    return NextResponse.redirect(back, 303);
  }

  const res = NextResponse.redirect(new URL("/admin", base), 303);
  res.cookies.set(ADMIN_COOKIE, (await createAdminSession(email))!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DAYS * 86_400,
  });
  return res;
}
