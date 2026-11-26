"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChildrenEditor,
  HealthConsent,
  PermissionFields,
  ProfileFields,
  ProfileSummary,
  ScreeningForm,
  emptyScreening,
  newChildKey,
  screeningError,
  type ChildState,
  type ProfileState,
} from "@/components/club/forms";
import { CLUB, type PermissionKey } from "@/lib/club/config";
import { healthMessage, type HealthView } from "@/lib/club/customer-view";
import { formatClassDate } from "@/lib/club/format";

async function save(body: object) {
  const res = await fetch("/api/280-club/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function Status({ error, saved }: { error: string; saved: string }) {
  if (error) return <p className="club-book-error" role="alert">{error}</p>;
  if (saved) return <p className="club-saved" role="status">{saved}</p>;
  return null;
}

export default function AccountForms({
  profile,
  childList,
  permissions,
  health,
}: {
  profile: ProfileState;
  childList: { id: string; name: string; age: string; relationship: string }[];
  permissions: Record<PermissionKey, boolean>;
  health: HealthView;
}) {
  const router = useRouter();
  const complete = Boolean(profile.name && profile.phone && profile.emergencyName);

  // Details
  const [details, setDetails] = useState(profile);
  const [editingDetails, setEditingDetails] = useState(!complete);
  const [detailsMsg, setDetailsMsg] = useState({ error: "", saved: "" });

  // Children
  const [kids, setKids] = useState<ChildState[]>(childList.map((c) => ({ ...c, key: c.id, attending: false })));
  const [kidsMsg, setKidsMsg] = useState({ error: "", saved: "" });

  // Health
  const [editingHealth, setEditingHealth] = useState(false);
  const [consent, setConsent] = useState(false);
  const [screening, setScreening] = useState(() =>
    emptyScreening({ answers: health.lastAnswers, details: health.lastDetails, contactPrivately: health.lastContactPrivately }),
  );
  const [healthMsg, setHealthMsg] = useState({ error: "", saved: "" });

  // Permissions
  const [perms, setPerms] = useState(permissions);
  const [permsMsg, setPermsMsg] = useState({ error: "", saved: "" });

  const [busy, setBusy] = useState("");

  async function run(key: string, fn: () => Promise<void>, setMsg: (m: { error: string; saved: string }) => void, ok: string) {
    setBusy(key);
    setMsg({ error: "", saved: "" });
    try {
      await fn();
      setMsg({ error: "", saved: ok });
      router.refresh();
    } catch (e) {
      setMsg({ error: (e as Error).message, saved: "" });
    }
    setBusy("");
  }

  const msg = healthMessage(health);

  return (
    <>
      <div className="club-account-block">
        <h2>Your details</h2>
        {editingDetails ? (
          <>
            <ProfileFields value={details} onChange={setDetails} />
            <button
              type="button"
              className="btn btn-gold"
              disabled={busy === "details"}
              onClick={() =>
                run(
                  "details",
                  async () => {
                    await save({ action: "profile", profile: details });
                    setEditingDetails(false);
                  },
                  setDetailsMsg,
                  "Details saved.",
                )
              }
            >
              {busy === "details" ? "Saving…" : "Save details"}
            </button>
          </>
        ) : (
          <>
            <ProfileSummary value={details} />
            <button type="button" className="btn" onClick={() => setEditingDetails(true)}>
              Edit details
            </button>
          </>
        )}
        <Status {...detailsMsg} />
      </div>

      <div className="club-account-block">
        <h2>Your children</h2>
        <p className="club-form-help">
          Save the children who sometimes come with you. Each time you book, you choose which of them are coming.
        </p>
        <ChildrenEditor value={kids} onChange={setKids} selectAttending={false} />
        <button
          type="button"
          className="btn btn-gold"
          disabled={busy === "kids"}
          onClick={() =>
            run(
              "kids",
              async () => {
                const data = await save({ action: "children", children: kids });
                setKids(
                  (data.children as { id: string; name: string; age: string; relationship: string }[]).map((c) => ({
                    ...c,
                    key: c.id ?? newChildKey(),
                    attending: false,
                  })),
                );
              },
              setKidsMsg,
              "Children saved.",
            )
          }
        >
          {busy === "kids" ? "Saving…" : "Save children"}
        </button>
        <Status {...kidsMsg} />
      </div>

      <div className="club-account-block">
        <h2>Health screening</h2>
        <p className={`club-health-status is-${msg.tone}`}>{msg.text}</p>
        {health.lastSubmittedAt && (
          <p className="club-form-help">
            Last full questionnaire: {formatClassDate(health.lastSubmittedAt)}
            {health.reviewedAt ? ` · reviewed ${formatClassDate(health.reviewedAt)}` : ""}.
          </p>
        )}
        {editingHealth ? (
          <>
            {!health.consent && <HealthConsent checked={consent} onChange={setConsent} />}
            <ScreeningForm value={screening} onChange={setScreening} />
            <button
              type="button"
              className="btn btn-gold"
              disabled={busy === "health"}
              onClick={() => {
                const err = !health.consent && !consent ? "Please tick the health information consent box." : screeningError(screening);
                if (err) return setHealthMsg({ error: err, saved: "" });
                run(
                  "health",
                  async () => {
                    await save({ action: "screening", consent, screening });
                    setEditingHealth(false);
                  },
                  setHealthMsg,
                  `Saved. ${CLUB.coachName} will review your answers before you next exercise.`,
                );
              }}
            >
              {busy === "health" ? "Saving…" : "Submit health answers"}
            </button>{" "}
            <button type="button" className="btn" onClick={() => setEditingHealth(false)}>
              Cancel
            </button>
          </>
        ) : (
          <div className="club-account-actions">
            <button type="button" className="btn" onClick={() => setEditingHealth(true)}>
              {health.lastAnswers ? "Review or update my health answers" : "Complete health screening"}
            </button>
            {health.consent && (
              <button
                type="button"
                className="club-link-btn"
                disabled={busy === "withdraw"}
                onClick={() => {
                  if (
                    !window.confirm(
                      `Withdraw consent for Auric Performance to use your health information?\n\n${CLUB.coachName} will be told. You won’t be able to exercise at the club until screening is resolved. Records that must lawfully be kept are kept securely.`,
                    )
                  )
                    return;
                  run("withdraw", async () => void (await save({ action: "consent", kind: "health", granted: false })), setHealthMsg, "Consent withdrawn. We’ve let the coach know.");
                }}
              >
                Withdraw health-data consent
              </button>
            )}
          </div>
        )}
        <Status {...healthMsg} />
      </div>

      <div className="club-account-block">
        <h2>Optional permissions</h2>
        <p className="club-form-help">These are separate from the waiver and health consent. You can change them any time.</p>
        <PermissionFields value={perms} onChange={setPerms} />
        <button
          type="button"
          className="btn btn-gold"
          disabled={busy === "perms"}
          onClick={() =>
            run(
              "perms",
              async () => {
                for (const k of Object.keys(perms) as PermissionKey[]) {
                  if (perms[k] !== permissions[k]) await save({ action: "consent", kind: k, granted: perms[k] });
                }
              },
              setPermsMsg,
              "Permissions saved.",
            )
          }
        >
          {busy === "perms" ? "Saving…" : "Save permissions"}
        </button>
        <Status {...permsMsg} />
      </div>
    </>
  );
}
