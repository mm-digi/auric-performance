import type { Metadata } from "next";
import Link from "next/link";
import { faqs, serviceAreas, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "1:1 Personal Trainer in the Southwest",
  description:
    "1:1 personal trainer and physical performance coach in the southwest UK. Alex and Courtney coach from Taunton, Somerset, in person across the region and online.",
  alternates: { canonical: "/personal-training" },
  keywords: [
    "1:1 personal trainer",
    "personal trainer southwest",
    "personal trainer Taunton",
    "physical performance coach",
    "personal trainer Somerset",
  ],
  openGraph: {
    title: "1:1 Personal Trainer in the Southwest | Auric Performance",
    description:
      "Physical performance coaching and 1:1 personal training from Taunton for clients across the southwest UK.",
    url: "https://www.auricperformance.co.uk/personal-training",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function PersonalTrainingPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">1:1 coaching · Southwest UK</div>
          <h1 className="display">
            <span className="hero-line">1:1 personal</span>
            <span className="hero-line">
              <span>trainer</span>
            </span>
          </h1>
          <p className="lead">
            Physical performance coaching from Taunton. Alex Peterson and Courtney Alexander
            coach clients one to one across Somerset, Devon, Bristol and the wider southwest,
            and online across the UK.
          </p>
          <div className="actions" style={{ marginTop: 28, justifyContent: "center" }}>
            <Link href="/contact" className="btn btn-gold">
              Book a call
            </Link>
            <Link href="/online-programming" className="btn">
              Online programming
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">The current offer</div>
            <h2>Built around you</h2>
            <p>
              Auric Performance is a physical performance coaching practice. 1:1 personal
              training covers the programme, the habits around it, and a coach you can
              actually reach. This is the current service. Older tactical-athlete programmes
              are not what we deliver.
            </p>
          </div>
          <div className="coaching-offer-grid">
            <article className="offer-card">
              <div className="kicker">12 weeks</div>
              <h3>1:1 coaching</h3>
              <p>
                A personalised training programme around your goals, schedule and performance
                demands, with weekly check-ins and programme adjustments.
              </p>
              <ul>
                <li>Habit tracking, sleep and nutrition guidance</li>
                <li>Coach contact with a reply within 24 hours</li>
                <li>Booked directly with Alex or Courtney</li>
              </ul>
              <Link href="/programmes#coaching" className="btn">
                See 1:1 options
              </Link>
            </article>
            <article className="offer-card is-featured">
              <div className="kicker">Complete coaching</div>
              <h3>The Auric Athlete</h3>
              <p>
                The full 1:1 physical performance coaching service, including injury
                prevention, a 60-minute training pathway and ongoing adjustments.
              </p>
              <ul>
                <li>Training, rehab awareness and lifestyle guidance</li>
                <li>Weekly check-ins</li>
                <li>Yearly plan available</li>
              </ul>
              <Link href="/programmes#coaching" className="btn btn-gold">
                View the Auric Athlete
              </Link>
            </article>
            <article className="offer-card">
              <div className="kicker">In person or online</div>
              <h3>Auric Rehab</h3>
              <p>
                A physiotherapy consultation, online or in person, followed by an
                injury-specific programme and bi-weekly reviews.
              </p>
              <ul>
                <li>Based in Taunton, Somerset</li>
                <li>Book a call to start</li>
                <li>Return to training with a plan</li>
              </ul>
              <Link href="/programmes#auric-rehab" className="btn">
                Auric Rehab
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section coaches">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Where we coach</div>
            <h2>Southwest UK</h2>
            <p>
              The practice is based at {site.address.street}, {site.address.locality},{" "}
              {site.address.postalCode}. Clients train with us across the southwest, and
              online programming is available wherever you are in the UK. Find the practice
              on Google Maps when you search for a personal trainer or physical performance
              coach in the region.
            </p>
          </div>
          <ul className="local-places">
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <div className="actions" style={{ marginTop: 32 }}>
            <a href={site.mapsUrl} className="btn btn-gold" target="_blank" rel="noreferrer">
              Google Maps
            </a>
            <Link href="/contact" className="btn">
              Book a call
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">Questions</div>
            <h2>Before you book</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
