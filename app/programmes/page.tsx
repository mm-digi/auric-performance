import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Programmes", description: "Compare Auric Performance hybrid programmes, rehabilitation and personalised coaching." };
const fitrUrl = "https://app.fitr.training/t/AuricPerformance/";
const programmes = [
  { name: "OUTRUN", goal: "Running performance", format: "12-week blocks", price: "£29.99/month", summary: "Run faster while maintaining strength, muscle and athleticism." },
  { name: "OUTLIFT", goal: "Strength", format: "12-week blocks", price: "£29.99/month", summary: "Build strength without losing running performance or fitness." },
  { name: "OUTPERFORM", goal: "Strength + running", format: "12-week blocks", price: "£29.99/month", summary: "Build strength and maximise running performance." },
  { name: "AURIC SUB60", goal: "Time-efficient hybrid", format: "≤60 min sessions", price: "£19.99/month", summary: "The OUTPERFORM approach in sessions lasting 60 minutes or less." },
  { name: "THE COMPLETE PACKAGE", goal: "Maximum flexibility", format: "Unlimited changes", price: "From £39.99/month", summary: "Access OUTRUN, OUTLIFT and OUTPERFORM with unlimited programme changes." },
];
const coaching = [
  { name: "AURIC REHAB", price: "£180 first month · £120/month ongoing", copy: "Physiotherapy consultation and a bespoke injury-specific programme, delivered online or in person depending on location.", details: ["Bespoke rehabilitation programme", "Bi-weekly reviews", "Online or location-dependent in-person support"] },
  { name: "12-WEEK 1:1 COACHING", price: "£550 upfront · £50/week", copy: "Personalised training and performance coaching built around your goals, schedule and lifestyle.", details: ["Training delivered through FITR", "Weekly check-ins", "Habit, sleep and nutrition guidance", "Coach contact with a response within 24 hours"] },
  { name: "THE AURIC ATHLETE", price: "£100/week · £400/month · £1,000/3 months · £2,880/year", copy: "The complete coaching service for athletes who want training, lifestyle guidance and ongoing adaptation in one place.", details: ["Personalised FITR programme", "Injury prevention and rehabilitation", "60-minute workout pathway", "Weekly check-ins and ongoing adjustments", "One sponsored event every 12 months after 3 months’ training", "Annual plan saves 40%"] },
];
const faqs = [
  ["Where do I start?", "Choose the programme that best matches your current priority. If you are unsure, book a call and we will point you in the right direction."],
  ["How do the 12-week blocks work?", "You begin at Day 1, Week 1. Week 1 establishes your testing markers, the next 10 weeks build your performance, and Week 12 repeats the testing battery before your next block."],
  ["Can I change programmes?", "Unlimited programme changes are included with the Complete Package. Individual subscriptions provide access to the programme selected."],
  ["What equipment do I need?", "Requirements vary by programme. Review the programme details on FITR before joining, or contact us if you need to check your equipment access."],
  ["Can I use a programme alongside my sport?", "The programmes are designed for hybrid performance, but your total training load still matters. Contact us if you compete or have a demanding sport schedule."],
  ["What happens after Week 12?", "After your re-test, you move into a new 12-week block and continue building on the progress you have made."],
  ["Is AURIC REHAB available near me?", "Rehab is available online. In-person availability depends on your location, so enquire before booking."],
  ["How is training delivered?", "Programming is delivered through FITR, where you can access your sessions and track your training."],
];

export default function ProgrammesPage() {
  return <main>
    <section className="page-hero"><div className="wrap"><div className="kicker">Choose your route</div><h1 className="display">OUTRUN:OUTLIFT:<span>OUTPERFORM</span></h1><p className="lead">Focused hybrid programming, rehabilitation and coaching. Nothing you do not need.</p></div></section>
    <nav className="programme-jump wrap" aria-label="Programme categories"><a href="#programmes">Training programmes</a><a href="#rehab">Rehabilitation</a><a href="#coaching">1:1 coaching</a></nav>
    <section className="section wrap" id="programmes"><div className="section-head"><div className="kicker">Self-directed programming</div><h2>Compare programmes</h2><p>All core programmes are built by Royal Marine PTIs and delivered through FITR.</p></div><div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>Programme</th><th>Primary goal</th><th>Format</th><th>Price</th><th></th></tr></thead><tbody>{programmes.map((item) => <tr key={item.name}><td><strong>{item.name}</strong><span>{item.summary}</span></td><td>{item.goal}</td><td>{item.format}</td><td>{item.price}</td><td><a href={fitrUrl} target="_blank" rel="noreferrer" className="text-link">View on FITR →</a></td></tr>)}</tbody></table></div><aside className="block-explainer"><div><div className="kicker">Every block begins with a baseline</div><h3>Test. Train. Re-test.</h3></div><p>Start at Day 1, Week 1. Your testing week is followed by 10 weeks of structured training. Week 12 repeats the original testing battery so you can measure progress before beginning the next block.</p></aside><div className="billing-note"><strong>Billing at a glance</strong><span>Complete Package: £39.99 monthly</span><span>£95.99 for 3 months paid upfront</span><span>£287.93 yearly — save 40%</span></div></section>
    <section className="section section-muted" id="rehab"><div className="wrap"><div className="section-head"><div className="kicker">Rehabilitation</div><h2>AURIC REHAB</h2><p>Return to training with a plan built around your injury, current capacity and next goal.</p></div><Offer offer={coaching[0]} /></div></section>
    <section className="section wrap" id="coaching"><div className="section-head"><div className="kicker">Personal coaching</div><h2>Built around you</h2><p>Your goals, schedule, lifestyle and performance demands shape the programme.</p></div><div className="coaching-offer-grid">{coaching.slice(1).map((offer) => <Offer offer={offer} key={offer.name} />)}</div></section>
    <section className="section section-muted"><div className="wrap"><div className="section-head"><div className="kicker">Questions</div><h2>Before you start</h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    <section className="simple-cta"><div className="wrap"><div><div className="kicker">Still unsure?</div><h2>Tell us what you are training for.</h2></div><Link href="/contact" className="btn btn-gold">Book a call</Link></div></section>
  </main>;
}

function Offer({ offer }: { offer: typeof coaching[number] }) {
  return <article className="offer-card is-featured"><div className="kicker">Personal support</div><h3>{offer.name}</h3><span className="offer-price">{offer.price}</span><p>{offer.copy}</p><ul>{offer.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><Link href={`/contact?subject=${encodeURIComponent(offer.name)}`} className="btn btn-gold">Enquire</Link></article>;
}
