"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelClass({ classId, label, count }: { classId: string; label: string; count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function cancel() {
    const reason = window.prompt(
      `Cancel the class on ${label}? All ${count} booked dads will be refunded in full and emailed.\n\nOptional message to include in the email:`,
      "",
    );
    if (reason === null) return;
    setBusy(true);
    const res = await fetch("/api/280-club/admin/cancel-class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, reason }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return alert(data.error || "Could not cancel the class.");
    alert(
      `Class cancelled. ${data.cancelled} booking(s) refunded and emailed.` +
        (data.refundFailures ? ` ${data.refundFailures} refund(s) failed: please refund these in Stripe.` : ""),
    );
    router.refresh();
  }

  return (
    <button type="button" className="btn" onClick={cancel} disabled={busy}>
      {busy ? "Cancelling…" : "Cancel this class"}
    </button>
  );
}
