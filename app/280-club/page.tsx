import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoopVideo from "@/components/LoopVideo";

export const metadata: Metadata = {
  title: "Auric 280 Club",
  description:
    "The fitness club built for dads. Saturdays at 07:30 in Taunton: 280 reps, kids welcome, coffee after. Starting Saturday 2 January 2027.",
  alternates: { canonical: "/280-club" },
  openGraph: {
    title: "Auric 280 Club | The fitness club built for dads",
    description:
      "Saturdays at 07:30 in Taunton. 280 reps, kids welcome, coffee after. Starting Saturday 2 January 2027.",
    url: "https://www.auricperformance.co.uk/280-club",
    images: ["/images/280-club-share.jpg"],
  },
};

const facts = [
  { label: "Where", value: "Taunton" },
  { label: "Starts", value: "Sat 2 Jan, 07:30" },
  { label: "The session", value: "280 reps" },
  { label: "Bring them", value: "Kids welcome" },
];

const steps = [
  {
    number: "01",
    title: "Turn up",
    text: "Saturdays, 07:30, Taunton, from 2 January. Bring the kids if you like. They are part of it.",
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
          <div className="club-lockup">
            <Image
              src="/images/280-club-lockup.png"
              alt="Auric 280 Club"
              width={1176}
              height={1283}
              priority
              sizes="(max-width: 640px) 170px, 240px"
            />
          </div>
          <div className="kicker">Starts Saturday 2 January · By Auric Performance</div>
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
          <video
            src="/videos/280-pressup.mp4"
            poster="/images/280-club-pressup-poster.jpg"
            width={640}
            height={990}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Alex doing press-ups in the garden with his baby son lying on his back."
          />
          <figcaption>Train so your body can continue doing the things you love.</figcaption>
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
            <div className="kicker">Starting 2 January</div>
            <h3>Be there for the first Saturday</h3>
            <p>
              Register your interest and we will let you know where to meet before the first session.
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
