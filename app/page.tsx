import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import LoopVideo from "@/components/LoopVideo";
import ProgramStrips from "@/components/ProgramStrips";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <HeroSlideshow />
        <div className="wrap">
          <div className="hero-copy">
          <div className="kicker">Auric Performance</div>
          <h1 className="display">
            <span className="hero-line">
              The <span>GOLD</span> standard in
            </span>
            <span className="hero-line">physical performance</span>
          </h1>
          <p className="lead">
            OUTRUN : OUTLIFT : OUTPERFORM The old version of you.
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
            Power · Strength · Endurance · Resilience
          </p>
          </div>
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
                <p>
                  Strength, conditioning and standards-based coaching. Built
                  around your goal, your role and your starting point.
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
                <p>
                  Hybrid performance, running and physical capability. Training
                  that is structured, repeatable and built to last.
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
