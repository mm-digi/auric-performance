"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-checks the booking every few seconds while Stripe's webhook confirms payment. */
export default function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
