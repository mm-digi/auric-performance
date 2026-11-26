import Link from "next/link";

export default function NotAllowed() {
  return (
    <main className="club">
      <section className="page-hero">
        <div className="wrap">
          <h1 className="display">Not available</h1>
          <p className="lead">
            Health screening is only visible to authorised reviewers. Ask for your email to be added to
            CLUB_HEALTH_REVIEWERS if you need access.
          </p>
          <p><Link href="/admin" className="btn">Back to classes</Link></p>
        </div>
      </section>
    </main>
  );
}
