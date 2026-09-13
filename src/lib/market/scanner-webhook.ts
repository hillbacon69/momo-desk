"use client";

/** Client side of the scanner webhook: spots the moment a name FIRST prints a
 *  signal (edge), and asks the server route to post it. Never every tick.
 */
import { useEffect, useRef } from "react";
import { isNeverFeatured, normalizeSymbol } from "./never-feature";

export type SignalRow = {
  symbol?: string;
  ticker?: string;
  price?: number | null;
  changeRatio?: number | null; // tape style: 0.052 = +5.2%
  changePct?: number | null; // already a percent
  volume?: number | null;
  grade?: string | null;
  setup?: boolean | string | null;
  strongJump?: boolean | null;
};

/** The signal label a row is printing right now, or null.
 *  Map your tape's own flags here if they're named differently.
 */
export function scannerSignal(row: SignalRow): string | null {
  if (row.grade === "A+") return "A+";
  if (row.strongJump) return "strong jump";
  if (typeof row.setup === "string" && row.setup) return row.setup;
  if (row.setup) return "setup";
  return null;
}

type Payload = {
  symbol: string;
  price: number;
  changePct: number | null;
  volume: number | null;
  timeframe: string | null;
  setup: string;
};

/** Pure edge detection, so it can be tested without React.
 *  `prev` is mutated to the current state. On the first pass (`seeded` false)
 *  it records state but fires nothing — reloading the page must not replay
 *  every name that was already lit.
 */
export function detectEdges(
  prev: Map<string, string | null>,
  rows: SignalRow[],
  timeframe: string | null,
  seeded: boolean,
): Payload[] {
  const out: Payload[] = [];
  for (const row of rows) {
    const symbol = normalizeSymbol(row.symbol ?? row.ticker);
    if (!symbol || isNeverFeatured(symbol)) continue;
    const now = scannerSignal(row);
    const before = prev.get(symbol) ?? null;
    prev.set(symbol, now);
    if (!seeded || !now || before) continue;
    const price = Number(row.price);
    if (!Number.isFinite(price)) continue;
    const pct =
      row.changePct != null
        ? row.changePct
        : row.changeRatio != null
          ? row.changeRatio * 100
          : null;
    out.push({
      symbol,
      price,
      changePct: pct != null && Number.isFinite(pct) ? Math.round(pct * 100) / 100 : null,
      volume: row.volume != null && Number.isFinite(row.volume) ? row.volume : null,
      timeframe,
      setup: now,
    });
  }
  return out;
}

/** Drop into the live scanner: useScannerWebhook(rows, timeframe). */
export function useScannerWebhook(rows: SignalRow[], timeframe: string | null = null) {
  const prev = useRef(new Map<string, string | null>());
  const seeded = useRef(false);

  useEffect(() => {
    if (!rows.length) return;
    const edges = detectEdges(prev.current, rows, timeframe, seeded.current);
    seeded.current = true;
    for (const body of edges) {
      void fetch("/api/scanner-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    }
  }, [rows, timeframe]);
}
