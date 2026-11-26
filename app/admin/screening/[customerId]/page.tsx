import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentCoach, logAccess } from "@/lib/club/admin-auth";
import { REVIEW_STATUSES, SCREENING_QUESTIONS } from "@/lib/club/config";
import {
  HEALTH_STATUS_LABEL,
  computeHealth,
  getCustomer,
  listChildren,
  listReviews,
  listScreenings,
} from "@/lib/club/customers";
import { formatDateTime } from "@/lib/club/format";
import { db } from "@/lib/club/server";
import { isUuid } from "@/lib/club/validate";
import NotAllowed from "../NotAllowed";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Screening record", robots: { index: false, follow: false } };

const ANSWER = { yes: "Yes", no: "No", unsure: "Unsure" } as const;

export default async function ScreeningRecord({ params }: { params: Promise<{ customerId: string }> }) {
  const coach = await currentCoach();
  if (!coach.reviewer) return <NotAllowed />;
  const { customerId } = await params;
  if (!isUuid(customerId)) notFound();
  const customer = await getCustomer(customerId);
  if (!customer) notFound();
  await logAccess(coach.email!, "view_health_record", customerId);

  const [children, screenings, reviews, consentsRes, bookingsRes] = await Promise.all([
    listChildren(customerId),
    listScreenings(customerId),
    listReviews(customerId),
    db().from("club_consents").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    db()
      .from("club_bookings")
      .select("id, status, health_check, waiver_version, waiver_accepted_at, club_classes(starts_at)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  const consents = (consentsRes.data ?? []) as { id: string; kind: string; granted: boolean; version: string; source: string; created_at: string }[];
  const healthConsent = consents.find((c) => c.kind === "health");
  const health = computeHealth(screenings, reviews, Boolean(healthConsent?.granted));
  const bookings = (bookingsRes.data ?? []) as unknown as {
    id: string;
    status: string;
    health_check: string | null;
    waiver_version: string;
    waiver_accepted_at: string;
    club_classes: { starts_at: string };
  }[];

  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Screening record</div>
          <h1 className="display">{customer.name || customer.email}</h1>
          <p className="lead">
            {customer.email} · {customer.phone ?? "no phone"} · Status: <strong>{HEALTH_STATUS_LABEL[health.status]}</strong>
          </p>
          <p><Link href="/admin/screening" className="btn">All screening</Link></p>
        </div>
      </section>

      <section className="wrap club-admin">
        {!health.consent && healthConsent && (
          <p className="club-book-notice">
            Health-data consent was withdrawn on {formatDateTime(healthConsent.created_at)}. Don&rsquo;t use these answers
            for new decisions; records are kept read-only. Follow up before they next exercise.
          </p>
        )}

        {health.latestFull && (
          <article className="club-admin-class">
            <header><h2>Record a review</h2><span>Latest questionnaire: {formatDateTime(health.latestFull.created_at)}</span></header>
            <ReviewForm customerId={customerId} screeningId={health.latestFull.id} statuses={REVIEW_STATUSES} />
          </article>
        )}

        <article className="club-admin-class">
          <header><h2>Health submissions</h2><span>{screenings.length}</span></header>
          {screenings.length === 0 && <p className="club-admin-queue">No screening submitted yet.</p>}
          {screenings.map((s) => {
            const sReviews = reviews.filter((r) => r.screening_id === s.id);
            return (
              <div key={s.id} className="club-screen-entry">
                <h3>
                  {s.kind === "full" ? "Questionnaire" : "No-change confirmation"} · {formatDateTime(s.created_at)}
                  <small>
                    {" "}v{s.questionnaire_version} · via {s.source}
                    {s.change_answer && s.kind === "full" ? ` · reported change: ${s.change_answer}` : ""}
                  </small>
                </h3>
                {s.kind === "full" && s.answers && (
                  <ol className="club-screen-answers">
                    {SCREENING_QUESTIONS.map((q) => {
                      const a = s.answers![q.id];
                      return (
                        <li key={q.id} className={a !== "no" ? "is-flag" : ""}>
                          <span>{q.text}</span>
                          <strong>{a ? ANSWER[a] : "–"}</strong>
                        </li>
                      );
                    })}
                  </ol>
                )}
                {s.details && <p className="club-screen-details"><strong>Details:</strong> {s.details}</p>}
                {s.contact_privately && <p className="club-screen-details"><strong>Asked to be contacted privately.</strong></p>}
                {sReviews.map((r) => (
                  <div key={r.id} className="club-screen-review">
                    <strong>{REVIEW_STATUSES[r.status]}</strong> · {r.reviewer_email} · {formatDateTime(r.created_at)}
                    {r.discussion && <p>Discussion: {r.discussion}</p>}
                    {r.adjustments && <p>Adjustments: {r.adjustments}</p>}
                    {r.clinical_evidence && <p>Clinical evidence: {r.clinical_evidence}</p>}
                    {r.follow_up_date && <p>Follow-up: {r.follow_up_date}</p>}
                  </div>
                ))}
              </div>
            );
          })}
        </article>

        <article className="club-admin-class">
          <header><h2>Details</h2></header>
          <dl className="club-summary">
            <div><dt>18 or over</dt><dd>{customer.adult_confirmed_at ? `Confirmed ${formatDateTime(customer.adult_confirmed_at)}` : "Not confirmed"}</dd></div>
            <div><dt>Emergency contact</dt><dd>{customer.emergency_name} ({customer.emergency_relationship}) {customer.emergency_phone}</dd></div>
            <div><dt>Collection / care</dt><dd>{customer.care_notes || "–"}</dd></div>
            <div><dt>Saved children</dt><dd>{children.length ? children.map((c) => `${c.name} (${c.age}, ${c.relationship})`).join("; ") : "–"}</dd></div>
          </dl>
        </article>

        <article className="club-admin-class">
          <header><h2>Consents and permissions</h2></header>
          <table>
            <thead><tr><th>When</th><th>What</th><th>Version</th><th>Via</th></tr></thead>
            <tbody>
              {consents.map((c) => (
                <tr key={c.id}>
                  <td>{formatDateTime(c.created_at)}</td>
                  <td>{c.kind} {c.granted ? "given" : "withdrawn"}</td>
                  <td>{c.version}</td>
                  <td>{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="club-admin-class">
          <header><h2>Bookings</h2></header>
          <table>
            <thead><tr><th>Class</th><th>Status</th><th>Health check</th><th>Waiver</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{formatDateTime(b.club_classes.starts_at)}</td>
                  <td>{b.status}</td>
                  <td>{b.health_check ?? "–"}</td>
                  <td>v{b.waiver_version} · {formatDateTime(b.waiver_accepted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
