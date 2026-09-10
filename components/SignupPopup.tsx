"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const DISMISSED_KEY = "auricSignupPopupDismissedAt";
const SUBSCRIBED_KEY = "auricSignupPopupSubscribed";
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000;

export default function SignupPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const submissionPendingRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
        if (localStorage.getItem(SUBSCRIBED_KEY) !== "true" && (!dismissedAt || Date.now() - dismissedAt > DISMISS_MS)) {
          lastFocusedRef.current = document.activeElement as HTMLElement;
          setOpen(true);
        }
      } catch { setOpen(true); }
    }, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("ap-signup-lock");
    emailRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], input:not([type="hidden"])');
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("ap-signup-lock"); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  const dismiss = () => {
    try { localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch {}
    setOpen(false);
    lastFocusedRef.current?.focus();
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!event.currentTarget.checkValidity()) return;
    submissionPendingRef.current = true;
  };
  const onMailchimpResponse = () => {
    if (!submissionPendingRef.current) return;
    submissionPendingRef.current = false;
    try { localStorage.setItem(SUBSCRIBED_KEY, "true"); } catch {}
    setSubmitted(true);
  };

  return <>
    <div className={`ap-signup-overlay${open ? " is-open" : ""}`} aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <section ref={dialogRef} className="ap-signup-dialog" role="dialog" aria-modal="true" aria-labelledby="ap-signup-title" aria-describedby="ap-signup-description" tabIndex={-1}>
        <div className="ap-signup-visual" aria-hidden="true"><div className="ap-signup-brand"><Image src="/images/logo-au3.png" alt="" width={64} height={64} /><div><strong>Auric Performance</strong><span>Physical Performance Coaching</span></div></div><div className="ap-signup-visual-copy"><i /><p>Practical insight. Stronger training. Measurable progress.</p></div></div>
        <button className="ap-signup-close" type="button" aria-label="Close signup form" onClick={dismiss}>×</button>
        <div className="ap-signup-content">{submitted ? <div className="ap-signup-message" role="status" aria-live="polite"><div className="ap-signup-kicker">Almost there</div><h3>Check your inbox.</h3><p>Please use the confirmation email from Mailchimp to complete your signup.</p></div> : <div>
          <div className="ap-signup-kicker">Join the Auric list</div><h2 id="ap-signup-title">Train smarter.<br />Perform&nbsp;better.</h2><p className="ap-signup-intro" id="ap-signup-description">Get practical training advice, performance insights and programme updates delivered directly to your inbox.</p>
          <form className="ap-signup-form" action="https://auricperformance.us7.list-manage.com/subscribe/post?u=14ada2c71074d43f5e6a042ea&id=aff29182e5&f_id=0040cae3f0" method="post" target="ap-mailchimp-submit" noValidate={false} onSubmit={onSubmit}>
            <div className="ap-signup-fields"><label><span>First name</span><input type="text" name="FNAME" autoComplete="given-name" placeholder="First name" /></label><label><span>Email address</span><input ref={emailRef} type="email" name="EMAIL" autoComplete="email" placeholder="Email address" required /></label></div>
            <div className="ap-signup-honeypot" aria-hidden="true"><input type="text" name="b_14ada2c71074d43f5e6a042ea_aff29182e5" tabIndex={-1} /></div>
            <label className="ap-signup-consent"><input type="checkbox" name="marketing_consent" value="yes" required /><span>I agree to receive training advice and occasional marketing emails from Auric Performance. I can unsubscribe at any time. See the <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>.</span></label>
            <button className="ap-signup-submit" type="submit">Join the Auric list</button><p className="ap-signup-note">No noise. Just useful coaching insight and relevant Auric updates.</p>
          </form>
        </div>}</div>
      </section>
    </div>
    <iframe name="ap-mailchimp-submit" title="Mailchimp form submission" hidden onLoad={onMailchimpResponse} />
  </>;
}
