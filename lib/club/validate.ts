export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const isToken = (v: unknown): v is string => typeof v === "string" && /^[a-f0-9]{48}$/.test(v);
