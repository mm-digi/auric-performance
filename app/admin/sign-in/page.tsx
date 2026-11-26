import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_PENDING_COOKIE, isValidAdminSession, pendingAdminEmail } from "@/lib/club/admin-session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coach sign in", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  "1": "That email and password don’t match. Please try again.",
  rate: "Too many codes requested. Please wait 15 minutes and try again.",
  server: "Something went wrong sending your code. Please try again.",
  code: "That code isn’t right or has expired.",
  expired: "Your sign-in took too long. Please start again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; out?: string; step?: string }>;
}) {
  const { error, out, step } = await searchParams;
  const jar = await cookies();
  if (await isValidAdminSession(jar.get(ADMIN_COOKIE)?.value)) redirect("/admin");
  const pending = step === "code" ? await pendingAdminEmail(jar.get(ADMIN_PENDING_COOKIE)?.value) : null;

  const logo = (
    <Image src="/images/280-club-lockup.png" alt="Auric 280 Club" width={1176} height={1283} className="club-signin-logo" priority />
  );

  if (pending) {
    return (
      <main className="club-signin">
        <form className="club-signin-card" method="post" action="/api/280-club/admin-verify">
          {logo}
          <div className="kicker">Coaches only</div>
          <h1>Check your email</h1>
          <p className="club-signin-intro">We&rsquo;ve emailed a 6-digit code to {pending}. It expires in 10 minutes.</p>
          {error && <p className="club-signin-error" role="alert">{ERRORS[error] ?? ERRORS.code}</p>}
          <label htmlFor="club-code">Code</label>
          <input id="club-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required autoFocus />
          <button type="submit" className="btn btn-gold">Sign in</button>
          <p className="club-signin-alt"><a href="/admin/sign-in">Start again</a></p>
        </form>
      </main>
    );
  }

  return (
    <main className="club-signin">
      <form className="club-signin-card" method="post" action="/api/280-club/admin-login">
        {logo}
        <div className="kicker">Coaches only</div>
        <h1>Sign in</h1>
        <p className="club-signin-intro">See who&rsquo;s booked in each Saturday, review screening and manage classes.</p>

        {error && <p className="club-signin-error" role="alert">{ERRORS[error] ?? ERRORS["1"]}</p>}
        {out && !error && <p className="club-signin-info">You&rsquo;ve been signed out.</p>}

        <label htmlFor="club-email">Email</label>
        <input id="club-email" name="email" type="email" autoComplete="username" required autoFocus />
        <label htmlFor="club-password" className="club-signin-gap">Password</label>
        <input id="club-password" name="password" type="password" autoComplete="current-password" required />
        <button type="submit" className="btn btn-gold">Continue</button>
      </form>
    </main>
  );
}
