import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionEmail } from "@/lib/club/admin-session";
import { CLUB } from "@/lib/club/config";
import { formatClassDate } from "@/lib/club/format";
import { db } from "@/lib/club/server";
import { listClasses } from "@/lib/club/service";
import CancelClass from "./CancelClass";

// Protected by middleware.ts: coaches sign in at /admin/sign-in.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "280 Club admin", robots: { index: false, follow: false } };

type Booking = { id: string; class_id: string; name: string; email: string; phone: string; children: number };
type Waiting = { id: string; class_id: string; name: string; email: string; status: string; created_at: string };

export default async function AdminPage() {
  const coach = await adminSessionEmail((await cookies()).get(ADMIN_COOKIE)?.value);
  const classes = await listClasses();
  const ids = classes.map((c) => c.id);
  const [{ data: bookings }, { data: waiting }] = await Promise.all([
    db().from("club_bookings").select("id, class_id, name, email, phone, children").in("class_id", ids).eq("status", "confirmed").order("confirmed_at"),
    db().from("club_waitlist").select("id, class_id, name, email, status, created_at").in("class_id", ids).in("status", ["waiting", "offered"]).order("created_at"),
  ]);

  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name}</div>
          <h1 className="display">Upcoming classes</h1>
          <form method="post" action="/api/280-club/admin-logout" className="club-admin-signout">
            {coach && <span>Signed in as {coach}</span>}
            <button type="submit" className="btn">Sign out</button>
          </form>
        </div>
      </section>
      <section className="wrap club-admin">
        {classes.map((c) => {
          const people = ((bookings ?? []) as Booking[]).filter((b) => b.class_id === c.id);
          const queue = ((waiting ?? []) as Waiting[]).filter((w) => w.class_id === c.id);
          const kids = people.reduce((n, b) => n + b.children, 0);
          return (
            <article key={c.id} className="club-admin-class">
              <header>
                <h2>{formatClassDate(c.startsAt)}</h2>
                <span>
                  {c.cancelled ? "Cancelled" : `${people.length}/${c.capacity} adults · ${kids} children · ${queue.length} waiting`}
                </span>
              </header>
              {people.length > 0 && (
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Kids</th></tr></thead>
                  <tbody>
                    {people.map((b) => (
                      <tr key={b.id}><td>{b.name}</td><td>{b.email}</td><td>{b.phone}</td><td>{b.children}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
              {queue.length > 0 && (
                <p className="club-admin-queue">
                  Waiting list: {queue.map((w) => `${w.name}${w.status === "offered" ? " (offered)" : ""}`).join(", ")}
                </p>
              )}
              {!c.cancelled && <CancelClass classId={c.id} label={formatClassDate(c.startsAt)} count={people.length} />}
            </article>
          );
        })}
      </section>
    </main>
  );
}
