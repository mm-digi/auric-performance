"use client";

// Form pieces shared by the booking page and the customer's account page.

import {
  CLUB,
  HEALTH_CONSENT,
  HEALTH_INTRO,
  HEALTH_USE,
  PERMISSIONS,
  SCREENING_ANSWER_HELP,
  SCREENING_DECLARATION,
  SCREENING_DETAILS_HELP,
  SCREENING_QUESTIONS,
  WAIVER,
  WAIVER_ACK,
  WAIVER_TITLE,
  WAIVER_VERSION,
  type PermissionKey,
  type ScreeningAnswer,
} from "@/lib/club/config";

export type ProfileState = {
  name: string;
  phone: string;
  adult: boolean;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  careNotes: string;
};

export type ChildState = { key: string; id: string | null; name: string; age: string; relationship: string; attending: boolean };

export type ScreeningState = {
  answers: Record<string, ScreeningAnswer | "">;
  details: string;
  contactPrivately: boolean;
  accurate: boolean;
};

export const emptyScreening = (prev?: { answers?: Record<string, ScreeningAnswer> | null; details?: string | null; contactPrivately?: boolean }): ScreeningState => ({
  answers: Object.fromEntries(SCREENING_QUESTIONS.map((q) => [q.id, prev?.answers?.[q.id] ?? ""])),
  details: prev?.details ?? "",
  contactPrivately: prev?.contactPrivately ?? false,
  accurate: false,
});

let keySeq = 0;
export const newChildKey = () => `new-${++keySeq}-${Date.now()}`;

// ---------------------------------------------------------------------------

export function ProfileFields({ value, onChange }: { value: ProfileState; onChange: (v: ProfileState) => void }) {
  const set = (k: keyof ProfileState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  return (
    <>
      <div className="club-book-fields">
        <label>
          <span>Full name</span>
          <input required autoComplete="name" value={value.name} onChange={set("name")} />
        </label>
        <label>
          <span>Mobile number</span>
          <input required type="tel" autoComplete="tel" value={value.phone} onChange={set("phone")} />
        </label>
      </div>
      <label className="club-ack">
        <input type="checkbox" checked={value.adult} onChange={set("adult")} />
        <span>I am 18 or over.</span>
      </label>
      <h4 className="club-form-sub">Emergency contact</h4>
      <p className="club-form-help">
        Choose someone reachable during the session and tell them you have given us their details.
      </p>
      <div className="club-book-fields club-book-fields-3">
        <label>
          <span>Name</span>
          <input required value={value.emergencyName} onChange={set("emergencyName")} />
        </label>
        <label>
          <span>Relationship to you</span>
          <input required value={value.emergencyRelationship} onChange={set("emergencyRelationship")} />
        </label>
        <label>
          <span>Phone number</span>
          <input required type="tel" value={value.emergencyPhone} onChange={set("emergencyPhone")} />
        </label>
      </div>
      <label className="club-textarea">
        <span>Who may safely collect or care for your children if you can’t? (optional, private)</span>
        <textarea
          rows={3}
          value={value.careNotes}
          onChange={set("careNotes")}
          placeholder="Names, and any restrictions. Please don’t include medical information here."
        />
      </label>
    </>
  );
}

export function ProfileSummary({ value }: { value: ProfileState }) {
  return (
    <dl className="club-summary">
      <div><dt>Name</dt><dd>{value.name}</dd></div>
      <div><dt>Mobile</dt><dd>{value.phone}</dd></div>
      <div>
        <dt>Emergency contact</dt>
        <dd>
          {value.emergencyName} ({value.emergencyRelationship}) · {value.emergencyPhone}
        </dd>
      </div>
      {value.careNotes && (
        <div><dt>Collection / care</dt><dd>{value.careNotes}</dd></div>
      )}
    </dl>
  );
}

// ---------------------------------------------------------------------------

export function ChildrenEditor({
  value,
  onChange,
  selectAttending,
}: {
  value: ChildState[];
  onChange: (v: ChildState[]) => void;
  selectAttending: boolean;
}) {
  const update = (key: string, patch: Partial<ChildState>) =>
    onChange(value.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  const remove = (key: string) => onChange(value.filter((c) => c.key !== key));
  const add = () =>
    onChange([...value, { key: newChildKey(), id: null, name: "", age: "", relationship: "", attending: selectAttending }]);

  return (
    <div className="club-children">
      {value.length === 0 && <p className="club-form-help">No children saved yet.</p>}
      {value.map((c, i) => (
        <fieldset key={c.key} className={`club-child${selectAttending && !c.attending ? " is-off" : ""}`}>
          <legend className="visually-hidden">Child {i + 1}</legend>
          {selectAttending && (
            <label className="club-child-attending">
              <input type="checkbox" checked={c.attending} onChange={(e) => update(c.key, { attending: e.target.checked })} />
              <span>Coming this week</span>
            </label>
          )}
          <div className="club-book-fields club-book-fields-3">
            <label>
              <span>Child’s name</span>
              <input value={c.name} onChange={(e) => update(c.key, { name: e.target.value })} />
            </label>
            <label>
              <span>Age</span>
              <input value={c.age} placeholder="e.g. 4, or 9 months" onChange={(e) => update(c.key, { age: e.target.value })} />
            </label>
            <label>
              <span>Your relationship</span>
              <input value={c.relationship} placeholder="e.g. Son, daughter" onChange={(e) => update(c.key, { relationship: e.target.value })} />
            </label>
          </div>
          <button type="button" className="club-link-btn" onClick={() => remove(c.key)}>
            Remove {c.name || "this child"} from my saved children
          </button>
        </fieldset>
      ))}
      <button type="button" className="btn" onClick={add}>
        + Add a child
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function HealthConsent({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="club-consent">
      <h4 className="club-form-sub">Use of your health information</h4>
      <p className="club-form-help">
        {HEALTH_USE} Read our{" "}
        <a href={CLUB.privacyUrl} target="_blank" rel="noopener noreferrer">
          privacy notice
        </a>
        .
      </p>
      <label className="club-ack">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{HEALTH_CONSENT}</span>
      </label>
    </div>
  );
}

export function ScreeningForm({ value, onChange }: { value: ScreeningState; onChange: (v: ScreeningState) => void }) {
  const answer = (id: string, a: ScreeningAnswer) => onChange({ ...value, answers: { ...value.answers, [id]: a } });
  const anyFlag = Object.values(value.answers).some((a) => a === "yes" || a === "unsure");
  return (
    <div className="club-screening">
      <p className="club-form-help">{HEALTH_INTRO}</p>
      <p className="club-form-help">{SCREENING_ANSWER_HELP}</p>
      <ol className="club-questions">
        {SCREENING_QUESTIONS.map((q) => (
          <li key={q.id}>
            <fieldset>
              <legend>{q.text}</legend>
              <div className="club-yn">
                {(["yes", "no", "unsure"] as const).map((a) => (
                  <label key={a} className={value.answers[q.id] === a ? "is-on" : ""}>
                    <input type="radio" name={`screen-${q.id}`} checked={value.answers[q.id] === a} onChange={() => answer(q.id, a)} />
                    <span>{a === "yes" ? "Yes" : a === "no" ? "No" : "Unsure"}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <label className="club-textarea">
        <span>Details {anyFlag ? "" : "(only if you answered Yes or Unsure)"}</span>
        <textarea rows={4} value={value.details} onChange={(e) => onChange({ ...value, details: e.target.value })} />
      </label>
      <p className="club-form-help">{SCREENING_DETAILS_HELP}</p>
      <label className="club-ack">
        <input type="checkbox" checked={value.contactPrivately} onChange={(e) => onChange({ ...value, contactPrivately: e.target.checked })} />
        <span>Please contact me privately.</span>
      </label>
      <label className="club-ack">
        <input type="checkbox" checked={value.accurate} onChange={(e) => onChange({ ...value, accurate: e.target.checked })} />
        <span>{SCREENING_DECLARATION}</span>
      </label>
    </div>
  );
}

export function screeningError(s: ScreeningState): string | null {
  if (SCREENING_QUESTIONS.some((q) => !s.answers[q.id])) return "Please answer every health question.";
  if (!s.accurate) return "Please confirm your health answers are accurate.";
  return null;
}

// ---------------------------------------------------------------------------

export function PermissionFields({
  value,
  onChange,
}: {
  value: Record<PermissionKey, boolean>;
  onChange: (v: Record<PermissionKey, boolean>) => void;
}) {
  return (
    <div className="club-permissions">
      {(Object.keys(PERMISSIONS) as PermissionKey[]).map((k) => (
        <label key={k} className="club-ack">
          <input type="checkbox" checked={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.checked })} />
          <span>
            <strong>{PERMISSIONS[k].label}.</strong> {PERMISSIONS[k].text}
          </span>
        </label>
      ))}
    </div>
  );
}

export function WaiverBox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="club-waiver">
      <h4>
        {WAIVER_TITLE} · version {WAIVER_VERSION}
      </h4>
      <div className="club-waiver-text" tabIndex={0} aria-label={WAIVER_TITLE}>
        {WAIVER.map((s, i) => (
          <div key={i}>
            {s.heading && <h5>{s.heading}</h5>}
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        ))}
      </div>
      <label className="club-ack">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{WAIVER_ACK}</span>
      </label>
    </div>
  );
}
