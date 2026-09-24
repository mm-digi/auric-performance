import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book 1:1 personal training or online programming with Alex or Courtney. Auric Performance is based in Taunton and coaches clients across the southwest UK.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Auric Performance",
    description: "Book a call with Alex or Courtney.",
    url: "https://www.auricperformance.co.uk/contact",
  },
};

const CALENDAR_SRC =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0pM6E43Qa3peKpzvqjkOLtCT37f29SQiyAX_SFsS4PohF90753t65UirmCWdaDVM3T3TxmaWLo?gv=true";

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Contact</div>
          <h1 className="display">
            <span className="hero-line">Book a call with</span>
            <span className="hero-line">Alex or Courtney</span>
          </h1>
          <p className="lead">
            Book a call with Alex or Courtney. Tell us what you are training
            for, recovering from, or trying to improve. We will help you choose
            1:1 personal training or online programming.
          </p>
        </div>
      </section>

      <section className="wrap contact-grid">
        <aside className="contact-card">
          <div className="kicker">Book a call</div>
          <h2>Choose a time that works.</h2>
          <p>
            Pick a live appointment. Your booking is confirmed by email through
            the Auric Performance calendar, and goes to{" "}
            <a className="mailto" href="mailto:info@auricperformance.co.uk">
              info@auricperformance.co.uk
            </a>{" "}
            so either coach can pick it up.
          </p>

          <div className="contact-people">
            <div className="contact-person">
              <Image
                src="/images/alex.jpg"
                alt="Alex Peterson"
                width={400}
                height={280}
              />
              <div>
                <strong>Alex Peterson</strong>
                <span>Co-founder</span>
              </div>
            </div>
            <div className="contact-person">
              <Image
                src="/images/courtney.jpg"
                alt="Courtney Alexander"
                width={400}
                height={280}
              />
              <div>
                <strong>Courtney Alexander</strong>
                <span>Co-founder</span>
              </div>
            </div>
          </div>

          <ul>
            <li>Choose from live available appointment times</li>
            <li>Receive your confirmation by email</li>
            <li>Existing calendar commitments stay blocked out</li>
          </ul>

          <a className="btn btn-gold" href="mailto:info@auricperformance.co.uk">
            Prefer to write? Email info@
          </a>
        </aside>

        <div className="calendar-frame">
          <div className="calendar-chrome">
            <strong>Auric Performance</strong>
            <span>Book a call with Alex or Courtney · 60 minutes</span>
          </div>
          <iframe
            src={CALENDAR_SRC}
            title="Book a call with Alex or Courtney"
            loading="lazy"
          />
        </div>
      </section>

      <section className="wrap map-block">
        <div className="section-head">
          <div className="kicker">Southwest UK</div>
          <h2>Based in Taunton</h2>
          <p>
            {site.address.street}, {site.address.locality}, {site.address.region},{" "}
            {site.address.postalCode}. Auric Performance coaches 1:1 personal training
            and online programming for clients across the southwest, and is listed on
            Google Maps.
          </p>
          <div className="actions">
            <a href={site.mapsUrl} className="btn btn-gold" target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </div>
        </div>
        <div className="map-frame">
          <iframe
            src={site.mapsEmbed}
            title="Auric Performance on Google Maps, Hatch Beauchamp, Taunton"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
