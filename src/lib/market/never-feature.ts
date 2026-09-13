/** Tickers Momo Desk must never feature — not on the tape, not in a webhook.
 *  Shared by client and server so the two can't drift apart.
 */
export const NEVER_FEATURE: ReadonlySet<string> = new Set([
  "AZI",
  "EHGO",
  "BEEM",
  "PWCM",
  "CDTG",
  "YJ",
]);

export function normalizeSymbol(symbol: unknown): string {
  return String(symbol ?? "")
    .replace(/^\$/, "")
    .trim()
    .toUpperCase();
}

export function isNeverFeatured(symbol: unknown): boolean {
  return NEVER_FEATURE.has(normalizeSymbol(symbol));
}
