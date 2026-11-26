import type { Metadata } from "next";
import Link from "next/link";
import { CLUB } from "@/lib/club/config";
import { requireCustomer } from "@/lib/club/current-customer";
import { getHealth, getPermissions, listChildren } from "@/lib/club/customers";
import { formatClassDate } from "@/lib/club/format";
import { toHealthView } from "@/lib/club/health-view";
import { db } from "@/lib/club/server";
import AccountForms from "./AccountForms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account | 280 Club", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const customer = await requireCustomer("/280-club/account");
  const [children, perms, health, bookingsRes] = await Promise.all([
    listChildren(customer.id),
    getPermissions(customer.id),
    getHealth(customer.id),
    db()
      .from("club_bookings")
      .select("id, manage_token, children, club_classes!inner(starts_at)")
      .or(`customer_id.eq.${customer.id},email.eq."${customer.email.replace(/"/g, "")}"`)
      .eq("status", "confirmed")
      .gt("club_classes.starts_at", new Date().toISOString()),
  ]);
  const bookings = ((bookingsRes.data ?? []) as unknown as {
    id: string;
    manage_token: string;
    children: number;
    club_classes: { starts_at: string };
  }[]).sort((a, b) => a.club_classes.starts_at.localeCompare(b.club_classes.starts_at));

  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name}</div>
          <h1 className="display">My account</h1>
          <form method="post" action="/api/280-club/auth/sign-out" className="club-admin-signout">
            <span>Signed in as {customer.email}</span>
            <button type="submit" className="btn">Sign out</button>
          </form>
        </div>
      </section>

      <section className="wrap club-account">
        <div className="club-account-block">
          <h2>Upcoming bookings</h2>
          {bookings.length === 0 ? (
            <p className="club-form-help">No upcoming bookings.</p>
          ) : (
            <ul className="club-account-bookings">
              {bookings.map((b) => (
                <li key={b.id}>
                  <strong>{formatClassDate(b.club_classes.starts_at)}</strong>
                  <span>
                    {CLUB.time} · {b.children === 0 ? "Just you" : `${b.children} ${b.children === 1 ? "child" : "children"}`}
                  </span>
                  <Link href={`/280-club/booking/${b.manage_token}`}>View or cancel</Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/280-club#book" className="btn btn-gold">Book a Saturday</Link>
        </div>

        <AccountForms
          profile={{
            name: customer.name ?? "",
            phone: customer.phone ?? "",
            adult: Boolean(customer.adult_confirmed_at),
            emergencyName: customer.emergency_name ?? "",
            emergencyRelationship: customer.emergency_relationship ?? "",
            emergencyPhone: customer.emergency_phone ?? "",
            careNotes: customer.care_notes ?? "",
          }}
          childList={children}
          permissions={{ photo: perms.photo, child_photo: perms.child_photo, marketing: perms.marketing }}
          health={toHealthView(health)}
        />

        <p className="club-form-help">
          How we use and protect your information: <Link href={CLUB.privacyUrl}>privacy notice</Link>. Questions about
          your health information, or to ask for a copy or correction: <a href={`mailto:${CLUB.healthContact}`}>{CLUB.healthContact}</a>.
        </p>
      </section>
    </main>
  );
}
