"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLUB } from "@/lib/club/config";
import { formatPrice, formatShortDate, placeScarcity } from "@/lib/club/format";

type ClubClass = {
  id: string;
  startsAt: string;
  cancelled: boolean;
  spacesLeft: number;
  capacity: number;
  pricePence: number;
};

/** Sample rows so the wording can be checked locally. Not shown on the published site. */
const EXAMPLES: ClubClass[] = [
  { id: "example-open", startsAt: "2026-11-07T07:30:00.000Z", cancelled: false, spacesLeft: 12, capacity: 12, pricePence: 1000 },
  { id: "example-nearly", startsAt: "2026-11-14T07:30:00.000Z", cancelled: false, spacesLeft: 6, capacity: 12, pricePence: 1000 },
  { id: "example-3", startsAt: "2026-11-21T07:30:00.000Z", cancelled: false, spacesLeft: 3, capacity: 12, pricePence: 1000 },
  { id: "example-2", startsAt: "2026-11-28T07:30:00.000Z", cancelled: false, spacesLeft: 2, capacity: 12, pricePence: 1000 },
  { id: "example-1", startsAt: "2026-12-05T07:30:00.000Z", cancelled: false, spacesLeft: 1, capacity: 12, pricePence: 1000 },
  { id: "example-full", startsAt: "2026-12-12T07:30:00.000Z", cancelled: false, spacesLeft: 0, capacity: 12, pricePence: 1000 },
];

function ClassRow({ c, bookingOpen, example = false }: { c: ClubClass; bookingOpen: boolean; example?: boolean }) {
  const full = c.spacesLeft === 0;
  const scarcity = c.cancelled ? null : placeScarcity(c.spacesLeft, c.capacity);
  const label = c.cancelled ? "Cancelled" : full ? "Join waiting list" : "Book";
  return (
    <li className={`club-class${c.cancelled ? " is-cancelled" : ""}`}>
      <div className="club-class-date">
        <strong>{formatShortDate(c.startsAt)}</strong>
        <span>{CLUB.time}</span>
      </div>
      <div className="club-class-spaces">
        {(c.cancelled || scarcity) && <span>{c.cancelled ? "Cancelled" : scarcity}</span>}
        {scarcity && !full && (
          <div className="club-class-meter" aria-hidden="true">
            <i style={{ width: `${((c.capacity - c.spacesLeft) / c.capacity) * 100}%` }} />
          </div>
        )}
      </div>
      {!c.cancelled &&
        (example || !bookingOpen ? (
          <span className={`btn${full ? "" : " btn-gold"}${example || !bookingOpen ? " is-disabled" : ""}`} aria-disabled="true">
            {label}
          </span>
        ) : (
          <Link href={`/280-club/book/${c.id}`} className={`btn${full ? "" : " btn-gold"}`}>
            {label}
          </Link>
        ))}
    </li>
  );
}

/** Upcoming Saturdays with live spaces. Booking itself happens on /280-club/book/[id] after sign-in. */
export default function ClubBooking() {
  const [classes, setClasses] = useState<ClubClass[] | null>(null);
  const [bookingOpen, setBookingOpen] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/280-club/classes", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClasses(data.classes);
        setBookingOpen(data.bookingOpen);
      })
      .catch((e) => setLoadError(e instanceof Error && e.message ? e.message : "Booking is unavailable right now."));
    if (new URLSearchParams(window.location.search).get("checkout") === "cancelled") {
      setNotice("Payment cancelled. Your place has not been booked and nothing has been charged.");
    }
  }, []);

  return (
    <section className="wrap club-book" id="book" aria-labelledby="club-book-heading">
      <div className="kicker">Book your place</div>
      <h2 id="club-book-heading">Choose your Saturday</h2>
      <p className="club-book-intro">
        {formatPrice(CLUB.pricePence)} per adult, paid when you book. {CLUB.capacity} places each week. Kids come free.
        You&rsquo;ll sign in with your email so your details, children and health screening are saved for next time. If
        a class is full, join the waiting list and we&rsquo;ll email you if a place opens&nbsp;up.
      </p>

      {notice && <p className="club-book-notice">{notice}</p>}
      {!bookingOpen && (
        <p className="club-book-notice">
          Online booking opens soon. In the meantime email <a href={`mailto:${CLUB.replyTo}`}>{CLUB.replyTo}</a> to
          reserve a place.
        </p>
      )}
      {loadError && <p className="club-book-error">{loadError}</p>}
      {!classes && !loadError && <p className="club-book-loading">Loading classes…</p>}

      {process.env.NODE_ENV === "development" && (
        <>
          <p className="club-book-notice">Examples only. These Saturdays are not real and the buttons do not book.</p>
          <ul className="club-class-list">
            {EXAMPLES.map((c) => (
              <ClassRow key={c.id} c={c} bookingOpen={bookingOpen} example />
            ))}
          </ul>
        </>
      )}

      {classes && (
        <ul className="club-class-list">
          {classes.map((c) => (
            <ClassRow key={c.id} c={c} bookingOpen={bookingOpen} />
          ))}
        </ul>
      )}

      <p className="club-manage-link">
        Already booked?{" "}
        <Link href="/280-club/account">
          Manage your bookings <span aria-hidden="true">&rarr;</span>
        </Link>
      </p>
    </section>
  );
}
