"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelBooking({
  token,
  refundable,
  deadline,
}: {
  token: string;
  refundable: boolean;
  deadline: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/280-club/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="club-cancel">
      <p>
        {refundable
          ? `Cancel before ${deadline} and you'll get a full refund.`
          : `The refund deadline (${deadline}) has passed, so cancelling now won't be refunded. Cancelling still frees your place for someone on the waiting list.`}
      </p>
      {!confirming ? (
        <button type="button" className="btn" onClick={() => setConfirming(true)}>
          Cancel my booking
        </button>
      ) : (
        <div className="club-cancel-confirm">
          <p>
            <strong>Are you sure?</strong> {refundable ? "Your £10 will be refunded." : "No refund will be given."}
          </p>
          <button type="button" className="btn btn-gold" onClick={cancel} disabled={busy}>
            {busy ? "Cancelling…" : "Yes, cancel it"}
          </button>{" "}
          <button type="button" className="btn" onClick={() => setConfirming(false)} disabled={busy}>
            Keep my place
          </button>
        </div>
      )}
      {error && <p className="club-book-error" role="alert">{error}</p>}
    </div>
  );
}
