import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/club/admin-session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coach sign in", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; out?: string }> }) {
  const { error, out } = await searchParams;
  if (await isValidAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin");

  return (
    <main className="club-signin">
      <form className="club-signin-card" method="post" action="/api/280-club/admin-login">
        <Image
          src="/images/280-club-lockup.png"
          alt="Auric 280 Club"
          width={1176}
          height={1283}
          className="club-signin-logo"
          priority
        />
        <div className="kicker">Coaches only</div>
        <h1>Sign in</h1>
        <p className="club-signin-intro">See who&rsquo;s booked in each Saturday, check the waiting list and manage classes.</p>

        {error && (
          <p className="club-signin-error" role="alert">
            That email and password don&rsquo;t match. Please try again.
          </p>
        )}
        {out && !error && <p className="club-signin-info">You&rsquo;ve been signed out.</p>}

        <label htmlFor="club-email">Email</label>
        <input id="club-email" name="email" type="email" autoComplete="username" required autoFocus />
        <label htmlFor="club-password" className="club-signin-gap">Password</label>
        <input id="club-password" name="password" type="password" autoComplete="current-password" required />
        <button type="submit" className="btn btn-gold">
          Sign in
        </button>
      </form>
    </main>
  );
}
