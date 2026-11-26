import type { Metadata } from "next";
import Image from "next/image";
import LoopVideo from "@/components/LoopVideo";
import ClubBooking from "@/components/ClubBooking";

export const metadata: Metadata = {
  title: "Auric 280 Club",
  description:
    "The fitness club built for dads. Saturdays 07:30–08:30 at COACH, French Weir Park, Taunton: 280 reps, £10 per adult, kids free, coffee after. Starting Saturday 2 January 2027.",
  alternates: { canonical: "/280-club" },
  openGraph: {
    title: "Auric 280 Club | The fitness club built for dads",
    description:
      "Saturdays 07:30–08:30 at French Weir Park, Taunton. 280 reps, £10 per adult, kids free, coffee after. Starting Saturday 2 January 2027.",
    url: "https://www.auricperformance.co.uk/280-club",
    images: ["/images/280-club-share.jpg"],
  },
};

const facts = [
  { label: "Where", value: "French Weir Park" },
  { label: "Starts", value: "Sat 2 Jan, 07:30" },
  { label: "Price", value: "£10 per adult" },
  { label: "Kids", value: "Free" },
];

const details = [
  {
    label: "First session",
    value: "Saturday 2 January 2027, then every Saturday after that",
  },
  { label: "Weekly class", value: "Saturdays 07:30–08:30" },
  {
    label: "Venue",
    value: "Park Room at COACH, French Weir Park, Taunton, TA1 1AW",
    href: "https://coach-taunton.org.uk/find-us/",
    linkText: "How to find COACH",
  },
  {
    label: "Price and capacity",
    value: "£10 per adult. Maximum 12 adults. Children attend free.",
  },
  {
    label: "Children",
    value: "Bring your children along. They come free and stay your responsibility throughout: Alex coaches the adults only and doesn’t coach or supervise children. There’s no fixed limit; just bring as many as you can safely look after.",
  },
  {
    label: "Coffee afterwards",
    value: "The Weir Café at COACH, downstairs from 09:00. Drinks purchased individually.",
  },
  { label: "Parking", value: "Wood Street Car Park, Enfield Car Park, Tangier Car Park" },
];

const steps = [
  {
    number: "01",
    title: "Turn up",
    text: "Saturdays, 07:30, Park Room at COACH, French Weir Park, from 2 January. Bring the kids along: they come free and stay with you. Alex coaches the dads; you look after your own children.",
  },
  {
    number: "02",
    title: "280 reps",
    text: "One session, 280 reps, coached by Auric. Everyone works at their own level and finishes together.",
  },
  {
    number: "03",
    title: "Coffee after",
    text: "Train together, then head downstairs to The Weir Café from 09:00 for a coffee with the other dads before the weekend gets going.",
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
            Train together. Coffee after. A Saturday morning session at French Weir Park, Taunton,
            where the kids are welcome and nobody trains&nbsp;alone.
          </p>
          <div className="actions">
            <a href="#book" className="btn btn-gold">
              Book your place
            </a>
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

      <section className="wrap club-details" aria-labelledby="club-details-heading">
        <div className="kicker">The details</div>
        <h2 id="club-details-heading">Everything you need to know</h2>
        <dl className="club-detail-list">
          {details.map((detail) => (
            <div className="club-detail" key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>
                {detail.value}
                {detail.href && (
                  <>
                    {" "}
                    <a href={detail.href} target="_blank" rel="noopener noreferrer">
                      {detail.linkText}
                    </a>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ClubBooking />
    </main>
  );
}
