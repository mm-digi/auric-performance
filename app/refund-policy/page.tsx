import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Cancellation and Refund Policy", description: "Cancellation, renewal and refund information for Auric Performance services." };
const sections: LegalSection[] = [
  { title: "Subscriptions", body: <p>Unless a minimum term or different notice period is stated before purchase, cancellation stops future renewals at the end of the current paid billing period. Cancel through the relevant platform and notify us if assistance is needed.</p> },
  { title: "14-day cancellation rights", body: <p>UK consumers purchasing at a distance will usually have 14 days to cancel. If you ask for a service to begin during that period, a proportionate charge may apply. Immediate digital access may affect the right to cancel where you expressly consent and acknowledge this before supply.</p> },
  { title: "Appointments", body: <p>Please give at least 24 hours’ notice to cancel or rearrange a live appointment unless another period was agreed. A late cancellation or missed appointment may be treated as used. Exceptional circumstances will be considered reasonably.</p> },
  { title: "Refunds", body: <p>Where a refund is legally due, it will normally be returned to the original payment method within the period required by law. If we cancel a paid service and cannot provide a reasonable replacement, the affected element will be refunded or credited.</p> },
  { title: "How to cancel", body: <p>Email info@auricperformance.co.uk with your name, service, order date and a clear statement that you wish to cancel. Cancelling a bank payment instruction alone does not cancel the service or remove sums already properly due.</p> },
];
export default function RefundPage() { return <LegalPage kicker="Purchases & appointments" title="Cancellation & refunds" intro="Clear information about renewals, cancellations and refunds." sections={sections} />; }
