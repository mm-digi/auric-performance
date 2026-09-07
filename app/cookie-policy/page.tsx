import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Cookie Policy", description: "How the Auric Performance website uses cookies and external services." };
const sections: LegalSection[] = [
  { title: "1. About cookies", body: <p>Cookies are small pieces of information stored on or read from your device. They may support security, remember choices, provide requested features or help a website understand how it is used.</p> },
  { title: "2. What this website uses", body: <><p>This site may use strictly necessary technology required for hosting, security and normal operation. Links to FITR, Google Calendar and social platforms take you to third-party services that may use cookies under their own policies.</p><p>We do not currently use advertising cookies on this website.</p></> },
  { title: "3. Managing cookies", body: <p>You can view, block or delete cookies through your browser settings. Blocking essential technology may affect website operation. Choices made on third-party services must be managed with those providers.</p> },
  { title: "4. Changes and contact", body: <p>We may update this policy when the website or its providers change. Questions about cookies can be sent to info@auricperformance.co.uk.</p> },
];
export default function CookiePage() { return <LegalPage kicker="Cookies & online choices" title="Cookie policy" intro="How this website and linked services may use cookies." sections={sections} />; }
