import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a call with Alex or Courtney at Auric Performance. Enquiries go to info@auricperformance.co.uk.",
};

const CALENDAR_SRC =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0D8TjUshdOlf37pe0yArqLhw83NRT_33nP4UEJT-FwW49WnlhU4MveJqJAB87CPmLlrHEweRU8?gv=true";

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
            Book a call with Alex or Courtney. Tell us what you are preparing
            for, recovering from, or trying to improve. We will help you choose
            1:1 coaching, Outrun, Outlift or Outperform.
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
                alt="Courtney"
                width={400}
                height={280}
              />
              <div>
                <strong>Courtney</strong>
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
    </main>
  );
}
