import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { customerEmail } from "@/lib/club/customer-session";
import { CLUB } from "@/lib/club/config";
import SignInForm from "./SignInForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in | 280 Club", robots: { index: false, follow: false } };

const safeNext = (v: string | undefined) => (v && /^\/280-club(\/[\w\-/?=&%.]*)?$/.test(v) ? v : "/280-club/account");

export default async function CustomerSignIn({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await customerEmail()) redirect(next);

  return (
    <main className="club-signin">
      <div className="club-signin-card">
        <Image
          src="/images/280-club-lockup.png"
          alt={CLUB.name}
          width={1176}
          height={1283}
          className="club-signin-logo"
          priority
        />
        <div className="kicker">{CLUB.name}</div>
        <h1>Sign in</h1>
        <p className="club-signin-intro">
          We&rsquo;ll email you a 6-digit code. Your details, children and health answers are saved securely, so you
          only fill them in once.
        </p>
        <SignInForm next={next} />
      </div>
    </main>
  );
}
