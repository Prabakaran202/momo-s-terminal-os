// Generic helper utilities used across the app.
export const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export const cls = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
