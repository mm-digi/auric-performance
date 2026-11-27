const TZ = "Europe/London";

export function formatClassDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;
}

/**
 * What the public 280 page says about remaining places.
 * Quiet while the class is still open, "Nearly full" from the 6th booking,
 * then the exact remainder once only 3, 2 or 1 places are left.
 * Returns null when nothing should be shown.
 */
export function placeScarcity(spacesLeft: number, capacity: number): string | null {
  if (spacesLeft <= 0) return "Full";
  if (spacesLeft === 1) return "1 space left";
  if (spacesLeft <= 3) return `${spacesLeft} spaces left`;
  if (capacity - spacesLeft >= 6) return "Nearly full";
  return null;
}
