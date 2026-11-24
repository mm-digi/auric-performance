import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CANCELLATION_POLICY, CLUB } from "@/lib/club/config";
import { formatClassDate, formatDateTime } from "@/lib/club/format";
import { db } from "@/lib/club/server";
import { isToken } from "@/lib/club/validate";
import type { BookingRow } from "@/lib/club/service";
import CancelBooking from "./CancelBooking";
import AutoRefresh from "./AutoRefresh";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your 280 Club booking", robots: { index: false, follow: false } };

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { token } = await params;
  const { new: isNew } = await searchParams;
  if (!isToken(token)) notFound();

  const { data } = await db()
    .from("club_bookings")
    .select("*, club_classes(starts_at, status, cancelled_reason)")
    .eq("manage_token", token)
    .maybeSingle();
  if (!data) notFound();
  const row = data as BookingRow & {
    hold_expires_at: string | null;
    club_classes: { starts_at: string; status: string; cancelled_reason: string | null };
  };
  // A payment hold that ran out without payment counts as not completed.
  const lapsed = row.status === "pending" && row.hold_expires_at && new Date(row.hold_expires_at) <= new Date();
  const booking = lapsed ? { ...row, status: "expired" as const } : row;
  const cls = booking.club_classes;
  const date = formatClassDate(cls.starts_at);
  const deadline = new Date(new Date(cls.starts_at).getTime() - CLUB.refundCutoffHours * 3600_000);
  const started = new Date(cls.starts_at) <= new Date();
  const refundable = new Date() <= deadline;

  let title = "You're booked in";
  let lead = `Your place on ${date} is confirmed. We've emailed your confirmation and a copy of the waiver.`;
  if (booking.status === "pending") {
    title = "Confirming your payment";
    lead = "This usually takes a few seconds. This page will update on its own.";
  } else if (booking.status === "expired") {
    title = "Booking not completed";
    lead = "Payment wasn't completed, so this place wasn't booked. Nothing has been charged.";
  } else if (booking.status === "cancelled") {
    title = "Booking cancelled";
    lead =
      booking.cancelled_by === "class_cancelled"
        ? `We cancelled the class on ${date}${cls.cancelled_reason ? `: ${cls.cancelled_reason}` : ""}. You've been refunded in full.`
        : booking.refund_status === "refunded"
          ? `Your booking for ${date} is cancelled and your £10 has been refunded.`
          : booking.refund_status === "failed"
            ? `Your booking for ${date} is cancelled. We'll process your refund by hand and confirm by email.`
            : `Your booking for ${date} is cancelled. It was after the refund deadline, so no refund is due.`;
  }

  return (
    <main className="club">
      {booking.status === "pending" && <AutoRefresh />}
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name}</div>
          <h1 className="display">{isNew && booking.status === "confirmed" ? "You're in" : title}</h1>
          <p className="lead">{lead}</p>
        </div>
      </section>

      {booking.status === "confirmed" && (
        <section className="wrap club-details">
          <dl className="club-detail-list">
            <div className="club-detail"><dt>Name</dt><dd>{booking.name}</dd></div>
            <div className="club-detail"><dt>Date</dt><dd>{date}</dd></div>
            <div className="club-detail"><dt>Time</dt><dd>{CLUB.time}</dd></div>
            <div className="club-detail">
              <dt>Venue</dt>
              <dd>
                {CLUB.venue}{" "}
                <a href={CLUB.venueUrl} target="_blank" rel="noopener noreferrer">How to find COACH</a>
              </dd>
            </div>
            <div className="club-detail"><dt>Parking</dt><dd>{CLUB.parking}</dd></div>
            <div className="club-detail">
              <dt>Children</dt>
              <dd>{booking.children === 0 ? "None" : booking.children} · {CLUB.children}</dd>
            </div>
            <div className="club-detail"><dt>Coffee after</dt><dd>{CLUB.coffee}</dd></div>
          </dl>

          <div className="club-manage">
            <h2>Need to cancel?</h2>
            <ul>
              {CANCELLATION_POLICY.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            {started ? (
              <p>This class has already started, so the booking can no longer be cancelled.</p>
            ) : (
              <CancelBooking
                token={token}
                refundable={refundable}
                deadline={formatDateTime(deadline.toISOString())}
              />
            )}
          </div>
        </section>
      )}

      {booking.status !== "confirmed" && booking.status !== "pending" && (
        <section className="wrap club-cta">
          <Link href="/280-club#book" className="btn btn-gold">Choose a Saturday</Link>
        </section>
      )}
    </main>
  );
}
