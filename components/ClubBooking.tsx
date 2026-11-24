"use client";

import { useEffect, useRef, useState } from "react";
import { CANCELLATION_POLICY, CLUB, WAIVER, WAIVER_TITLE, WAIVER_VERSION } from "@/lib/club/config";
import { formatClassDate, formatDateTime, formatPrice, formatShortDate } from "@/lib/club/format";

type ClubClass = {
  id: string;
  startsAt: string;
  cancelled: boolean;
  spacesLeft: number;
  capacity: number;
  pricePence: number;
};

type Offer = { classId: string; name: string; email: string; phone: string; children: number; expiresAt: string };

type Mode = "book" | "waitlist";

export default function ClubBooking() {
  const [classes, setClasses] = useState<ClubClass[] | null>(null);
  const [bookingOpen, setBookingOpen] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<{ id: string; mode: Mode } | null>(null);
  const [offer, setOffer] = useState<(Offer & { token: string }) | null>(null);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", children: 0, website: "" });
  const [waiver, setWaiver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/280-club/classes", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClasses(data.classes);
      setBookingOpen(data.bookingOpen);
    } catch (e) {
      setLoadError(e instanceof Error && e.message ? e.message : "Booking is unavailable right now.");
    }
  }

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "cancelled") {
      setNotice("Payment cancelled. Your place has not been booked and nothing has been charged.");
    }
    const token = params.get("offer");
    if (token) {
      fetch(`/api/280-club/offer?token=${encodeURIComponent(token)}`)
        .then((r) => r.json())
        .then((o) => {
          if (!o.valid) {
            setNotice("That waiting-list offer has expired or has already been used.");
            return;
          }
          setOffer({ ...o, token });
          setForm((f) => ({ ...f, name: o.name, email: o.email, phone: o.phone, children: o.children }));
          setSelected({ id: o.classId, mode: "book" });
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (selected) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  const chosen = classes?.find((c) => c.id === selected?.id);
  const offerApplies = offer && selected && offer.classId === selected.id;

  function choose(c: ClubClass, mode: Mode) {
    setSelected({ id: c.id, mode });
    setError("");
    setJoined(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setError("");
    if (selected.mode === "book" && !waiver) {
      setError("Please read the waiver and tick the box to confirm.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(selected.mode === "book" ? "/api/280-club/book" : "/api/280-club/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          classId: selected.id,
          waiver,
          waiverVersion: WAIVER_VERSION,
          offerToken: offerApplies ? offer.token : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        if (data.code === "full") load();
        setSubmitting(false);
        return;
      }
      if (selected.mode === "book") {
        window.location.href = data.url;
        return;
      }
      setJoined(selected.id);
      setSubmitting(false);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "children" ? Number(e.target.value) : e.target.value }));

  return (
    <section className="wrap club-book" id="book" aria-labelledby="club-book-heading">
      <div className="kicker">Book your place</div>
      <h2 id="club-book-heading">Choose your Saturday</h2>
      <p className="club-book-intro">
        {formatPrice(CLUB.pricePence)} per adult, paid when you book. {CLUB.capacity} places each week. Kids come free.
        If a class is full, join the waiting list and we&rsquo;ll email you if a place opens up.
      </p>

      {notice && <p className="club-book-notice">{notice}</p>}
      {!bookingOpen && (
        <p className="club-book-notice">
          Online booking opens soon. In the meantime email{" "}
          <a href={`mailto:${CLUB.replyTo}`}>{CLUB.replyTo}</a> to reserve a place.
        </p>
      )}

      {loadError && <p className="club-book-error">{loadError}</p>}
      {!classes && !loadError && <p className="club-book-loading">Loading classes…</p>}

      {classes && (
        <ul className="club-class-list">
          {classes.map((c) => {
            const full = c.spacesLeft === 0;
            const isOffer = offer?.classId === c.id;
            const active = selected?.id === c.id;
            return (
              <li key={c.id} className={`club-class${active ? " is-active" : ""}${c.cancelled ? " is-cancelled" : ""}`}>
                <div className="club-class-date">
                  <strong>{formatShortDate(c.startsAt)}</strong>
                  <span>{CLUB.time}</span>
                </div>
                <div className="club-class-spaces">
                  {c.cancelled ? (
                    <span>Cancelled</span>
                  ) : isOffer ? (
                    <span>Place held for you</span>
                  ) : full ? (
                    <span>Full</span>
                  ) : (
                    <span>
                      {c.spacesLeft} of {c.capacity} places left
                    </span>
                  )}
                  {!c.cancelled && (
                    <div className="club-class-meter" aria-hidden="true">
                      <i style={{ width: `${((c.capacity - c.spacesLeft) / c.capacity) * 100}%` }} />
                    </div>
                  )}
                </div>
                {!c.cancelled &&
                  (full && !isOffer ? (
                    <button type="button" className="btn" onClick={() => choose(c, "waitlist")}>
                      Join waiting list
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`btn btn-gold${bookingOpen ? "" : " is-disabled"}`}
                      disabled={!bookingOpen}
                      onClick={() => choose(c, "book")}
                    >
                      Book
                    </button>
                  ))}
              </li>
            );
          })}
        </ul>
      )}

      {selected && chosen && (
        <div className="club-book-panel" ref={formRef}>
          {joined === selected.id ? (
            <div className="club-book-done">
              <h3>You&rsquo;re on the waiting list</h3>
              <p>
                We&rsquo;ve emailed you to confirm. If a place opens up for {formatClassDate(chosen.startsAt)}, we&rsquo;ll
                email you a link to book it. You won&rsquo;t be charged unless you book.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="club-book-panel-head">
                <div>
                  <div className="kicker">{selected.mode === "book" ? "Booking" : "Waiting list"}</div>
                  <h3>{formatClassDate(chosen.startsAt)}</h3>
                  <p>
                    {CLUB.time} · {CLUB.venue}
                  </p>
                  {offerApplies && (
                    <p className="club-book-offer">
                      We&rsquo;re holding this place for you until {formatDateTime(offer.expiresAt)}.
                    </p>
                  )}
                </div>
                <button type="button" className="club-book-close" onClick={() => setSelected(null)} aria-label="Close">
                  ×
                </button>
              </div>

              <div className="club-book-fields">
                <label>
                  <span>Full name</span>
                  <input required autoComplete="name" value={form.name} onChange={set("name")} />
                </label>
                <label>
                  <span>Email</span>
                  <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} />
                </label>
                <label>
                  <span>Mobile number{selected.mode === "waitlist" ? " (optional)" : ""}</span>
                  <input
                    required={selected.mode === "book"}
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </label>
                <label>
                  <span>Children coming with you</span>
                  <select value={form.children} onChange={set("children")}>
                    <option value={0}>None</option>
                    <option value={1}>1 child</option>
                    <option value={2}>2 children</option>
                  </select>
                </label>
                <label className="club-book-honeypot" aria-hidden="true">
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                </label>
              </div>

              {selected.mode === "book" && (
                <>
                  <div className="club-waiver">
                    <h4>{WAIVER_TITLE}</h4>
                    <div className="club-waiver-text" tabIndex={0} aria-label={WAIVER_TITLE}>
                      {WAIVER.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                  <div className="club-policy">
                    <h4>Cancellation policy</h4>
                    <ul>
                      {CANCELLATION_POLICY.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                  <label className="club-ack">
                    <input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} />
                    <span>
                      I have read and agree to the participation waiver, terms and cancellation policy, and I will
                      supervise any children I bring throughout the session.
                    </span>
                  </label>
                </>
              )}

              {error && (
                <p className="club-book-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-gold club-book-submit" disabled={submitting}>
                {submitting
                  ? "Please wait…"
                  : selected.mode === "book"
                    ? `Pay ${formatPrice(chosen.pricePence)} and book`
                    : "Join the waiting list"}
              </button>
              {selected.mode === "book" && (
                <p className="club-book-small">
                  You&rsquo;ll pay securely with Stripe. We hold your place for {CLUB.holdMinutes - 2} minutes while you
                  pay, then email your confirmation.
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </section>
  );
}
