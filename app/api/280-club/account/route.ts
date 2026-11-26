import { NextResponse } from "next/server";
import { currentCustomer } from "@/lib/club/current-customer";
import {
  cleanChildren,
  cleanProfile,
  cleanScreening,
  clientIp,
  getHealth,
  getPermissions,
  saveChildren,
  saveProfile,
  setConsent,
  submitScreening,
} from "@/lib/club/customers";
import { sendConsentWithdrawn, sendReviewNeeded } from "@/lib/club/email";
import { PERMISSIONS, type PermissionKey } from "@/lib/club/config";

/**
 * Account updates for the signed-in customer.
 * body.action: "profile" | "children" | "screening" | "consent"
 */
export async function POST(req: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ip = clientIp(req);

  try {
    switch (body.action) {
      case "profile": {
        const p = cleanProfile((body.profile ?? {}) as Record<string, unknown>);
        if (typeof p === "string") return NextResponse.json({ error: p }, { status: 400 });
        await saveProfile(customer, p);
        return NextResponse.json({ ok: true });
      }

      case "children": {
        const list = cleanChildren(body.children);
        if (typeof list === "string") return NextResponse.json({ error: list }, { status: 400 });
        const saved = await saveChildren(customer.id, list);
        return NextResponse.json({ ok: true, children: saved });
      }

      case "screening": {
        const health = await getHealth(customer.id);
        if (!health.consent && body.consent !== true) {
          return NextResponse.json(
            { error: "Please tick the health information consent box to save your answers." },
            { status: 400 },
          );
        }
        const s = cleanScreening((body.screening ?? {}) as Record<string, unknown>);
        if (typeof s === "string") return NextResponse.json({ error: s }, { status: 400 });
        if (!health.consent) await setConsent(customer.id, "health", true, "account", ip);
        await submitScreening({
          customerId: customer.id,
          input: s,
          changeAnswer: health.latestFull ? "yes" : null,
          baseScreeningId: health.latestFull?.id ?? null,
          source: "account",
          ip,
        });
        await sendReviewNeeded(customer, health.latestFull ? "updated their health answers" : "submitted health screening");
        return NextResponse.json({ ok: true });
      }

      case "consent": {
        const kind = body.kind as string;
        if (kind !== "health" && !(kind in PERMISSIONS)) {
          return NextResponse.json({ error: "Unknown permission." }, { status: 400 });
        }
        const granted = body.granted === true;
        if (kind === "health" && granted) {
          return NextResponse.json({ error: "Give health consent with your screening answers." }, { status: 400 });
        }
        const changed = await setConsent(customer.id, kind as "health" | PermissionKey, granted, "account", ip);
        if (changed && kind === "health") await sendConsentWithdrawn(customer);
        return NextResponse.json({ ok: true, permissions: await getPermissions(customer.id) });
      }

      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (err) {
    console.error("[280 Club] account", body.action, err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
