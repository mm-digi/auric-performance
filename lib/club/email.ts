import "server-only";
import {
  CANCELLATION_POLICY,
  CLUB,
  HEALTH_CONSENT,
  HEALTH_CONSENT_VERSION,
  REVIEW_PENDING_NOTICE,
  WAIVER_TITLE,
  WAIVER_VERSION,
  waiverText,
} from "./config";
import { formatClassDate, formatDateTime, formatPrice } from "./format";
import { mailer, siteUrl } from "./server";

type Person = { name: string; email: string };
type ClassInfo = { starts_at: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0e0d0c;font-family:Arial,Helvetica,sans-serif;color:#e8e4db">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0d0c"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1e1d1a;border-top:3px solid #c9a84c">
<tr><td style="padding:32px 32px 8px"><div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c">${esc(CLUB.name)}</div>
<h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;color:#ffffff;text-transform:uppercase;letter-spacing:1px">${esc(title)}</h1></td></tr>
<tr><td style="padding:16px 32px 32px;font-size:15px;line-height:1.65;color:#e8e4db">${body}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #2e2d29;font-size:12px;color:#8f8a80">Auric Performance · Questions? Reply to this email or write to <a href="mailto:${CLUB.replyTo}" style="color:#c9a84c">${CLUB.replyTo}</a></td></tr>
</table></td></tr></table></body></html>`;
}

function detailsTable(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid #2e2d29">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:12px 12px 12px 0;border-bottom:1px solid #2e2d29;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;vertical-align:top;width:130px">${esc(k)}</td><td style="padding:12px 0;border-bottom:1px solid #2e2d29;color:#e8e4db">${v}</td></tr>`,
    )
    .join("")}</table>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;background:#c9a84c;color:#0e0d0c;padding:14px 22px;text-decoration:none;font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:12px">${esc(label)}</a></p>`;

async function send(to: string, subject: string, html: string, text: string) {
  const resend = mailer();
  if (!resend) {
    console.warn(`[280 Club] RESEND_API_KEY not set; would have emailed ${to}: ${subject}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || `${CLUB.name} <bookings@auricperformance.co.uk>`,
    to,
    replyTo: CLUB.replyTo,
    subject,
    html,
    text,
  });
  if (error) console.error("[280 Club] email failed", to, subject, error);
}

async function notifyCoach(subject: string, text: string) {
  const to = process.env.CLUB_NOTIFY_EMAIL;
  if (!to) return;
  await send(to, subject, layout(subject, `<p>${esc(text).replace(/\n/g, "<br>")}</p>`), text);
}

export type ConfirmationExtras = {
  childrenAttending: { name: string; age: string }[];
  reviewed: boolean; // screening reviewed as suitable and nothing new waiting for review
  deferred: boolean;
  healthConsentGiven: boolean;
};

export async function sendBookingConfirmation(
  booking: Person & { children: number; manage_token: string; amount_pence: number | null },
  cls: ClassInfo,
  extras: ConfirmationExtras | null,
) {
  const date = formatClassDate(cls.starts_at);
  const manageUrl = `${siteUrl()}/280-club/booking/${booking.manage_token}`;
  const accountUrl = `${siteUrl()}/280-club/account`;
  const kidsList = extras?.childrenAttending ?? [];
  const kids = kidsList.length
    ? `You and ${kidsList.map((c) => `${c.name} (${c.age})`).join(", ")}`
    : booking.children === 0
      ? "Just you"
      : `You and ${booking.children} ${booking.children === 1 ? "child" : "children"}`;
  const screeningLine = extras?.deferred
    ? `Exercise is currently deferred following your screening review. Please speak to ${CLUB.coachName} before you train.`
    : extras?.reviewed
      ? "Your health screening has been reviewed."
      : REVIEW_PENDING_NOTICE;
  const waiver = waiverText();
  const heading = (p: string) => p === p.toUpperCase();

  const html = layout(
    "You're booked in",
    `<p>Hi ${esc(firstName(booking.name))},</p>
<p>Your place at the Auric 280 Club is confirmed.</p>
<p style="padding:14px 16px;border:1px solid ${extras?.reviewed ? "#2e2d29" : "#c9a84c"};color:#ffffff"><strong>Health screening:</strong> ${esc(screeningLine)}</p>
${detailsTable([
  ["Date", esc(date)],
  ["Time", `${CLUB.time} (arrive a few minutes early)`],
  ["Location", `${esc(CLUB.venue)}<br><a href="${CLUB.venueUrl}" style="color:#c9a84c">Directions to COACH</a> · <a href="${CLUB.mapsUrl}" style="color:#c9a84c">Open in Maps</a>`],
  ["Parking", esc(CLUB.parking)],
  ["Who's coming", esc(kids)],
  ["Children", esc(CLUB.children)],
  ["Coffee after", esc(CLUB.coffee)],
  ["Paid", booking.amount_pence ? formatPrice(booking.amount_pence) : formatPrice(CLUB.pricePence)],
])}
<p><strong style="color:#ffffff">Cancellation policy</strong></p>
<ul style="padding-left:18px;margin:8px 0 0">${CANCELLATION_POLICY.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
${button(manageUrl, "View or cancel booking")}
<p style="font-size:13px">Update your details, children or health answers any time in <a href="${accountUrl}" style="color:#c9a84c">your 280 Club account</a>.</p>
<h2 style="margin:32px 0 8px;font-size:16px;color:#ffffff;text-transform:uppercase;letter-spacing:1px">${esc(WAIVER_TITLE)} (version ${esc(WAIVER_VERSION)})</h2>
<p style="font-size:13px;color:#b8b3a9">You accepted this when you booked. Keep this email as your copy.</p>
${waiver
  .map((p) =>
    heading(p)
      ? `<p style="font-size:12px;letter-spacing:1px;color:#c9a84c;margin-top:18px">${esc(p)}</p>`
      : `<p style="font-size:13px;color:#b8b3a9">${esc(p)}</p>`,
  )
  .join("")}
${
  extras?.healthConsentGiven
    ? `<p style="font-size:12px;letter-spacing:1px;color:#c9a84c;margin-top:18px">HEALTH INFORMATION CONSENT (VERSION ${esc(HEALTH_CONSENT_VERSION)})</p><p style="font-size:13px;color:#b8b3a9">${esc(HEALTH_CONSENT)} You can withdraw this consent in your account or by emailing ${esc(CLUB.healthContact)}.</p>`
    : ""
}`,
  );

  const text = [
    `Hi ${firstName(booking.name)},`,
    "",
    "Your place at the Auric 280 Club is confirmed.",
    "",
    `Health screening: ${screeningLine}`,
    "",
    `Date: ${date}`,
    `Time: ${CLUB.time}`,
    `Location: ${CLUB.venue}`,
    `Directions: ${CLUB.venueUrl}`,
    `Parking: ${CLUB.parking}`,
    `Who's coming: ${kids}`,
    `Coffee after: ${CLUB.coffee}`,
    "",
    "Cancellation policy:",
    ...CANCELLATION_POLICY.map((l) => `- ${l}`),
    "",
    `View or cancel your booking: ${manageUrl}`,
    `Your account: ${accountUrl}`,
    "",
    `${WAIVER_TITLE.toUpperCase()} (VERSION ${WAIVER_VERSION})`,
    ...waiver,
    ...(extras?.healthConsentGiven
      ? ["", `HEALTH INFORMATION CONSENT (VERSION ${HEALTH_CONSENT_VERSION})`, HEALTH_CONSENT]
      : []),
  ].join("\n");

  await send(booking.email, `You're booked in: 280 Club, ${date}`, html, text);
  await notifyCoach(
    `New 280 Club booking: ${date}`,
    `${booking.name} (${booking.email}) booked ${date}. Children attending: ${booking.children}.`,
  );
}

export async function sendSignInCode(email: string, code: string, coach = false) {
  const title = coach ? "Coach sign-in code" : "Your sign-in code";
  const intro = coach
    ? "Use this code to finish signing in to the 280 Club coach area."
    : "Use this code to sign in to your Auric 280 Club account.";
  const html = layout(
    title,
    `<p>${esc(intro)}</p><p style="margin:24px 0;font-size:34px;letter-spacing:10px;color:#ffffff;font-weight:bold">${code}</p><p>It expires in 10 minutes. If you didn't ask for this, you can ignore this email.</p>`,
  );
  await send(
    email,
    `${code} is your 280 Club sign-in code`,
    html,
    `${intro}\n\n${code}\n\nIt expires in 10 minutes. If you didn't ask for this, you can ignore this email.`,
  );
}

/** Tells the coach a screening needs review. Never includes health answers. */
export async function sendReviewNeeded(customer: { name: string | null; email: string; id: string }, reason: string) {
  const to = process.env.CLUB_HEALTH_ALERT_EMAIL || CLUB.healthContact;
  const url = `${siteUrl()}/admin/screening/${customer.id}`;
  const who = customer.name || customer.email;
  const html = layout(
    "Screening review needed",
    `<p>${esc(who)} ${esc(reason)}.</p><p>Please review it before they next exercise. Answers are only shown in the secure coach area.</p>${button(url, "Open review")}`,
  );
  await send(to, `280 Club: screening review needed (${who})`, html, `${who} ${reason}.\n\nReview it before they next exercise: ${url}`);
}

export async function sendConsentWithdrawn(customer: { name: string | null; email: string; id: string }) {
  const to = process.env.CLUB_HEALTH_ALERT_EMAIL || CLUB.healthContact;
  const url = `${siteUrl()}/admin/screening/${customer.id}`;
  const who = customer.name || customer.email;
  const html = layout(
    "Health consent withdrawn",
    `<p>${esc(who)} has withdrawn consent to Auric Performance using their health information.</p><p>Stop consent-based use of their health answers and follow up on screening before their next session.</p>${button(url, "Open record")}`,
  );
  await send(to, `280 Club: health consent withdrawn (${who})`, html, `${who} has withdrawn health-data consent.\n\nRecord: ${url}`);
}

export async function sendCancellation(
  booking: Person,
  cls: ClassInfo,
  outcome: "refund" | "no_refund" | "refund_failed",
) {
  const date = formatClassDate(cls.starts_at);
  const refundLine =
    outcome === "refund"
      ? "You cancelled before the Friday 07:30 deadline, so we've refunded your £10 in full. It can take 5–10 working days to reach your account."
      : outcome === "refund_failed"
        ? "You're due a full refund. We'll process it by hand and confirm by email shortly."
        : "As this was after the Friday 07:30 deadline, the booking isn't refundable under our cancellation policy.";
  const html = layout(
    "Booking cancelled",
    `<p>Hi ${esc(firstName(booking.name))},</p><p>Your 280 Club booking for <strong>${esc(date)}</strong> has been cancelled.</p><p>${esc(refundLine)}</p>${button(`${siteUrl()}/280-club#book`, "Book another Saturday")}`,
  );
  await send(
    booking.email,
    `Cancelled: 280 Club, ${date}`,
    html,
    `Hi ${firstName(booking.name)},\n\nYour 280 Club booking for ${date} has been cancelled.\n\n${refundLine}\n\nBook another Saturday: ${siteUrl()}/280-club#book`,
  );
  await notifyCoach(`280 Club cancellation: ${date}`, `${booking.name} (${booking.email}) cancelled ${date}. Outcome: ${outcome}.`);
}

export async function sendClassCancelled(booking: Person, cls: ClassInfo, reason: string | null, refunded: boolean) {
  const date = formatClassDate(cls.starts_at);
  const refundLine = refunded
    ? "We've refunded your £10 in full. It can take 5–10 working days to reach your account."
    : "You're due a full refund. We'll process it by hand and confirm by email shortly.";
  const html = layout(
    "Class cancelled",
    `<p>Hi ${esc(firstName(booking.name))},</p><p>Sorry, we've had to cancel the 280 Club on <strong>${esc(date)}</strong>.</p>${reason ? `<p>${esc(reason)}</p>` : ""}<p>${esc(refundLine)}</p>${button(`${siteUrl()}/280-club#book`, "Book another Saturday")}`,
  );
  await send(
    booking.email,
    `Class cancelled: 280 Club, ${date}`,
    html,
    `Hi ${firstName(booking.name)},\n\nSorry, we've had to cancel the 280 Club on ${date}.\n${reason ? `\n${reason}\n` : ""}\n${refundLine}\n\nBook another Saturday: ${siteUrl()}/280-club#book`,
  );
}

export async function sendLatePaymentRefunded(booking: Person, cls: ClassInfo) {
  const date = formatClassDate(cls.starts_at);
  const line =
    "Your payment came through after your place hold had run out, and the class filled up in the meantime. We've refunded your £10 in full. Sorry about that.";
  await send(
    booking.email,
    `Sorry, the 280 Club on ${date} is full`,
    layout("Sorry, that class filled up", `<p>Hi ${esc(firstName(booking.name))},</p><p>${esc(line)}</p>${button(`${siteUrl()}/280-club#book`, "Choose another Saturday")}`),
    `Hi ${firstName(booking.name)},\n\n${line}\n\nChoose another Saturday: ${siteUrl()}/280-club#book`,
  );
  await notifyCoach(`280 Club late payment refunded: ${date}`, `${booking.name} (${booking.email}) paid after their hold expired and the class was full. Refunded automatically.`);
}

export async function sendWaitlistJoined(person: Person, cls: ClassInfo) {
  const date = formatClassDate(cls.starts_at);
  const html = layout(
    "You're on the waiting list",
    `<p>Hi ${esc(firstName(person.name))},</p><p>The 280 Club on <strong>${esc(date)}</strong> is full, so you're on the waiting list. If a place opens up we'll email you straight away with a link to book it.</p><p>You won't be charged unless you book.</p>`,
  );
  await send(
    person.email,
    `Waiting list: 280 Club, ${date}`,
    html,
    `Hi ${firstName(person.name)},\n\nThe 280 Club on ${date} is full, so you're on the waiting list. If a place opens up we'll email you with a link to book it. You won't be charged unless you book.`,
  );
}

export async function sendSpaceOffered(
  person: Person & { class_id: string; offer_token: string; offer_expires_at: string },
  cls: ClassInfo,
) {
  const date = formatClassDate(cls.starts_at);
  const until = formatDateTime(person.offer_expires_at);
  const url = `${siteUrl()}/280-club/book/${person.class_id}?offer=${person.offer_token}`;
  const html = layout(
    "A place has opened up",
    `<p>Hi ${esc(firstName(person.name))},</p><p>Good news: a place has opened up at the 280 Club on <strong>${esc(date)}</strong>.</p><p>We're holding it for you until <strong>${esc(until)}</strong>. After that it goes to the next person on the waiting list.</p>${button(url, "Book my place")}`,
  );
  await send(
    person.email,
    `A place has opened up: 280 Club, ${date}`,
    html,
    `Hi ${firstName(person.name)},\n\nA place has opened up at the 280 Club on ${date}. We're holding it for you until ${until}.\n\nBook it here: ${url}`,
  );
}
