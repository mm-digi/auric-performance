import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Auric Performance collects, uses and protects personal information.",
};

const sections = [
  ["Who we are", "Auric Performance provides physical performance coaching, programming and exercise rehabilitation. The data controller is Auric Performance, 25 Station Road, Hatch Beauchamp, Taunton, TA3 6SQ. You can contact us at info@auricperformance.co.uk."],
  ["Information we collect", "We may collect your name, contact details, enquiry information, training goals, coaching records, communications, payment status and technical information about use of this website. Where relevant to safe coaching or rehabilitation, you may choose to provide health, injury and performance information."],
  ["How we use your information", "We use information to respond to enquiries, assess service suitability, deliver and review coaching, manage appointments and payments, provide training-platform access, maintain security, improve our services, comply with legal obligations and send marketing where permitted."],
  ["Our lawful bases", "Depending on the purpose, we may process information to take steps before entering a contract, perform a contract, meet a legal obligation, pursue a legitimate interest or act with your consent. Health information may be special-category data and will only be used where relevant and with an appropriate legal condition, normally explicit consent where required."],
  ["Health information", "Information about health, injury, disability or medical history is requested only where relevant to safety, suitability or programme delivery. You do not have to provide it, but withholding relevant information may mean we cannot safely provide a service. Coaching information is not a substitute for medical diagnosis or treatment."],
  ["Sharing information", "We do not sell personal information. We may share necessary information with providers supporting website hosting, communications, coaching delivery, payments, accounting, insurance or professional advice, and with public authorities where legally required. Providers acting for us are expected to protect information and use it only for the agreed purpose."],
  ["International transfers", "Some providers may process information outside the United Kingdom. Where personal information is transferred internationally, we take reasonable steps to ensure an appropriate safeguard or lawful transfer mechanism is in place."],
  ["How long we keep information", "We retain information only for as long as reasonably necessary for service delivery and legal, tax, accounting, insurance or dispute-resolution purposes. Client and contractual records may commonly be retained for up to six years after a service ends. Information no longer required is deleted or anonymised."],
  ["Security", "We use reasonable organisational and technical measures to protect personal information. No online service or storage system can be guaranteed completely secure, so you should also take appropriate care when sending information electronically."],
  ["Marketing", "We may send marketing where you have consented or where another lawful basis permits it. You can opt out at any time by using an unsubscribe option or contacting us. Essential service messages are not marketing and may still be sent while you use a service."],
  ["Cookies and third-party services", "This website may use essential technologies for hosting and security. External services such as FITR, Google Calendar, social-media platforms and payment providers operate under their own privacy and cookie notices. We are not responsible for the privacy practices of websites you visit through external links."],
  ["Your rights", "Depending on the circumstances, you may have rights to access, correct or erase your information, restrict or object to processing, request portability and withdraw consent. You may also complain to the UK Information Commissioner’s Office. Contact us to exercise a right; we may need to verify your identity."],
  ["Children", "Our services are not directed at children purchasing independently. Where a participant is under 18, a parent or legal guardian may need to provide consent, information and payment."],
  ["Changes and contact", "We may update this policy when our services, providers or legal obligations change. Questions, privacy requests or complaints can be sent to info@auricperformance.co.uk."],
];

export default function PrivacyPolicyPage() {
  return <main>
    <section className="page-hero"><div className="wrap"><div className="kicker">Legal & data protection</div><h1 className="display">Privacy <span>Policy</span></h1><p className="lead">How Auric Performance collects, uses, stores and protects personal information.</p></div></section>
    <article className="wrap privacy-policy">
      <p className="price-note">Effective 14 July 2026 · Last reviewed 14 July 2026</p>
      {sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      <aside className="contact-card"><div className="kicker">Privacy contact</div><h2>Questions about your data?</h2><a className="mailto" href="mailto:info@auricperformance.co.uk?subject=Privacy%20Enquiry">info@auricperformance.co.uk</a></aside>
    </article>
  </main>;
}
