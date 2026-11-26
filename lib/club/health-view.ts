import "server-only";
import type { HealthState } from "./customers";
import type { HealthView } from "./customer-view";

export function toHealthView(h: HealthState): HealthView {
  return {
    status: h.status,
    consent: h.consent,
    requireFull: h.status === "missing" || h.status === "consent_withdrawn" || h.status === "refresh_due",
    lastAnswers: h.consent ? (h.latestFull?.answers ?? null) : null,
    lastDetails: h.consent ? (h.latestFull?.details ?? null) : null,
    lastContactPrivately: h.latestFull?.contact_privately ?? false,
    lastSubmittedAt: h.latestFull?.created_at ?? null,
    reviewedAt: h.review && h.review.status !== "submitted" ? h.review.created_at : null,
  };
}
