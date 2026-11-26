"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChildrenEditor,
  HealthConsent,
  PermissionFields,
  ProfileFields,
  ProfileSummary,
  ScreeningForm,
  WaiverBox,
  emptyScreening,
  screeningError,
  type ChildState,
  type ProfileState,
} from "@/components/club/forms";
import {
  CANCELLATION_POLICY,
  CLUB,
  HEALTH_CHANGE_QUESTION,
  PRIVACY_VERSION,
  REVIEW_PENDING_NOTICE,
  WAIVER_VERSION,
  type PermissionKey,
} from "@/lib/club/config";
import { healthMessage, type HealthView } from "@/lib/club/customer-view";
import { formatClassDate, formatDateTime, formatPrice } from "@/lib/club/format";

type Cls = { id: string; startsAt: string; spacesLeft: number; capacity: number; pricePence: number };

export default function BookingWizard(props: {
  cls: Cls;
  mode: "book" | "waitlist";
  alreadyWaiting: boolean;
  offer: { token: string; expiresAt: string } | null;
  bookingOpen: boolean;
  profileComplete: boolean;
  profile: ProfileState;
  childList: { id: string; name: string; age: string; relationship: string }[];
  permissions: Record<PermissionKey, boolean>;
  health: HealthView;
}) {
  const { cls, mode, offer, health } = props;

  const [profile, setProfile] = useState(props.profile);
  const [editingProfile, setEditingProfile] = useState(!props.profileComplete);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);

  const [bringing, setBringing] = useState<"" | "yes" | "no">("");
  const [kids, setKids] = useState<ChildState[]>(props.childList.map((c) => ({ ...c, key: c.id, attending: false })));

  const [consent, setConsent] = useState(false);
  const [change, setChange] = useState<"" | "no" | "yes" | "unsure">("");
  const [screening, setScreening] = useState(() =>
    emptyScreening({ answers: health.lastAnswers, details: health.lastDetails, contactPrivately: health.lastContactPrivately }),
  );
  // Answers aren't confirmed until the customer ticks the declaration again.

  const [perms, setPerms] = useState(props.permissions);
  const [waiver, setWaiver] = useState(false);
  const [website, setWebsite] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(props.alreadyWaiting);

  const needFull = health.requireFull || change === "yes" || change === "unsure";
  const showQuestionnaire = health.requireFull || change === "yes" || change === "unsure";
  const attending = bringing === "yes" ? kids.filter((k) => k.attending) : [];
  const date = formatClassDate(cls.startsAt);
  const status = healthMessage(health);
  const willBePending =
    needFull || !(health.status === "suitable" || health.status === "suitable_with_adjustments");

  function validate(): string | null {
    if (!profile.name || !profile.phone || !profile.emergencyName || !profile.emergencyRelationship || !profile.emergencyPhone)
      return "Please complete your details and emergency contact.";
    if (!profile.adult) return "Please confirm you are 18 or over.";
    if (!editingProfile && !detailsConfirmed) return "Please confirm your saved details are still correct, or edit them.";
    if (mode === "waitlist") return null;
    if (!bringing) return "Please tell us whether you’re bringing children.";
    if (bringing === "yes" && attending.length === 0) return "Please tick which children are coming, or add a child.";
    if (!health.consent && !consent) return "Please tick the health information consent box. If you’d rather not, email us to talk privately.";
    if (!health.requireFull && !change) return "Please answer the health-change question.";
    if (needFull) {
      const e = screeningError(screening);
      if (e) return e;
    }
    if (!waiver) return "Please read the waiver and tick the acknowledgement.";
    return null;
  }

  async function submit() {
    setError("");
    const problem = validate();
    if (problem) return setError(problem);
    setBusy(true);
    try {
      const res = await fetch(mode === "book" ? "/api/280-club/book" : "/api/280-club/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: cls.id,
          offerToken: offer?.token,
          profile,
          detailsConfirmed: true,
          bringingChildren: bringing === "yes",
          children: kids,
          health: {
            consent: health.consent || consent,
            changeAnswer: health.requireFull ? null : change,
            screening: needFull ? screening : null,
          },
          permissions: perms,
          waiver,
          waiverVersion: WAIVER_VERSION,
          privacyVersion: PRIVACY_VERSION,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      if (mode === "book") {
        window.location.href = data.url;
        return;
      }
      setJoined(true);
      setBusy(false);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setBusy(false);
    }
  }

  if (mode === "waitlist" && joined) {
    return (
      <div className="club-book-panel">
        <h3>You&rsquo;re on the waiting list</h3>
        <p className="club-form-help">
          If a place opens up for {date}, we&rsquo;ll email you a link to book it. You won&rsquo;t be charged unless you
          book.
        </p>
        <Link href="/280-club#book" className="btn">Back to all Saturdays</Link>
      </div>
    );
  }

  let n = 0;
  const step = () => String(++n).padStart(2, "0");

  return (
    <div className="club-wizard">
      {mode === "waitlist" ? (
        <p className="club-book-notice">
          This Saturday is full. Join the waiting list and we&rsquo;ll email you if a place opens up.
        </p>
      ) : offer ? (
        <p className="club-book-notice">We&rsquo;re holding a place for you until {formatDateTime(offer.expiresAt)}.</p>
      ) : (
        <p className="club-book-intro">
          {cls.spacesLeft} of {cls.capacity} places left · {formatPrice(cls.pricePence)} per adult · children free.
        </p>
      )}
      {!props.bookingOpen && (
        <p className="club-book-notice">
          Online booking opens soon. In the meantime email <a href={`mailto:${CLUB.replyTo}`}>{CLUB.replyTo}</a> to
          reserve a place.
        </p>
      )}

      {/* Details */}
      <section className="club-step-card">
        <header><span>{step()}</span><h2>Your details</h2></header>
        <p className="club-form-help">
          We use these to manage your booking and contact you or your emergency contact if needed. See our{" "}
          <a href={CLUB.privacyUrl} target="_blank" rel="noopener noreferrer">privacy notice</a>. If someone else is
          paying for you, you still need to book and accept the terms yourself.
        </p>
        {editingProfile ? (
          <ProfileFields value={profile} onChange={setProfile} />
        ) : (
          <>
            <ProfileSummary value={profile} />
            <label className="club-ack">
              <input type="checkbox" checked={detailsConfirmed} onChange={(e) => setDetailsConfirmed(e.target.checked)} />
              <span>These details are still correct.</span>
            </label>
            <button type="button" className="club-link-btn" onClick={() => setEditingProfile(true)}>
              Edit my details
            </button>
          </>
        )}
      </section>

      {mode === "book" && (
        <>
          {/* Children */}
          <section className="club-step-card">
            <header><span>{step()}</span><h2>Children this week</h2></header>
            <fieldset className="club-yn club-yn-wide">
              <legend>Are you bringing children?</legend>
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className={bringing === v ? "is-on" : ""}>
                  <input
                    type="radio"
                    name="bringing"
                    checked={bringing === v}
                    onChange={() => {
                      setBringing(v);
                      if (v === "yes" && kids.length === 0) {
                        setKids([{ key: `new-${Date.now()}`, id: null, name: "", age: "", relationship: "", attending: true }]);
                      }
                    }}
                  />
                  <span>{v === "yes" ? "Yes" : "No, just me"}</span>
                </label>
              ))}
            </fieldset>
            {bringing === "yes" && (
              <>
                <p className="club-form-help">
                  Tick who&rsquo;s coming this week. There&rsquo;s no fixed limit, but please only bring as many children as
                  you can safely supervise. Changes here are saved to your account.
                </p>
                <ChildrenEditor value={kids} onChange={setKids} selectAttending />
                <p className="club-children-total">
                  {attending.length} {attending.length === 1 ? "child" : "children"} coming with you
                </p>
              </>
            )}
          </section>

          {/* Health */}
          <section className="club-step-card">
            <header><span>{step()}</span><h2>Health screening</h2></header>
            {!health.requireFull && <p className={`club-health-status is-${status.tone}`}>{status.text}</p>}
            {!health.consent && <HealthConsent checked={consent} onChange={setConsent} />}
            {!health.requireFull && (
              <fieldset className="club-yn club-yn-wide">
                <legend>{HEALTH_CHANGE_QUESTION}</legend>
                {(["no", "yes", "unsure"] as const).map((v) => (
                  <label key={v} className={change === v ? "is-on" : ""}>
                    <input type="radio" name="change" checked={change === v} onChange={() => setChange(v)} />
                    <span>{v === "no" ? "No changes" : v === "yes" ? "Yes" : "Unsure"}</span>
                  </label>
                ))}
              </fieldset>
            )}
            {!health.requireFull && (change === "yes" || change === "unsure") && (
              <p className="club-form-help">
                Your saved answers are below. Update anything that&rsquo;s changed. Your earlier answers are kept, and{" "}
                {CLUB.coachName} will review the new ones before you exercise.
              </p>
            )}
            {showQuestionnaire && (health.consent || consent) && <ScreeningForm value={screening} onChange={setScreening} />}
            {showQuestionnaire && !health.consent && !consent && (
              <p className="club-form-help">Tick the consent box above to answer the health questions.</p>
            )}
          </section>

          {/* Permissions */}
          <section className="club-step-card">
            <header><span>{step()}</span><h2>Optional permissions</h2></header>
            <p className="club-form-help">
              Separate from the waiver and health consent, and not needed to book. Change them any time in your account.
            </p>
            <PermissionFields value={perms} onChange={setPerms} />
          </section>

          {/* Waiver */}
          <section className="club-step-card">
            <header><span>{step()}</span><h2>Waiver</h2></header>
            <WaiverBox checked={waiver} onChange={setWaiver} />
          </section>

          {/* Summary */}
          <section className="club-step-card">
            <header><span>{step()}</span><h2>Check and pay</h2></header>
            <dl className="club-summary">
              <div><dt>Session</dt><dd>{date}, {CLUB.time}</dd></div>
              <div><dt>Venue</dt><dd>{CLUB.venue}</dd></div>
              <div>
                <dt>Coming</dt>
                <dd>
                  {profile.name || "You"}
                  {attending.length ? ` and ${attending.map((k) => k.name || "child").join(", ")}` : ""}
                </dd>
              </div>
              <div><dt>Price</dt><dd>{formatPrice(cls.pricePence)} (children free)</dd></div>
            </dl>
            <div className="club-policy">
              <h4>Cancellation policy</h4>
              <ul>{CANCELLATION_POLICY.map((l) => <li key={l}>{l}</li>)}</ul>
            </div>
            {willBePending && <p className="club-health-status is-warn">{REVIEW_PENDING_NOTICE} Payment is not approval to exercise.</p>}
            {health.status === "deferred" && !needFull && (
              <p className="club-health-status is-warn">
                Exercise is currently deferred. Please speak to {CLUB.coachName} ({CLUB.healthContact}) before booking.
              </p>
            )}
          </section>
        </>
      )}

      <label className="club-book-honeypot" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>

      {error && <p className="club-book-error" role="alert">{error}</p>}
      <button
        type="button"
        className={`btn btn-gold club-book-submit${props.bookingOpen ? "" : " is-disabled"}`}
        disabled={busy || !props.bookingOpen}
        onClick={submit}
      >
        {busy ? "Please wait…" : mode === "book" ? `Pay ${formatPrice(cls.pricePence)} and book` : "Join the waiting list"}
      </button>
      {mode === "book" && (
        <p className="club-book-small">
          You&rsquo;ll pay securely with Stripe. We hold your place for {CLUB.holdMinutes - 2} minutes while you pay, then
          email your confirmation and a copy of the waiver.
        </p>
      )}
    </div>
  );
}
