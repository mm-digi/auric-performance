"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLUB } from "@/lib/club/config";
import { formatPrice, formatShortDate } from "@/lib/club/format";

type ClubClass = {
  id: string;
  startsAt: string;
  cancelled: boolean;
  spacesLeft: number;
  capacity: number;
  pricePence: number;
};

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
        a class is full, join the waiting list and we&rsquo;ll email you if a place opens up.
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

      {classes && (
        <ul className="club-class-list">
          {classes.map((c) => {
            const full = c.spacesLeft === 0;
            return (
              <li key={c.id} className={`club-class${c.cancelled ? " is-cancelled" : ""}`}>
                <div className="club-class-date">
                  <strong>{formatShortDate(c.startsAt)}</strong>
                  <span>{CLUB.time}</span>
                </div>
                <div className="club-class-spaces">
                  <span>{c.cancelled ? "Cancelled" : full ? "Full" : `${c.spacesLeft} of ${c.capacity} places left`}</span>
                  {!c.cancelled && (
                    <div className="club-class-meter" aria-hidden="true">
                      <i style={{ width: `${((c.capacity - c.spacesLeft) / c.capacity) * 100}%` }} />
                    </div>
                  )}
                </div>
                {!c.cancelled &&
                  (bookingOpen ? (
                    <Link href={`/280-club/book/${c.id}`} className={`btn${full ? "" : " btn-gold"}`}>
                      {full ? "Join waiting list" : "Book"}
                    </Link>
                  ) : (
                    <span className="btn btn-gold is-disabled" aria-disabled="true">Book</span>
                  ))}
              </li>
            );
          })}
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
