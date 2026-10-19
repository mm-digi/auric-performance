import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import LoopVideo from "@/components/LoopVideo";
import ProgramStrips from "@/components/ProgramStrips";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://www.auricperformance.co.uk",
    title: "Auric Performance | 1:1 Personal Trainer, Southwest UK",
    description:
      "1:1 personal trainer and physical performance coach in Taunton. Online programming for the southwest UK.",
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <HeroSlideshow />
        <div className="wrap">
          <div className="hero-copy">
          <div className="kicker">Auric Performance</div>
          <h1 className="display">
            <span className="hero-line">Build a body</span>
            <span className="hero-line">
              capable of <span>more</span>
            </span>
          </h1>
          <p className="lead">
            Gold-standard 1:1 coaching from Royal Marine PTIs. We will help
            you lose weight, build muscle and feel confident.
          </p>
          <div className="actions">
            <Link href="/contact" className="btn btn-gold">
              Book a call
            </Link>
            <Link href="/programmes" className="btn">
              View programmes
            </Link>
          </div>
          <p className="hero-note">
            Lose fat · Build muscle · Get stronger · Move better
          </p>
          </div>
        </div>
      </section>

      <section className="proof-banner">
        <div className="wrap proof-banner-inner">
          <div className="proof-item">
            <strong>1,600+</strong>
            <span>Clients coached</span>
          </div>
          <div className="proof-item">
            <strong>400+</strong>
            <span>Rehab clients returned to capability</span>
          </div>
          <a
            className="proof-item proof-reviews"
            href="https://g.page/r/CYlQ16bijYP8EBM/review"
            target="_blank"
            rel="noreferrer"
          >
            <strong>5 star</strong>
            <span>Google ratings / reviews →</span>
          </a>
        </div>
      </section>

      <ProgramStrips />

      <section className="section coaches">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="kicker">The coaches</div>
              <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 76px)", marginTop: 8 }}>
                Alex and Courtney
              </h2>
            </div>
            <p>
              Two coaches. One standard. Auric Performance is built around
              assessment-led training, clear progression and the physical
              qualities that matter when the work gets hard. Specialising in
              tactical and hybrid performance, with 18+ years of British
              military experience in the coaching team.
            </p>
          </div>

          <div className="coach-grid">
            <figure className="coach-card">
              <Image
                src="/images/alex.jpg"
                alt="Alex Peterson, co-founder of Auric Performance"
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center 18%" }}
              />
              <figcaption>
                <span className="role">Co-founder · Coach</span>
                <h3>Alex Peterson</h3>
                <p className="coach-label">Specialist in</p>
                <p className="coach-specialism">
                  Strength : Conditioning : Functional Fitness : Rehabilitation
                </p>
                <p className="coach-label">Qualifications / assurances</p>
                <p className="coach-quals">
                  Royal Marine Physical Training Instructor : DPHC Exercise
                  Rehabilitation Instructor : FdSc Sports Performance : British
                  Weightlifting Strength and Power : Optimising Human Performance
                  LVL&nbsp;5 : Sports Massage LVL&nbsp;4
                </p>
                <p className="coach-quote">
                  Bringing Royal Marine discipline to everyday training -
                  helping you lose fat, build strength and feel confident in
                  your own body.
                </p>
              </figcaption>
            </figure>

            <figure className="coach-card">
              <Image
                src="/images/courtney.jpg"
                alt="Courtney Alexander, co-founder of Auric Performance"
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center 18%" }}
              />
              <figcaption>
                <span className="role">Co-founder · Coach</span>
                <h3>Courtney Alexander</h3>
                <p className="coach-label">Specialist in</p>
                <p className="coach-specialism">
                  Strength : Conditioning : Hybrid Performance : Rehabilitation
                </p>
                <p className="coach-label">Qualifications / assurances</p>
                <p className="coach-quals">
                  Royal Marine Physical Training Instructor : DPHC Exercise
                  Rehabilitation Instructor : BSc Strength &amp; Conditioning :
                  British Weightlifting Strength and Power : Optimising Human
                  Performance LVL&nbsp;5
                </p>
                <p className="coach-quote">
                  Whether you are coming back from injury, building muscle or
                  losing weight: science-backed coaching to help you build a
                  body capable of more.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="band">
        <LoopVideo src="/videos/alex-row.mp4" />
        <div className="wrap band-copy">
          <div className="kicker">Start here</div>
          <h2>
            <span className="hero-line">Book a call with</span>
            <span className="hero-line">Alex or Courtney</span>
          </h2>
          <p className="lead">
            Tell us what you are preparing for, recovering from, or trying to
            improve. We will point you to the right programme.
          </p>
          <div className="actions" style={{ marginTop: 28 }}>
            <Link href="/contact" className="btn btn-gold">
              Book a call
            </Link>
            <a href="mailto:info@auricperformance.co.uk" className="btn">
              Email info@
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
