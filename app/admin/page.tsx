import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionEmail, isHealthReviewer } from "@/lib/club/admin-session";
import { CLUB } from "@/lib/club/config";
import {
  HEALTH_STATUS_LABEL,
  currentPermissions,
  healthStatuses,
  isReviewedSuitable,
  type HealthState,
} from "@/lib/club/customers";
import { formatClassDate } from "@/lib/club/format";
import { db } from "@/lib/club/server";
import { listClasses } from "@/lib/club/service";
import CancelClass from "./CancelClass";

// Protected by middleware.ts: coaches sign in at /admin/sign-in.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "280 Club admin", robots: { index: false, follow: false } };

type Booking = {
  id: string;
  class_id: string;
  customer_id: string | null;
  name: string;
  email: string;
  phone: string;
  children: number;
  children_snapshot: { name: string; age: string; relationship: string }[] | null;
  details_snapshot: { emergency_name?: string; emergency_relationship?: string; emergency_phone?: string } | null;
  health_check: string | null;
  permissions_snapshot: Record<string, boolean> | null;
};
type Waiting = { id: string; class_id: string; name: string; email: string; status: string; created_at: string };

function StatusBadge({ health, reviewer }: { health: HealthState | undefined; reviewer: boolean }) {
  if (!health) return <span className="club-badge is-warn">No account</span>;
  const ok = isReviewedSuitable(health.status);
  const label = reviewer ? HEALTH_STATUS_LABEL[health.status] : ok ? "Screening reviewed" : `Check with ${CLUB.coachName}`;
  return <span className={`club-badge ${ok ? "is-ok" : "is-warn"}`}>{label}</span>;
}

// Current photo permissions (falls back to what was given with the booking).
function photoLabel(b: Booking, current: Record<string, boolean> | undefined): string {
  const p = b.customer_id && current ? current : b.permissions_snapshot;
  if (!p) return "Not asked";
  const hasKids = (b.children_snapshot?.length ?? b.children) > 0;
  if (p.photo && (!hasKids || p.child_photo)) return hasKids ? "Yes, incl. children" : "Yes";
  if (p.photo) return "Adult only";
  if (hasKids && p.child_photo) return "Children only";
  return "No photos";
}

export default async function AdminPage() {
  const coach = await adminSessionEmail((await cookies()).get(ADMIN_COOKIE)?.value);
  const reviewer = isHealthReviewer(coach);
  const classes = await listClasses();
  const ids = classes.map((c) => c.id);
  const [{ data: bookings }, { data: waiting }] = await Promise.all([
    db()
      .from("club_bookings")
      .select("id, class_id, customer_id, name, email, phone, children, children_snapshot, details_snapshot, health_check, permissions_snapshot")
      .in("class_id", ids)
      .eq("status", "confirmed")
      .order("confirmed_at"),
    db()
      .from("club_waitlist")
      .select("id, class_id, name, email, status, created_at")
      .in("class_id", ids)
      .in("status", ["waiting", "offered"])
      .order("created_at"),
  ]);
  const all = (bookings ?? []) as Booking[];
  const customerIds = all.map((b) => b.customer_id ?? "");
  const [health, perms] = await Promise.all([healthStatuses(customerIds), currentPermissions(customerIds)]);

  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name}</div>
          <h1 className="display">Upcoming classes</h1>
          <p className="club-admin-help">
            Check every dad&rsquo;s screening status before each class. Payment is not approval to exercise.
          </p>
          <form method="post" action="/api/280-club/admin-logout" className="club-admin-signout">
            {coach && <span>Signed in as {coach}</span>}
            {reviewer && <Link href="/admin/screening" className="btn btn-gold">Screening reviews</Link>}
            <button type="submit" className="btn">Sign out</button>
          </form>
        </div>
      </section>
      <section className="wrap club-admin">
        {classes.map((c) => {
          const people = all.filter((b) => b.class_id === c.id);
          const queue = ((waiting ?? []) as Waiting[]).filter((w) => w.class_id === c.id);
          const kids = people.reduce((n, b) => n + b.children, 0);
          const flagged = people.filter((b) => !b.customer_id || !isReviewedSuitable(health.get(b.customer_id)!.status)).length;
          return (
            <article key={c.id} className="club-admin-class">
              <header>
                <h2>{formatClassDate(c.startsAt)}</h2>
                <span>
                  {c.cancelled
                    ? "Cancelled"
                    : `${people.length}/${c.capacity} adults · ${kids} children · ${queue.length} waiting${flagged ? ` · ${flagged} screening to check` : ""}`}
                </span>
              </header>
              {people.length > 0 && (
                <table>
                  <thead>
                    <tr><th>Name</th><th>Screening</th><th>Phone</th><th>Emergency contact</th><th>Children</th><th>Photos</th></tr>
                  </thead>
                  <tbody>
                    {people.map((b) => {
                      const h = b.customer_id ? health.get(b.customer_id) : undefined;
                      const e = b.details_snapshot;
                      return (
                        <tr key={b.id}>
                          <td>
                            {reviewer && b.customer_id ? <Link href={`/admin/screening/${b.customer_id}`}>{b.name}</Link> : b.name}
                            <small>{b.email}</small>
                          </td>
                          <td><StatusBadge health={h} reviewer={reviewer} /></td>
                          <td>{b.phone}</td>
                          <td>{e?.emergency_name ? `${e.emergency_name} (${e.emergency_relationship}) ${e.emergency_phone}` : "–"}</td>
                          <td>
                            {b.children_snapshot?.length
                              ? b.children_snapshot.map((k) => `${k.name} (${k.age})`).join(", ")
                              : b.children || "–"}
                          </td>
                          <td>{photoLabel(b, b.customer_id ? (perms.get(b.customer_id) ?? {}) : undefined)}</td>
                        </tr>
                      );
                    })}
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
