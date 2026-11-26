import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE } from "@/lib/club/customer-session";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/280-club", req.url), 303);
  res.cookies.set(CUSTOMER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
