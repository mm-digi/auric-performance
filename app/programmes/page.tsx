import type { Metadata } from "next";
import Link from "next/link";
import LoopVideo from "@/components/LoopVideo";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Auric Performance hybrid training, rehabilitation and personalised coaching programmes, programmed by Royal Marine PTIs.",
};

type Programme = {
  id: string;
  kicker: string;
  title: string;
  video: string;
  price: string;
  url?: string;
  intro: string;
  points: string[];
};

const programmes: Programme[] = [
  {
    id: "outrun",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTRUN",
    video: "/videos/run.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outrun",
    intro:
      "A hybrid training programme designed to improve running performance while maintaining strength, muscle and athleticism.",
    points: [
      "Run faster, get stronger and become a more complete athlete",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "outlift",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTLIFT",
    video: "/videos/alex-bar.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outlift",
    intro:
      "A hybrid training programme designed to build strength while maintaining running performance, fitness and athleticism.",
    points: [
      "Get stronger without losing your engine",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "outperform",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTPERFORM",
    video: "/videos/box.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outperform",
    intro: "A hybrid training programme designed to build strength and maximise running performance.",
    points: [
      "Become stronger, faster and more capable across every aspect of your performance",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "complete-package",
    kicker: "Complete programme package · Unlimited changes",
    title: "OUTRUN : OUTLIFT : OUTPERFORM",
    video: "/videos/coaches.mp4",
    price: "£39.99 monthly · £95.99 for 3 months · £287.93 yearly",
    url: "https://app.fitr.training/pa/outrunoutliftoutperform",
    intro:
      "Access OUTRUN, OUTLIFT and OUTPERFORM with unlimited programme changes. AURIC SUB60 is included with this package.",
    points: [
      "OUTRUN, OUTLIFT and OUTPERFORM included",
      "AURIC SUB60 included",
      "Unlimited programme changes",
      "Save 40% with the yearly plan",
    ],
  },
  {
    id: "auric-sub60",
    kicker: "Time-efficient hybrid programme",
    title: "AURIC SUB60",
    video: "/videos/alex-row.mp4",
    price: "£19.99 per month",
    intro:
      "A time-efficient version of OUTPERFORM, with every session designed to be completed in 60 minutes or less. Buy it standalone, or get it included with OUTRUN : OUTLIFT : OUTPERFORM.",
    points: [
      "Build strength and maximise running performance",
      "Every session completed in 60 minutes or less",
      "Included with OUTRUN : OUTLIFT : OUTPERFORM",
      "Programmed by Royal Marine PTIs",
    ],
  },
];

const coachingOffers: Array<{
  id?: string;
  title: string;
  kicker: string;
  copy: string;
  featured?: boolean;
  points: string[];
}> = [
  {
    title: "12-Week 1:1 Coaching",
    kicker: "Personal performance coaching",
    copy: "A fully personalised training and performance coaching service, designed around your goals, schedule, lifestyle and performance demands.",
    points: [
      "Fully personalised training programme",
      "Habit tracking, sleep optimisation and nutrition guidance",
      "Weekly check-ins and ongoing programme adjustments",
      "24/7 coach contact with a response within 24 hours",
    ],
  },
  {
    title: "The Auric Athlete",
    kicker: "Personal performance coaching",
    copy: "The complete 1:1 coaching service, built around your goals, needs and constraints, with guidance across every area that drives performance.",
    featured: true,
    points: [
      "Fully personalised training",
      "Injury prevention and rehabilitation",
      "60-minute workout pathway",
      "Habit, sleep and nutrition guidance",
      "Weekly check-ins and 24/7 coach contact",
      "Ongoing programme adjustments",
      "One sponsored event every 12 months after a minimum of 3 months’ training",
      "Save 40% with the yearly plan",
    ],
  },
  {
    id: "auric-rehab",
    title: "Auric Rehab",
    kicker: "Standalone 1:1 package",
    copy: "A physiotherapy consultation followed by a bespoke, injury-specific training programme. Book a call to start.",
    points: [
      "Online or in-person physiotherapy consultation",
      "Bespoke injury-specific exercise programme",
      "Bi-weekly reviews during ongoing rehabilitation",
      "Book a call with Alex or Courtney to get started",
    ],
  },
];

export default function ProgrammesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Programmes</div>
          <h1 className="display">
            OUTRUN : OUTLIFT : <span>OUTPERFORM</span>
          </h1>
          <p className="lead">
            The old version of you. Choose focused hybrid programming, rehabilitation or fully
            personalised performance coaching.
          </p>
        </div>
      </section>

      <section className="wrap program-list" id="plans">
        <aside className="notice-bar">
          <div>
            <div className="kicker">How the programmes work</div>
            <h3>Start at Day 1, Week 1</h3>
            <p>
              Every programme is delivered in a 12-week block. Week 1 is your testing week, followed
              by 10 weeks of structured training. In Week 12, you’ll repeat the initial testing
              battery to measure your progress before moving into your next training block.
            </p>
          </div>
          <Link href="/contact" className="btn btn-gold">
            Start training
          </Link>
        </aside>

        <aside className="notice-bar notice-bar-blue">
          <div>
            <div className="kicker">Military &amp; blue light</div>
            <h3>20% discount</h3>
            <p>
              Serving military and blue-light personnel receive 20% off programmes and 1:1 coaching.
              Mention this when you book or check out.
            </p>
          </div>
          <Link href="/contact" className="btn">
            Book a call
          </Link>
        </aside>

        {programmes.map((programme) => (
          <article className="program-row" id={programme.id} key={programme.id}>
            <div className="program-visual">
              <LoopVideo src={programme.video} />
            </div>
            <div className="program-copy">
              <div className="kicker">{programme.kicker}</div>
              <h2>{programme.title}</h2>
              <p className="price-note">{programme.price}</p>
              <p>{programme.intro}</p>
              <ul>
                {programme.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {programme.url ? (
                <a href={programme.url} className="btn btn-gold" target="_blank" rel="noreferrer">
                  Start programme
                </a>
              ) : (
                <div className="actions">
                  <span className="btn is-disabled" aria-disabled="true">
                    Coming soon
                  </span>
                  {programme.id === "auric-sub60" && (
                    <a
                      href="https://app.fitr.training/pa/outrunoutliftoutperform"
                      className="btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get it with the complete package
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="wrap offer-section" id="coaching">
        <div className="section-head">
          <div className="kicker">1:1 coaching</div>
          <h2 className="plans-title">Built around you</h2>
          <p>
            Two personalised 1:1 coaching options, plus Auric Rehab as a standalone 1:1 package.
            Rehab is booked on a call.
          </p>
        </div>
        <div className="coaching-offer-grid">
          {coachingOffers.map((offer) => (
            <article
              className={`offer-card${offer.featured ? " is-featured" : ""}`}
              id={offer.id}
              key={offer.title}
            >
              <div className="kicker">{offer.kicker}</div>
              <h3>{offer.title}</h3>
              <p>{offer.copy}</p>
              <ul>
                {offer.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-gold">
                Book a call
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
