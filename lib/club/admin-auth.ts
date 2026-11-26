import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionEmail, isHealthReviewer } from "./admin-session";
import { db } from "./server";

/** The signed-in coach, and whether they may see health answers. */
export async function currentCoach(): Promise<{ email: string | null; reviewer: boolean }> {
  const email = await adminSessionEmail((await cookies()).get(ADMIN_COOKIE)?.value);
  return { email, reviewer: isHealthReviewer(email) };
}

/** Record who looked at or changed health information. */
export async function logAccess(actor: string, action: string, customerId: string | null, screeningId: string | null = null) {
  const { error } = await db()
    .from("club_access_log")
    .insert({ actor_email: actor, action, customer_id: customerId, screening_id: screeningId });
  if (error) console.error("[280 Club] access log failed", error.message);
}
