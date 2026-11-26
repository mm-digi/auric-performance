import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY_VERSION } from "@/lib/club/config";

export const metadata: Metadata = {
  title: "280 Club privacy notice",
  description: "How Auric Performance collects, uses and protects information when you book and take part in the Auric 280 Club.",
  alternates: { canonical: "/280-club/privacy" },
};

const EFFECTIVE = "26 November 2026";

export default function ClubPrivacyNotice() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Auric 280 Club · data protection</div>
          <h1 className="display">
            280 Club <span>privacy notice</span>
          </h1>
          <p className="lead">
            How we collect, use and protect your information when you book and take part in the Auric 280 Club, including
            health screening.
          </p>
        </div>
      </section>

      <article className="wrap privacy-policy legal-policy">
        <p className="price-note">
          Version {PRIVACY_VERSION} · Effective {EFFECTIVE}
        </p>
        <div>
          <h2>1. Who we are</h2>
          <p>
            The Auric 280 Club is run by <strong>Alexander Peterson and Courtney Alexander, trading in partnership as
            Auric Performance</strong> (&ldquo;Auric&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are the data
            controller for the information described in this notice.
          </p>
          <ul>
            <li>Address: 25 Station Road, Hatch Beauchamp, Taunton, TA3 6SQ</li>
            <li>General and privacy questions: <a href="mailto:info@auricperformance.co.uk">info@auricperformance.co.uk</a></li>
            <li>
              Health information, consent withdrawal and private health questions:{" "}
              <a href="mailto:alex@auricperformance.co.uk">alex@auricperformance.co.uk</a>
            </li>
            <li>
              ICO registration: we have applied to register with the Information Commissioner&rsquo;s Office and will add
              our registration number here once it is issued.
            </li>
          </ul>
          <p>
            This notice covers booking and taking part in the Auric 280 Club. Our{" "}
            <Link href="/privacy-policy">main privacy policy</Link> covers the rest of our website and coaching services.
          </p>

          <h2>2. What information we collect</h2>
          <p><strong>Your account</strong></p>
          <ul>
            <li>Your email address, which you use to sign in. We email you a one-time code instead of using a password.</li>
          </ul>
          <p><strong>Registration details</strong> (collected once, then you review and update them)</p>
          <ul>
            <li>Your full name and mobile number.</li>
            <li>Confirmation that you are 18 or over.</li>
            <li>An emergency contact&rsquo;s name, relationship to you and phone number. Please tell them you have given us their details.</li>
            <li>Optionally, who may safely collect or care for your children if you can&rsquo;t, and any restrictions.</li>
          </ul>
          <p><strong>Children who come with you</strong></p>
          <ul>
            <li>Each child&rsquo;s name, age and relationship to you.</li>
            <li>Which children come to each session.</li>
            <li>We do <strong>not</strong> collect children&rsquo;s health information through the website.</li>
          </ul>
          <p><strong>Health screening</strong> (special category information)</p>
          <ul>
            <li>Your Yes / No / Unsure answers to our pre-exercise questions, any details you choose to add, and whether you&rsquo;d like to be contacted privately.</li>
            <li>At later bookings, your answer to whether anything has changed.</li>
            <li>Our review records: outcome, relevant discussion, adjustments, any clinical confirmation and follow-up dates.</li>
          </ul>
          <p><strong>Bookings, payments and agreements</strong></p>
          <ul>
            <li>The sessions you book or cancel, waiting-list entries, refunds and how they were handled.</li>
            <li>The waiver version you accepted, the health-consent version and the privacy-notice version, with the date and time of each tick box and the IP address used.</li>
            <li>Payments are handled by Stripe. We see that you paid and the amount. We <strong>never</strong> see or store your full card details.</li>
          </ul>
          <p><strong>Optional permissions</strong></p>
          <ul>
            <li>
              Whether you allow photos and videos of you during sessions, whether you allow photos and videos that
              include the children you bring, and whether you want marketing emails. Each is a separate choice. They are
              separate from the waiver and your health consent, are never needed to book, and can be changed at any time.
            </li>
            <li>We never publish children&rsquo;s names with photos or videos. You can ask us to remove a photo at any time.</li>
          </ul>
          <p><strong>Technical and security information</strong></p>
          <ul>
            <li>Records of sign-in codes being sent and used, and a log of who on our team viewed or reviewed health information, and when.</li>
            <li>
              The website&rsquo;s general cookies and analytics are covered by our <Link href="/cookie-policy">cookie policy</Link>.
              Health answers are never sent to analytics, advertising or marketing tools.
            </li>
          </ul>

          <h2>3. Why we use it, and our lawful basis</h2>
          <table>
            <thead>
              <tr><th>What we do</th><th>Information used</th><th>Lawful basis (UK GDPR)</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Run your account and bookings, take payment, send confirmations, manage cancellations, refunds and the waiting list</td>
                <td>Account, registration, booking and payment details</td>
                <td><strong>Contract</strong> (Art. 6(1)(b))</td>
              </tr>
              <tr>
                <td>Keep everyone safe during sessions: who is attending, which children are with them, and who to call in an emergency</td>
                <td>Registration details, emergency contact, children&rsquo;s details, attendance</td>
                <td><strong>Legitimate interests</strong> (Art. 6(1)(f)): running a safe class and meeting our insurer&rsquo;s requirements. <strong>Vital interests</strong> (Art. 6(1)(d)) in an emergency</td>
              </tr>
              <tr>
                <td>Pre-exercise screening and review before you exercise, and keeping screening current</td>
                <td>Health answers and review records</td>
                <td><strong>Legitimate interests</strong> (Art. 6(1)(f)), with your <strong>explicit consent</strong> (Art. 9(2)(a)) as the special category condition</td>
              </tr>
              <tr>
                <td>Keeping records of what was agreed, reviewed and accepted, so we can respond to an incident, complaint or insurance claim</td>
                <td>Waiver, consent and screening records, review records, booking records</td>
                <td><strong>Legitimate interests</strong> (Art. 6(1)(f)). For health records kept after consent is withdrawn: <strong>legal claims</strong> (Art. 9(2)(f))</td>
              </tr>
              <tr>
                <td>Accounting and tax</td>
                <td>Payment and refund records</td>
                <td><strong>Legal obligation</strong> (Art. 6(1)(c))</td>
              </tr>
              <tr>
                <td>Photography (of you, and separately of your children) and marketing emails</td>
                <td>Your choices</td>
                <td><strong>Consent</strong> (Art. 6(1)(a)), given by you as the parent for your children</td>
              </tr>
              <tr>
                <td>Security: protecting accounts and limiting and logging access to health information</td>
                <td>Sign-in and access records</td>
                <td><strong>Legitimate interests</strong> (Art. 6(1)(f))</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Your health information and consent.</strong> We only collect your health answers once you have ticked
            a separate, unticked consent box. Your answers help us decide whether and how you can exercise safely. They are
            not a diagnosis or medical clearance, and paying for a session is not approval to exercise. No decisions about
            you are made automatically: a person reviews every first submission and every change.
          </p>
          <p>
            You can <strong>withdraw health consent</strong> at any time in your account or by emailing{" "}
            <a href="mailto:alex@auricperformance.co.uk">alex@auricperformance.co.uk</a>. When you do, Alex is told and we
            stop using your answers for new screening decisions. Because screening is needed before you exercise, you
            won&rsquo;t be able to exercise at the club until it&rsquo;s resolved. Withdrawing consent does not
            automatically delete records we must keep for the reasons in section 6. Those records are kept read-only and
            used only for those reasons.
          </p>

          <h2>4. Who can see your information</h2>
          <ul>
            <li>
              <strong>Alex and Courtney</strong> (the two partners in Auric) can see health answers and review records.
              Nobody else can, unless Auric specifically authorises them in writing.
            </li>
            <li>
              <strong>Coaches</strong> running a session see the class list: names, contact and emergency details, children
              attending, photo permissions, and whether each person&rsquo;s screening has been reviewed. They do not see
              health answers.
            </li>
            <li>
              <strong>MM Digital</strong>, our website developer, maintains the booking system on our instructions. They
              access personal information only where needed to support, fix or secure the system.
            </li>
            <li>
              <strong>Service providers that process information for us:</strong>
              <ul>
                <li>Supabase: database hosting, stored in Ireland (EU), which the UK recognises as providing adequate data protection.</li>
                <li>Vercel: website hosting.</li>
                <li>Resend: sending booking and sign-in emails.</li>
                <li>Stripe: payments. Stripe is also a controller for some payment information under its own privacy notice.</li>
                <li>GitHub: stores our nightly database backups, encrypted so that GitHub cannot read them.</li>
              </ul>
            </li>
            <li><strong>Emergency services and healthcare professionals</strong>, where necessary to protect someone&rsquo;s life or health.</li>
            <li><strong>Our insurer and professional advisers</strong>, where needed for an incident, claim or legal advice.</li>
            <li><strong>The authorities</strong>, where the law requires it.</li>
          </ul>
          <p>
            We never sell personal information. We never send health answers to payment providers, marketing systems or
            advertising tools. Email alerts to our team say only that a review is needed. The answers themselves are only
            shown in the secure coach area.
          </p>

          <h2>5. International transfers</h2>
          <p>
            Some of our providers (for example Vercel, Resend, Stripe and GitHub) may process information outside the UK,
            including in the United States. Where this happens, we rely on the safeguards each provider offers, such as the
            UK International Data Transfer Addendum, standard contractual clauses or the UK Extension to the EU–US Data
            Privacy Framework.
          </p>

          <h2>6. How long we keep it</h2>
          <table>
            <thead>
              <tr><th>Information</th><th>How long we keep it</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Account and registration details, booking records, waiver and consent records</td>
                <td>While your account is active, then <strong>6 years after your last session</strong> (our insurer requires professional-service records to be kept for at least 6 years)</td>
              </tr>
              <tr><td>Health screening submissions and review records</td><td><strong>6 years after your last session</strong></td></tr>
              <tr>
                <td>Children&rsquo;s details recorded with bookings</td>
                <td><strong>Until the child turns 24</strong> (6 years after they reach 18) where our insurer requires it; otherwise <strong>6 years after the last session they attended</strong></td>
              </tr>
              <tr><td>Payment and refund records</td><td><strong>6 years</strong> after the end of the financial year (tax law)</td></tr>
              <tr><td>Waiting-list entries</td><td><strong>12 months</strong> after the session date</td></tr>
              <tr><td>Sign-in code records</td><td><strong>30 days</strong></td></tr>
              <tr><td>Health-information access logs</td><td><strong>6 years</strong>, to match the records they relate to</td></tr>
              <tr><td>Marketing and photography permission records</td><td>Until you withdraw, then the record of your choice is kept for <strong>2 years</strong></td></tr>
            </tbody>
          </table>
          <p>
            When a period ends, we delete or anonymise the information unless we need to keep it for a specific claim or
            legal matter. We review these periods at least once a year.
          </p>

          <h2>7. How we protect it</h2>
          <ul>
            <li>Sign-in uses a one-time code sent to your verified email address. Booking links in emails never show your profile or health answers.</li>
            <li>Information is encrypted in transit (HTTPS). The database can only be reached by our website&rsquo;s server.</li>
            <li>Only authorised reviewers can see health answers. Coaches sign in with a password and an emailed code, and every view of health information is logged.</li>
            <li>Earlier versions of your details, answers and agreements are kept read-only instead of being overwritten.</li>
            <li>
              An encrypted copy of the booking database is made every night and kept for 30 days, then deleted
              automatically. It is encrypted before it is stored, so the storage provider (GitHub) cannot read it. Only our
              website developer, MM Digital, holds the key to open it, and only uses it to restore lost or damaged data.
            </li>
          </ul>

          <h2>8. Your rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>access</strong> your information and get a copy</li>
            <li><strong>correct</strong> it (you can update most details yourself in <Link href="/280-club/account">your account</Link>)</li>
            <li>ask us to <strong>delete</strong> it, or to <strong>restrict</strong> or <strong>object to</strong> how we use it</li>
            <li><strong>data portability</strong> in some cases</li>
            <li><strong>withdraw consent</strong> at any time, where we rely on consent</li>
          </ul>
          <p>
            Some rights have limits. For example, we may need to keep certain records for insurance or legal reasons. If
            so, we&rsquo;ll explain why. Contact <a href="mailto:info@auricperformance.co.uk">info@auricperformance.co.uk</a>, or{" "}
            <a href="mailto:alex@auricperformance.co.uk">alex@auricperformance.co.uk</a> about health information. We may
            need to confirm your identity first, and we will normally reply within one month.
          </p>
          <p>
            If you&rsquo;re unhappy with how we&rsquo;ve handled your information, please tell us. You can also complain to
            the Information Commissioner&rsquo;s Office (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>, 0303 123 1113).
          </p>

          <h2>9. Information about other people</h2>
          <p>
            If you give us details of your emergency contact or your children, please make sure you&rsquo;re entitled to
            share them and let your emergency contact know. Only the attending adult can accept the waiver and complete
            health screening for themselves. Someone paying for another adult cannot do this for them.
          </p>

          <h2>10. Changes to this notice</h2>
          <p>
            If we change this notice, we&rsquo;ll update the version and date at the top. Where a change affects what
            you&rsquo;ve agreed to, we&rsquo;ll ask you to review it the next time you book.
          </p>
        </div>
      </article>
    </main>
  );
}
