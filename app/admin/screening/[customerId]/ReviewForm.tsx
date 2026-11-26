"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewForm({
  customerId,
  screeningId,
  statuses,
}: {
  customerId: string;
  screeningId: string;
  statuses: Record<string, string>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ status: "", discussion: "", adjustments: "", clinicalEvidence: "", followUpDate: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ error: "", saved: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.status) return setMsg({ error: "Choose an outcome.", saved: "" });
    setBusy(true);
    setMsg({ error: "", saved: "" });
    const res = await fetch("/api/280-club/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, screeningId, ...form }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ error: data.error || "Could not save the review.", saved: "" });
    setForm({ status: "", discussion: "", adjustments: "", clinicalEvidence: "", followUpDate: "" });
    setMsg({ error: "", saved: "Review recorded." });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="club-review-form">
      <div className="club-book-fields">
        <label>
          <span>Outcome</span>
          <select value={form.status} onChange={set("status")} required>
            <option value="">Choose…</option>
            {Object.entries(statuses).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Follow-up date (optional)</span>
          <input type="date" value={form.followUpDate} onChange={set("followUpDate")} />
        </label>
      </div>
      <label className="club-textarea">
        <span>Relevant discussion</span>
        <textarea rows={3} value={form.discussion} onChange={set("discussion")} />
      </label>
      <label className="club-textarea">
        <span>Adjustments</span>
        <textarea rows={2} value={form.adjustments} onChange={set("adjustments")} />
      </label>
      <label className="club-textarea">
        <span>Clinical confirmation received (who, what, date), if any</span>
        <textarea rows={2} value={form.clinicalEvidence} onChange={set("clinicalEvidence")} />
      </label>
      {msg.error && <p className="club-book-error" role="alert">{msg.error}</p>}
      {msg.saved && <p className="club-saved" role="status">{msg.saved}</p>}
      <button type="submit" className="btn btn-gold" disabled={busy}>
        {busy ? "Saving…" : "Record review"}
      </button>
    </form>
  );
}
