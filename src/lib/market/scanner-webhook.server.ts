/** Server side of the scanner webhook. Never import this from client code —
 *  it reads SCANNER_WEBHOOK_URL / SCANNER_WEBHOOK_HEADER from process.env.
 *
 *  No framework imports, so it runs (and tests) under plain Node.
 */
import { isNeverFeatured, normalizeSymbol } from "./never-feature";

/** Same symbol won't post again inside this window. Spec: 15–30 min. */
export const DEDUPE_MS = 20 * 60 * 1000;
const TIMEOUT_MS = 5000;

export type ScannerSignal = {
  symbol: string;
  price: number;
  changePct: number | null;
  volume: number | null;
  timeframe: string | null;
  setup: string;
};

export type SendResult = {
  sent: boolean;
  reason?: "not-configured" | "invalid" | "blocked" | "deduped" | "failed";
  status?: number;
};

type Env = Record<string, string | undefined>;

// Per server instance. A restart forgets, which at worst allows one repeat.
const lastSent = new Map<string, number>();

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export async function sendScannerSignal(
  input: Partial<ScannerSignal> | null | undefined,
  opts: { env?: Env; now?: number; fetchImpl?: typeof fetch } = {},
): Promise<SendResult> {
  const env = opts.env ?? (process.env as Env);
  const url = env.SCANNER_WEBHOOK_URL?.trim();
  const auth = env.SCANNER_WEBHOOK_HEADER?.trim();
  // Not set up yet: do nothing, say nothing.
  if (!url || !auth) return { sent: false, reason: "not-configured" };

  const symbol = normalizeSymbol(input?.symbol);
  const price = num(input?.price);
  const setup = String(input?.setup ?? "").trim();
  if (!symbol || price == null || !setup) return { sent: false, reason: "invalid" };
  if (isNeverFeatured(symbol)) return { sent: false, reason: "blocked" };

  const now = opts.now ?? Date.now();
  for (const [s, t] of lastSent) if (now - t >= DEDUPE_MS) lastSent.delete(s);
  if (lastSent.has(symbol)) return { sent: false, reason: "deduped" };
  // Claim the slot before the network call so two quick edges can't both send.
  lastSent.set(symbol, now);

  const body = {
    symbol,
    price,
    changePct: num(input?.changePct),
    volume: num(input?.volume),
    timeframe: input?.timeframe ? String(input.timeframe) : null,
    setup,
    source: "momo-desk",
    timestamp: new Date(now).toISOString(),
  };

  try {
    const res = await (opts.fetchImpl ?? fetch)(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      lastSent.delete(symbol); // let the next edge retry
      return { sent: false, reason: "failed", status: res.status };
    }
    return { sent: true, status: res.status };
  } catch {
    lastSent.delete(symbol);
    return { sent: false, reason: "failed" };
  }
}

/** Test hook. */
export function _resetDedupe(): void {
  lastSent.clear();
}
