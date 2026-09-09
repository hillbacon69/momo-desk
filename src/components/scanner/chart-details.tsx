"use client";

/**
 * Chart-section detail block.
 * Look for + catalyst sit IN the charts section (under the EMA legend / above the plot).
 * Catalyst tag is chart-popup only — never on tape rows.
 */

import { chartCatalystLine } from "@/data/catalyst-extra";

export type GoingRead = {
  label: string;
  lookFor: string;
  tone: "up" | "down" | "wait";
  catalyst?: string;
};

export type DetailRow = {
  symbol: string;
  name?: string;
  price: number;
  changeRatio: number;
  vwap?: number | null;
  ema9?: number | null;
  ema20?: number | null;
  high?: number | null;
  low?: number | null;
  setup?: boolean;
};

function fmtPx(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1000) return n.toFixed(2);
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toPrecision(3);
}

function fmtPct(ratio: number): string {
  if (!Number.isFinite(ratio)) return "—";
  const pct = ratio * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function buildStory(row: DetailRow, going: GoingRead): string {
  const parts: string[] = [];
  const up = row.changeRatio >= 0;
  parts.push(
    up
      ? `${row.symbol} is up ${fmtPct(row.changeRatio)} on the session.`
      : `${row.symbol} is down ${fmtPct(row.changeRatio)} on the session.`,
  );
  if (row.ema9 != null && row.ema20 != null) {
    parts.push(row.ema9 > row.ema20 ? "9 EMA is over 20 EMA — short-term bias is up." : "9 EMA is under 20 EMA — short-term bias is down.");
  }
  if (row.vwap != null && row.price) {
    const vs = ((row.price - row.vwap) / row.vwap) * 100;
    if (Math.abs(vs) < 0.4) parts.push("Price is hugging session AVWAP — decision zone.");
    else if (vs > 0) parts.push(`Trading ${vs.toFixed(1)}% above AVWAP — buyers own the day so far.`);
    else parts.push(`Trading ${Math.abs(vs).toFixed(1)}% below AVWAP — sellers own the day so far.`);
  }
  if (row.setup) parts.push("Setup flag: 9 over 20 and stacked near AVWAP.");
  parts.push(going.label);
  if (going.catalyst) parts.push(`Catalyst: ${going.catalyst}`);
  return parts.join(" ");
}

export function withChartCatalyst(symbol: string, going: GoingRead): GoingRead {
  const line = going.catalyst || chartCatalystLine(symbol);
  return line ? { ...going, catalyst: line } : going;
}

export function ChartLookFor({ going }: { going: GoingRead }) {
  const toneClass =
    going.tone === "up" ? "text-up" : going.tone === "down" ? "text-down" : "text-wait";
  return (
    <div className="shrink-0 space-y-1 border-b border-border pb-2">
      <p className={`text-sm font-semibold ${toneClass}`}>{going.label}</p>
      <p className="text-sm leading-snug text-fg">
        <span className="font-mono text-xs tracking-widest text-lit uppercase">Look for · </span>
        {going.lookFor}
      </p>
      {going.catalyst ? (
        <p className="text-xs leading-snug text-muted">
          <span className="font-mono text-[10px] tracking-widest text-lit uppercase">Catalyst · </span>
          {going.catalyst}
        </p>
      ) : null}
    </div>
  );
}

export function ChartDetails({
  row,
  going,
  news,
}: {
  row: DetailRow;
  going: GoingRead;
  news?: string;
}) {
  const story = buildStory(row, going);
  return (
    <div className="shrink-0 space-y-2 border-t border-border px-0 py-2">
      <p className="text-sm leading-relaxed text-fg">{story}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <span>Last {fmtPx(row.price)}</span>
        <span className={row.changeRatio >= 0 ? "text-up" : "text-down"}>{fmtPct(row.changeRatio)}</span>
        {row.ema9 != null ? <span className="text-up">9 {fmtPx(row.ema9)}</span> : null}
        {row.ema20 != null ? <span>20 {fmtPx(row.ema20)}</span> : null}
        {row.vwap != null ? <span className="text-wait">AVWAP {fmtPx(row.vwap)}</span> : null}
        {row.high != null ? <span className="text-up">HOD {fmtPx(row.high)}</span> : null}
        {row.low != null ? <span className="text-down">LOD {fmtPx(row.low)}</span> : null}
      </div>
      <p className="text-xs text-muted">{news ?? "No headline on the tape yet."}</p>
    </div>
  );
}
