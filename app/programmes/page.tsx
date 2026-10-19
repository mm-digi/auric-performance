import type { Metadata } from "next";
import Link from "next/link";
import LoopVideo from "@/components/LoopVideo";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Current Auric programmes: 1:1 personal training, online programming, OUTRUN, OUTLIFT, OUTPERFORM, AURIC SUB60 and Auric Rehab. Physical performance coaching from Taunton for the southwest UK.",
  alternates: { canonical: "/programmes" },
  openGraph: {
    title: "Programmes | Auric Performance",
    description:
      "1:1 personal training and online programming from Taunton. OUTRUN, OUTLIFT, OUTPERFORM, AURIC SUB60 and Auric Rehab.",
    url: "https://www.auricperformance.co.uk/programmes",
  },
};

type Programme = {
  id: string;
  kicker: string;
  title: string;
  video: string;
  price?: string;
  url?: string;
  bookCall?: boolean;
  intro: string;
  points: string[];
};

const programmes: Programme[] = [
  {
    id: "coaching",
    kicker: "Personal performance coaching",
    title: "1:1 Coaching",
    video: "/videos/alex.mp4",
    bookCall: true,
    intro:
      "A fully personalised training and performance coaching service, designed around your goals, schedule, lifestyle and performance demands.",
    points: [
      "Fully personalised training programme",
      "Habit tracking, sleep optimisation and nutrition guidance",
      "Weekly check-ins and ongoing programme adjustments",
      "24/7 coach contact with a response within 24 hours",
    ],
  },
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
    url: "https://app.fitr.training/p/auricsub60",
    intro:
      "A time-efficient version of OUTPERFORM, with every session designed to be completed in 60 minutes or less. Buy it standalone, or get it included with OUTRUN : OUTLIFT : OUTPERFORM.",
    points: [
      "Build strength and maximise running performance",
      "Every session completed in 60 minutes or less",
      "Included with OUTRUN : OUTLIFT : OUTPERFORM",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "auric-rehab",
    kicker: "Standalone 1:1 package",
    title: "Auric Rehab",
    video: "/videos/bike.mp4",
    bookCall: true,
    intro:
      "A physiotherapy consultation followed by a bespoke, injury-specific training programme. Book a call to start.",
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
            Build a body capable of more. Choose fully personalised 1:1 coaching, rehabilitation
            or focused hybrid programming.
          </p>
        </div>
      </section>

      <section className="wrap program-list" id="plans">
        <aside className="notice-bar">
          <div>
            <div className="kicker">How the programmes work</div>
            <h3>Start at Day 1, Week 1</h3>
            <p>
              Every online programme is delivered in a 12-week block. Week 1 is your testing week, followed
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
              {programme.price ? <p className="price-note">{programme.price}</p> : null}
              <p>{programme.intro}</p>
              <ul>
                {programme.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {programme.bookCall ? (
                <Link href="/contact" className="btn btn-gold">
                  Book a call
                </Link>
              ) : programme.url ? (
                <a href={programme.url} className="btn btn-gold" target="_blank" rel="noreferrer">
                  Start programme
                </a>
              ) : (
                <span className="btn is-disabled" aria-disabled="true">
                  Coming soon
                </span>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
