// Client-safe shapes and wording for a customer's own view of their record.

import { CLUB, REVIEW_PENDING_NOTICE, type ScreeningAnswer } from "./config";
import type { HealthStatus } from "./customers";

export type HealthView = {
  status: HealthStatus;
  consent: boolean;
  requireFull: boolean; // must complete the whole questionnaire (first time, refresh due, consent withdrawn)
  lastAnswers: Record<string, ScreeningAnswer> | null;
  lastDetails: string | null;
  lastContactPrivately: boolean;
  lastSubmittedAt: string | null;
  reviewedAt: string | null;
};

export function healthMessage(h: HealthView): { tone: "ok" | "warn"; text: string } {
  switch (h.status) {
    case "suitable":
    case "suitable_with_adjustments":
      return { tone: "ok", text: `Your screening has been reviewed by ${CLUB.coachName}.` };
    case "deferred":
      return {
        tone: "warn",
        text: `${CLUB.coachName} has asked you not to exercise until you’ve spoken. He’ll be in touch, or email ${CLUB.healthContact}.`,
      };
    case "awaiting_discussion":
      return { tone: "warn", text: `${REVIEW_PENDING_NOTICE} ${CLUB.coachName} will be in touch to talk it through.` };
    case "awaiting_clinical_evidence":
      return {
        tone: "warn",
        text: `${REVIEW_PENDING_NOTICE} ${CLUB.coachName} is waiting for the clinical confirmation you discussed.`,
      };
    case "pending":
      return { tone: "warn", text: REVIEW_PENDING_NOTICE };
    case "refresh_due":
      return {
        tone: "warn",
        text: `It’s been ${CLUB.screeningRefreshMonths} months since your last full health questionnaire, so please complete it again.`,
      };
    case "consent_withdrawn":
      return {
        tone: "warn",
        text: "You’ve withdrawn consent for us to use your health information. To exercise, please complete screening again or email us to talk it through.",
      };
    default:
      return { tone: "warn", text: "You haven’t completed health screening yet. You’ll do it when you book." };
  }
}
