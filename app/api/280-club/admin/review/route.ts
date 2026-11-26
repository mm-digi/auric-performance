import { NextResponse } from "next/server";
import { currentCoach, logAccess } from "@/lib/club/admin-auth";
import { REVIEW_STATUSES } from "@/lib/club/config";
import { db } from "@/lib/club/server";
import { isUuid } from "@/lib/club/validate";

/** Record a coach's screening review. Reviews are append-only. */
export async function POST(req: Request) {
  const coach = await currentCoach();
  if (!coach.email) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!coach.reviewer) return NextResponse.json({ error: "Only authorised reviewers can record reviews." }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const status = String(body.status ?? "");
  if (!isUuid(body.customerId) || !isUuid(body.screeningId)) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  if (!(status in REVIEW_STATUSES)) return NextResponse.json({ error: "Choose an outcome." }, { status: 400 });
  const followUp = String(body.followUpDate ?? "");
  if (followUp && !/^\d{4}-\d{2}-\d{2}$/.test(followUp)) return NextResponse.json({ error: "Bad follow-up date." }, { status: 400 });
  const t = (v: unknown) => String(v ?? "").trim().slice(0, 3000) || null;

  const { data: screening } = await db()
    .from("club_screenings")
    .select("id, customer_id, kind, questionnaire_version")
    .eq("id", body.screeningId)
    .maybeSingle();
  if (!screening || screening.customer_id !== body.customerId || screening.kind !== "full") {
    return NextResponse.json({ error: "That questionnaire could not be found." }, { status: 404 });
  }

  const { error } = await db().from("club_screening_reviews").insert({
    screening_id: screening.id,
    customer_id: screening.customer_id,
    status,
    reviewer_email: coach.email,
    questionnaire_version: screening.questionnaire_version,
    discussion: t(body.discussion),
    adjustments: t(body.adjustments),
    clinical_evidence: t(body.clinicalEvidence),
    follow_up_date: followUp || null,
  });
  if (error) {
    console.error("[280 Club] review", error.message);
    return NextResponse.json({ error: "Could not save the review." }, { status: 500 });
  }
  await logAccess(coach.email, `review_${status}`, screening.customer_id, screening.id);
  return NextResponse.json({ ok: true });
}
