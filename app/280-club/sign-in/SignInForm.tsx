"use client";

import { useState } from "react";

export default function SignInForm({ next }: { next: string }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function post(url: string, body: object) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await post("/api/280-club/auth/request", { email });
      setStep("code");
      setInfo(`We’ve sent a code to ${email}. It can take a minute to arrive; check your junk folder too.`);
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await post("/api/280-club/auth/verify", { email, code });
      window.location.href = next;
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return step === "email" ? (
    <form onSubmit={sendCode} className="club-signin-form">
      {error && <p className="club-signin-error" role="alert">{error}</p>}
      <label htmlFor="club-customer-email">Email</label>
      <input
        id="club-customer-email"
        type="email"
        autoComplete="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn btn-gold" disabled={busy}>
        {busy ? "Sending…" : "Email me a code"}
      </button>
    </form>
  ) : (
    <form onSubmit={verify} className="club-signin-form">
      {info && <p className="club-signin-info">{info}</p>}
      {error && <p className="club-signin-error" role="alert">{error}</p>}
      <label htmlFor="club-customer-code">6-digit code</label>
      <input
        id="club-customer-code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]{6,7}"
        maxLength={7}
        required
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" className="btn btn-gold" disabled={busy}>
        {busy ? "Checking…" : "Sign in"}
      </button>
      <p className="club-signin-alt">
        <button type="button" onClick={() => sendCode()} disabled={busy}>
          Send a new code
        </button>
        {" · "}
        <button type="button" onClick={() => { setStep("email"); setCode(""); setError(""); setInfo(""); }}>
          Use a different email
        </button>
      </p>
    </form>
  );
}
