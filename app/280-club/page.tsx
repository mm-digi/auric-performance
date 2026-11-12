import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoopVideo from "@/components/LoopVideo";

export const metadata: Metadata = {
  title: "Auric 280 Club",
  description:
    "The fitness club built for dads. Saturdays at 07:30 in Taunton: 280 reps, kids welcome, coffee after. Coming soon from Auric Performance.",
  alternates: { canonical: "/280-club" },
  openGraph: {
    title: "Auric 280 Club | The fitness club built for dads",
    description:
      "Saturdays at 07:30 in Taunton. 280 reps, kids welcome, coffee after. Coming soon from Auric Performance.",
    url: "https://www.auricperformance.co.uk/280-club",
    images: ["/images/280-club-logo.png"],
  },
};

const facts = [
  { label: "Where", value: "Taunton" },
  { label: "When", value: "Saturdays 07:30" },
  { label: "The session", value: "280 reps" },
  { label: "Bring them", value: "Kids welcome" },
];

const steps = [
  {
    number: "01",
    title: "Turn up",
    text: "Saturday, 07:30, Taunton. Bring the kids if you like. They are part of it.",
  },
  {
    number: "02",
    title: "280 reps",
    text: "One session, 280 reps, coached by Auric. Everyone works at their own level and finishes together.",
  },
  {
    number: "03",
    title: "Coffee after",
    text: "Train together, then stay for a coffee with the other dads before the weekend gets going.",
  },
];

export default function Club280Page() {
  return (
    <main className="club">
      <section className="club-hero">
        <div className="wrap club-hero-inner">
          <div className="club-hero-video">
            <LoopVideo src="/videos/280-alex-son.mp4" />
          </div>
          <div className="club-intro">
          <div className="club-lockup" role="img" aria-label="Auric 280 Club">
            <Image
              src="/images/280-club-mark.png"
              alt=""
              width={1166}
              height={664}
              priority
              sizes="(max-width: 640px) 120px, 190px"
            />
            <div className="club-wordmark" aria-hidden="true">
              <span className="club-wordmark-auric">Auric</span>
              <span className="club-wordmark-num">280</span>
              <span className="club-wordmark-club">Club</span>
            </div>
          </div>
          <div className="kicker">Coming soon · By Auric Performance</div>
          <h1 className="display">
            The fitness club <span>built for dads</span>
          </h1>
          <p className="lead">
            Train together. Coffee after. A Saturday morning session in Taunton where the kids are
            welcome and nobody trains alone.
          </p>
          <div className="actions">
            <Link href="/contact" className="btn btn-gold">
              Register interest
            </Link>
          </div>
          </div>
        </div>
      </section>

      <section className="wrap club-facts" aria-label="Club details">
        {facts.map((fact) => (
          <div className="club-fact" key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </div>
        ))}
      </section>

      <section className="wrap club-why">
        <figure className="club-why-photo">
          <Image
            src="/images/280-club-pressup.jpg"
            alt="Alex doing a press-up in the garden with his baby son on his back, under the words: Train so your body can continue doing the things you love."
            width={507}
            height={785}
            unoptimized
          />
        </figure>
        <div className="club-why-copy">
          <div className="kicker">Why we started it</div>
          <h2>Strong for the years ahead</h2>
          <p>
            Being a dad is physical: carrying them, chasing them, getting down on the floor to play.
            The 280 Club is one hour on a Saturday to keep your body capable of all of it, with
            your kids right there and other dads alongside you.
          </p>
        </div>
      </section>

      <section className="wrap club-steps">
        <div className="kicker">How a Saturday works</div>
        <div className="club-step-grid">
          {steps.map((step) => (
            <article className="club-step" key={step.number}>
              <span className="club-step-number">{step.number}</span>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap club-cta">
        <aside className="notice-bar">
          <div>
            <div className="kicker">Launching soon</div>
            <h3>Be there for the first Saturday</h3>
            <p>
              Register your interest and we will tell you the start date and where to meet.
            </p>
          </div>
          <Link href="/contact" className="btn btn-gold">
            Register interest
          </Link>
        </aside>
      </section>
    </main>
  );
}
