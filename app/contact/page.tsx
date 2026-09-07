import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: "Book a call or contact Auric Performance about programmes, rehabilitation and 1:1 coaching." };
const calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0D8TjUshdOlf37pe0yArqLhw83NRT_33nP4UEJT-FwW49WnlhU4MveJqJAB87CPmLlrHEweRU8?gv=true";
const enquiries = [
  ["Training programmes", "OUTRUN, OUTLIFT, OUTPERFORM, SUB60 or the Complete Package."],
  ["AURIC REHAB", "Online or location-dependent in-person rehabilitation support."],
  ["1:1 coaching", "The 12-week package or ongoing Auric Athlete coaching."],
];

export default function ContactPage() {
  return <main>
    <section className="page-hero"><div className="wrap"><div className="kicker">Contact</div><h1 className="display">Choose your <span>next step.</span></h1><p className="lead">Book a call if you need guidance, or email us about the route you already have in mind.</p></div></section>
    <section className="section wrap contact-simple">
      <div className="contact-primary"><div className="kicker">Talk to a coach</div><h2>Book a 60-minute call</h2><p>Tell Alex or Courtney what you are preparing for, recovering from or trying to improve. We will help you choose the right level of support.</p><a className="btn btn-gold" href={calendarUrl} target="_blank" rel="noreferrer">View available times</a><span className="privacy-note">Booking opens securely in Google Calendar.</span></div>
      <div className="enquiry-options"><div className="kicker">Know what you need?</div>{enquiries.map(([title, copy]) => <a key={title} href={`mailto:info@auricperformance.co.uk?subject=${encodeURIComponent(`${title} enquiry`)}`}><strong>{title}</strong><span>{copy}</span><b>Write to us →</b></a>)}</div>
    </section>
    <section className="simple-cta"><div className="wrap"><div><div className="kicker">Email</div><h2>info@auricperformance.co.uk</h2></div><a className="btn" href="mailto:info@auricperformance.co.uk">Send an email</a></div></section>
  </main>;
}
