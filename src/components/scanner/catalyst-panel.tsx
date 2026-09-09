"use client";

import { useMemo, useState } from "react";
import {
  CATALYST_AS_OF,
  upcoming,
  daysUntil,
  type Catalyst,
  type CatalystBias,
} from "@/data/catalysts";

function biasClass(b: CatalystBias): string {
  if (b === "fade" || b === "skip") return "text-down";
  if (b === "farm") return "text-lit";
  if (b === "watch-flows") return "text-muted";
  return "text-fg";
}

function DayLabel({ c }: { c: Catalyst }) {
  const d = daysUntil(c.date);
  if (c.conf === "watch") return <span className="text-muted">LIVE</span>;
  if (d == null) return <span className="text-muted">{c.date}</span>;
  if (d === 0) return <span className="text-up">TODAY</span>;
  if (d < 0) return <span className="text-muted">{Math.abs(d)}d ago</span>;
  return <span className="text-fg">{d}d</span>;
}

export function CatalystPanel({
  tickers = [],
}: {
  tickers?: string[];
}) {
  const [onlyTape, setOnlyTape] = useState(false);
  const rows = useMemo(() => {
    const all = upcoming(45);
    if (!onlyTape || tickers.length === 0) return all;
    const set = new Set(tickers.map((t) => t.replace(/^\$/, "").toUpperCase()));
    return all.filter((c) =>
      [...c.tickers, ...(c.aliases ?? [])].some((t) => set.has(t.toUpperCase())),
    );
  }, [onlyTape, tickers]);

  return (
    <section className="border-b border-border px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-lit uppercase">
            Catalyst tape
          </p>
          <p className="text-xs text-muted">
            Dated events only · as of {CATALYST_AS_OF} · not a buy list
          </p>
        </div>
        <button
          type="button"
          className="bubble-body short px-3 text-xs"
          data-on={onlyTape ? "true" : undefined}
          onClick={() => setOnlyTape((v) => !v)}
        >
          {onlyTape ? "TAPE ONLY" : "ALL 45D"}
        </button>
      </div>
      <ul className="space-y-1.5">
        {rows.length === 0 ? (
          <li className="text-xs text-muted">No dated catalyst in window.</li>
        ) : (
          rows.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-[52px_1fr_auto] items-baseline gap-2 text-sm"
            >
              <DayLabel c={c} />
              <div>
                <span className="font-mono text-xs text-lit">
                  {c.tickers[0] || "—"}
                </span>{" "}
                <span className="text-fg">{c.event}</span>
                <span className={`ml-2 font-mono text-[10px] uppercase ${biasClass(c.bias)}`}>
                  {c.kind} · {c.conf} · {c.bias}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted">{c.date.slice(5)}</span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
