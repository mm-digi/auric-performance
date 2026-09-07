import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";

const paths = [
  { kicker: "01 · Programmes", title: "Train with structure", copy: "OUTRUN, OUTLIFT, OUTPERFORM and SUB60. Progressive hybrid programming delivered through FITR.", href: "/programmes#programmes", action: "Compare programmes" },
  { kicker: "02 · Rehabilitation", title: "Return with confidence", copy: "A physiotherapy consultation and bespoke programme built around your injury and current capacity.", href: "/programmes#rehab", action: "Explore rehab" },
  { kicker: "03 · 1:1 coaching", title: "Built around you", copy: "Personal coaching shaped around your goals, lifestyle, schedule and performance demands.", href: "/programmes#coaching", action: "View coaching" },
];

export default function HomePage() {
  return <main>
    <section className="hero"><HeroSlideshow /><div className="wrap"><div className="hero-copy"><div className="kicker">Auric Performance</div><h1 className="display"><span className="hero-line">OUTRUN:OUTLIFT:</span><span className="hero-line">OUTPERFORM</span></h1><p className="hero-tagline">The old version of you.</p><p className="lead">Hybrid training, rehabilitation and personalised coaching programmed by Royal Marine PTIs.</p><div className="actions"><Link href="/programmes" className="btn btn-gold">Find your programme</Link><Link href="/contact" className="btn">Book a call</Link></div></div></div></section>

    <section className="section wrap"><div className="section-head"><div className="kicker">Choose your route</div><h2>One goal. One clear next step.</h2><p>Start with the level of support you need today.</p></div><div className="path-grid">{paths.map((path) => <article className="path-card" key={path.title}><div className="kicker">{path.kicker}</div><h3>{path.title}</h3><p>{path.copy}</p><Link href={path.href} className="text-link">{path.action} →</Link></article>)}</div></section>

    <section className="credibility section-muted"><div className="wrap credibility-grid"><div><div className="kicker">Built on experience</div><h2>Coaching that understands performance.</h2></div><div className="proof-list"><div><strong>Royal Marine PTIs</strong><span>Programmes built by experienced physical training instructors.</span></div><div><strong>18+ years</strong><span>Combined British military experience within the coaching team.</span></div><div><strong>12-week blocks</strong><span>Baseline testing, structured progression and a measurable re-test.</span></div><div><strong>Delivered through FITR</strong><span>Your training, sessions and progress in one place.</span></div></div></div></section>

    <section className="section coaches"><div className="wrap"><div className="split-head"><div><div className="kicker">Your coaches</div><h2 className="display home-section-title">Alex and Courtney</h2></div><p>Two coaches, one standard. Auric combines assessment-led training, clear progression and practical support across strength, running and rehabilitation.</p></div><div className="coach-grid compact"><figure className="coach-card"><Image src="/images/alex.jpg" alt="Alex Peterson, co-founder of Auric Performance" fill sizes="(max-width: 980px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center 18%" }} /><figcaption><span className="role">Co-founder · Coach</span><h3>Alex Peterson</h3></figcaption></figure><figure className="coach-card"><Image src="/images/courtney.jpg" alt="Courtney, co-founder of Auric Performance" fill sizes="(max-width: 980px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center 18%" }} /><figcaption><span className="role">Co-founder · Coach</span><h3>Courtney</h3></figcaption></figure></div></div></section>

    <section className="simple-cta"><div className="wrap"><div><div className="kicker">Start here</div><h2>Ready to outperform?</h2><p>Compare the programmes or talk to us about the right route.</p></div><div className="actions"><Link href="/programmes" className="btn btn-gold">View programmes</Link><Link href="/contact" className="btn">Book a call</Link></div></div></section>
  </main>;
}
