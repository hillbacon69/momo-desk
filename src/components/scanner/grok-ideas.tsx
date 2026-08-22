"use client";

import { useState } from "react";

/** Build history + idea prompts for the GROK button sheet */
export const DESK_HISTORY = [
  "4D neon bubble buttons (black well, glass top, neon lip, bright when pressed)",
  "Session buttons: Pre-Market, Market, After Hours, Crypto, Options, High/Mid/Small Cap",
  "Strategy button near Options",
  "SCAN / CLEAN / GROK header cluster — CLEAN turns red when dirty",
  "Tape list: news, % change, goingWhere, lookFor, per-row CHART",
  "15m charts upgraded to TradingView lightweight-charts",
  "Timeframes: 5 MIN · 15 MIN · 1 HR · 1 DAY",
  "Chart legend: 9 EMA, 20 EMA, AVWAP, HOD, LOD + LOD/HOD AVWAP",
  "Candlestick patterns: HAMMER, HANG, DOJI, STAR, ENGULF, MORNING, EVENING, MARU",
  "HUD toasts (1 min, X to dismiss) for 9/20 near AVWAP setups",
  "AVWAP = sum((H+L+C)/3 * vol) / sum(vol) from anchor",
] as const;

export const DESK_IDEAS = [
  "Add Level 2 / order flow panel under chart",
  "Watchlist save per device (localStorage)",
  "Sound on HUD alerts",
  "Pin a ticker so chart stays open",
  "Replay last 30 min on 1m for pattern study",
  "Crypto-only strategy presets (BTC bias + 9/20 + AVWAP)",
  "Export tape to CSV",
  "Dark/neon theme toggle",
] as const;

function copyText(text: string) {
  void navigator.clipboard.writeText(text);
}

export function GrokIdeasSheet({
  onClose,
  onOpenGrok,
}: {
  onClose: () => void;
  onOpenGrok?: (prompt: string) => void;
}) {
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState("");

  function markCopied(label: string) {
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  function copyHistory() {
    const body = [
      "Momo Desk — update request",
      "",
      "What we already built:",
      ...DESK_HISTORY.map((h) => `- ${h}`),
      "",
      "Ideas to add next:",
      ...DESK_IDEAS.map((h) => `- ${h}`),
      note.trim() ? `\nMy note:\n${note.trim()}` : "",
    ].join("\n");
    copyText(body);
    markCopied("history");
  }

  function openGrokWith(prompt: string) {
    if (onOpenGrok) {
      onOpenGrok(prompt);
      return;
    }
    const url = `https://grok.com?q=${encodeURIComponent(prompt)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const defaultPrompt = [
    "Update Momo Desk scanner with these ideas. Keep 4D neon buttons, SCAN/CLEAN, charts with 5m/15m/1H/1D, AVWAP, and candle patterns.",
    "",
    note.trim() || DESK_IDEAS.slice(0, 3).map((i) => `- ${i}`).join("\n"),
  ].join("\n");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-lit uppercase">Grok · Ideas</p>
          <p className="text-sm text-muted">Build history + prompts to update the desk</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bubble-body short grid size-10 place-items-center text-muted hover:text-fg"
          aria-label="Close ideas"
        >
          X
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">Already shipped</p>
        <ul className="mb-4 space-y-1.5">
          {DESK_HISTORY.map((item) => (
            <li key={item} className="text-sm text-fg">
              <span className="text-lit">·</span> {item}
            </li>
          ))}
        </ul>

        <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">Next ideas</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {DESK_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs text-fg hover:border-lit/50"
              onClick={() => {
                copyText(idea);
                markCopied(idea);
                setNote((n) => (n.includes(idea) ? n : [n, idea].filter(Boolean).join("\n")));
              }}
            >
              {idea}
            </button>
          ))}
        </div>

        <label className="mb-1 block font-mono text-xs tracking-widest text-muted uppercase" htmlFor="idea-note">
          Your note
        </label>
        <textarea
          id="idea-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Type what you want fixed or added…"
          className="mb-3 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-lit/50"
        />

        {copied ? <p className="mb-2 text-xs text-up">Copied: {copied}</p> : null}
      </div>

      <div className="shrink-0 space-y-2 border-t border-border px-4 py-3">
        <button
          type="button"
          className="bubble-body short w-full border border-transparent text-sm"
          onClick={copyHistory}
        >
          COPY HISTORY + IDEAS
        </button>
        <button
          type="button"
          className="bubble-body short w-full border border-transparent text-sm"
          data-on="true"
          onClick={() => openGrokWith(defaultPrompt)}
        >
          OPEN GROK WITH PROMPT
        </button>
      </div>
    </div>
  );
}
