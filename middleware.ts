import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/club/admin-session";

// Protects the 280 Club admin at /admin. Coaches sign in at /admin/sign-in with
// an email in CLUB_ADMIN_EMAILS, CLUB_ADMIN_PASSWORD and an emailed code.
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/sign-in") return NextResponse.next();
  if (await isValidAdminSession(req.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/sign-in", req.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/280-club/admin/:path*"],
};
