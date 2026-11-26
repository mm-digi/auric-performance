import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLUB } from "@/lib/club/config";
import { requireCustomer } from "@/lib/club/current-customer";
import { getHealth, getPermissions, listChildren, profileComplete } from "@/lib/club/customers";
import { formatClassDate } from "@/lib/club/format";
import { toHealthView } from "@/lib/club/health-view";
import { bookingOpen, db } from "@/lib/club/server";
import { listClasses } from "@/lib/club/service";
import { isToken, isUuid } from "@/lib/club/validate";
import BookingWizard from "./BookingWizard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Book | 280 Club", robots: { index: false, follow: false } };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ offer?: string }>;
}) {
  const { classId } = await params;
  const { offer } = await searchParams;
  if (!isUuid(classId)) notFound();
  const here = `/280-club/book/${classId}${offer ? `?offer=${encodeURIComponent(offer)}` : ""}`;
  const customer = await requireCustomer(here);

  const cls = (await listClasses()).find((c) => c.id === classId);
  if (!cls) notFound();

  const [children, perms, health, existing, waiting] = await Promise.all([
    listChildren(customer.id),
    getPermissions(customer.id),
    getHealth(customer.id),
    db()
      .from("club_bookings")
      .select("manage_token")
      .eq("class_id", classId)
      .eq("status", "confirmed")
      .or(`customer_id.eq.${customer.id},email.eq."${customer.email.replace(/"/g, "")}"`)
      .maybeSingle(),
    db()
      .from("club_waitlist")
      .select("id")
      .eq("class_id", classId)
      .eq("email", customer.email.toLowerCase())
      .in("status", ["waiting", "offered"])
      .maybeSingle(),
  ]);

  // A waiting-list offer only counts for the person it was sent to.
  let offerInfo: { token: string; expiresAt: string } | null = null;
  let offerProblem = "";
  if (offer) {
    const { data } = isToken(offer)
      ? await db()
          .from("club_waitlist")
          .select("class_id, email, status, offer_expires_at")
          .eq("offer_token", offer)
          .maybeSingle()
      : { data: null };
    if (
      data &&
      data.class_id === classId &&
      data.status === "offered" &&
      new Date(data.offer_expires_at) > new Date() &&
      data.email.toLowerCase() === customer.email.toLowerCase()
    ) {
      offerInfo = { token: offer, expiresAt: data.offer_expires_at };
    } else if (data && data.email.toLowerCase() !== customer.email.toLowerCase()) {
      offerProblem = `That offer was sent to a different email address. Sign in with that email to use it.`;
    } else {
      offerProblem = "That waiting-list offer has expired or has already been used.";
    }
  }

  const date = formatClassDate(cls.startsAt);

  return (
    <main className="club">
      <section className="page-hero club-book-hero">
        <div className="wrap">
          <div className="kicker">{CLUB.name}</div>
          <h1 className="display">{date}</h1>
          <p className="lead">
            {CLUB.time} · {CLUB.venue}
          </p>
          <p className="club-book-who">
            Signed in as {customer.email} · <Link href="/280-club/account">My account</Link>
          </p>
        </div>
      </section>

      <section className="wrap club-book-page">
        {offerProblem && <p className="club-book-notice">{offerProblem}</p>}
        {cls.cancelled ? (
          <p className="club-book-notice">This class has been cancelled. <Link href="/280-club#book">Choose another Saturday</Link>.</p>
        ) : existing.data ? (
          <p className="club-book-notice">
            You&rsquo;re already booked onto this class.{" "}
            <Link href={`/280-club/booking/${existing.data.manage_token}`}>View your booking</Link>.
          </p>
        ) : (
          <BookingWizard
            cls={cls}
            mode={cls.spacesLeft > 0 || offerInfo ? "book" : "waitlist"}
            alreadyWaiting={Boolean(waiting.data)}
            offer={offerInfo}
            bookingOpen={bookingOpen()}
            profileComplete={profileComplete(customer)}
            profile={{
              name: customer.name ?? "",
              phone: customer.phone ?? "",
              adult: Boolean(customer.adult_confirmed_at),
              emergencyName: customer.emergency_name ?? "",
              emergencyRelationship: customer.emergency_relationship ?? "",
              emergencyPhone: customer.emergency_phone ?? "",
              careNotes: customer.care_notes ?? "",
            }}
            childList={children}
            permissions={{ photo: perms.photo, child_photo: perms.child_photo, marketing: perms.marketing }}
            health={toHealthView(health)}
          />
        )}
      </section>
    </main>
  );
}
