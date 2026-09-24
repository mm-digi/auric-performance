import type { Metadata } from "next";
import Link from "next/link";
import { programmes } from "@/lib/programmes";

export const metadata: Metadata = {
  title: "Online Programming in the Southwest",
  description:
    "Online programming from Auric Performance: OUTRUN, OUTLIFT, OUTPERFORM and AURIC SUB60. Physical performance coaching for clients in the southwest UK and online across the country.",
  alternates: { canonical: "/online-programming" },
  keywords: [
    "online programming",
    "online personal training",
    "hybrid training programme",
    "online coach southwest",
    "Taunton online programming",
  ],
  openGraph: {
    title: "Online Programming in the Southwest | Auric Performance",
    description:
      "12-week online programmes from a Taunton physical performance coach. OUTRUN, OUTLIFT, OUTPERFORM and AURIC SUB60.",
    url: "https://www.auricperformance.co.uk/online-programming",
  },
};

export default function OnlineProgrammingPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Online programming · Southwest UK</div>
          <h1 className="display">
            <span className="hero-line">Online</span>
            <span className="hero-line">
              <span>programming</span>
            </span>
          </h1>
          <p className="lead">
            Structured hybrid programmes from Auric Performance in Taunton. Train online
            with a plan written by Royal Marine physical training instructors, whether you
            are in Somerset or anywhere else in the UK.
          </p>
        </div>
      </section>

      <section className="wrap program-list">
        <aside className="notice-bar">
          <div>
            <div className="kicker">How online programming works</div>
            <h3>12-week blocks</h3>
            <p>
              Week 1 is testing, then 10 weeks of training. Week 12 repeats the tests so
              the next block starts from what you can actually do. Delivery is through the
              Auric training app.
            </p>
          </div>
          <Link href="/programmes" className="btn btn-gold">
            All programmes
          </Link>
        </aside>

        <div className="coaching-offer-grid">
          {programmes.map((programme) => (
            <article className="offer-card" id={programme.id} key={programme.id}>
              <div className="kicker">{programme.price}</div>
              <h3>{programme.title}</h3>
              <p>{programme.intro}</p>
              <a href={programme.url} className="btn btn-gold" target="_blank" rel="noreferrer">
                Start programme
              </a>
            </article>
          ))}
        </div>

        <aside className="notice-bar notice-bar-blue">
          <div>
            <div className="kicker">Want a coach in the programme</div>
            <h3>1:1 personal training</h3>
            <p>
              Online programming can stand alone. If you want weekly check-ins, adjustments
              and a physical performance coach across the southwest, book 1:1 coaching with
              Alex or Courtney.
            </p>
          </div>
          <Link href="/personal-training" className="btn">
            1:1 coaching
          </Link>
        </aside>
      </section>
    </main>
  );
}
