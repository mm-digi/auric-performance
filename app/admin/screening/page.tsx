import type { Metadata } from "next";
import Link from "next/link";
import { currentCoach, logAccess } from "@/lib/club/admin-auth";
import { CLUB } from "@/lib/club/config";
import { HEALTH_STATUS_LABEL, healthStatuses, isReviewedSuitable, type Customer } from "@/lib/club/customers";
import { formatShortDate } from "@/lib/club/format";
import { db } from "@/lib/club/server";
import NotAllowed from "./NotAllowed";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Screening reviews", robots: { index: false, follow: false } };

const NEEDS_REVIEW = new Set(["pending", "awaiting_discussion", "awaiting_clinical_evidence"]);
const FOLLOW_UP = new Set(["consent_withdrawn", "refresh_due", "deferred"]);

export default async function ScreeningList() {
  const coach = await currentCoach();
  if (!coach.reviewer) return <NotAllowed />;
  await logAccess(coach.email!, "view_screening_list", null);

  const customers = ((await db().from("club_customers").select("*").order("created_at", { ascending: false })).data ??
    []) as Customer[];
  const health = await healthStatuses(customers.map((c) => c.id));
  const rows = customers
    .map((c) => ({ c, h: health.get(c.id)! }))
    .filter((r) => r.h.lastActivityAt || r.c.profile_completed_at);
  const today = new Date().toISOString().slice(0, 10);
  const queue = rows.filter((r) => NEEDS_REVIEW.has(r.h.status));
  const followUps = rows.filter(
    (r) => FOLLOW_UP.has(r.h.status) || (r.h.review?.follow_up_date && r.h.review.follow_up_date <= today),
  );

  const table = (list: typeof rows) => (
    <table>
      <thead>
        <tr><th>Name</th><th>Status</th><th>Last questionnaire</th><th>Follow-up</th></tr>
      </thead>
      <tbody>
        {list.map(({ c, h }) => (
          <tr key={c.id}>
            <td>
              <Link href={`/admin/screening/${c.id}`}>{c.name || c.email}</Link>
              <small>{c.email}</small>
            </td>
            <td>
              <span className={`club-badge ${isReviewedSuitable(h.status) ? "is-ok" : "is-warn"}`}>{HEALTH_STATUS_LABEL[h.status]}</span>
            </td>
            <td>{h.latestFull ? formatShortDate(h.latestFull.created_at) : "–"}</td>
            <td>{h.review?.follow_up_date ? formatShortDate(h.review.follow_up_date) : "–"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name} · health screening</div>
          <h1 className="display">Screening reviews</h1>
          <p className="club-admin-help">
            Every first submission and every changed answer needs a recorded review before that person exercises,
            including all-No answers. Your outcomes are exercise-management decisions, not medical diagnoses. Every view
            on these pages is logged.
          </p>
          <p><Link href="/admin" className="btn">Back to classes</Link></p>
        </div>
      </section>
      <section className="wrap club-admin">
        <article className="club-admin-class">
          <header><h2>Needs review</h2><span>{queue.length}</span></header>
          {queue.length ? table(queue) : <p className="club-admin-queue">Nothing waiting. 👍</p>}
        </article>
        {followUps.length > 0 && (
          <article className="club-admin-class">
            <header><h2>Follow up</h2><span>{followUps.length}</span></header>
            {table(followUps)}
          </article>
        )}
        <article className="club-admin-class">
          <header><h2>Everyone</h2><span>{rows.length}</span></header>
          {table(rows)}
        </article>
      </section>
    </main>
  );
}
