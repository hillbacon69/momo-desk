/** Extra helpers kept split so the calendar file stays the source of dates. */
import { catalystsForTicker, annotateTape, type TapeRow } from "./catalysts";

export function cryptoSessionFilter<T extends { ticker: string }>(
  rows: T[],
  daysAhead = 14,
  now = new Date(),
): T[] {
  return rows.filter((row) => {
    const hits = catalystsForTicker(row.ticker, now);
    return hits.some((h) => {
      if (h.catalyst.conf === "watch") return true;
      if (h.days == null) return false;
      return h.days >= -1 && h.days <= daysAhead;
    });
  });
}

export function chartCatalystLine(ticker: string, now = new Date()): string {
  const hits = catalystsForTicker(ticker, now);
  const h = hits[0];
  if (!h) return "";
  return `${h.catalyst.event} · ${h.tag}`;
}

export function scoreCryptoTape<T extends TapeRow>(rows: T[]) {
  return annotateTape(rows);
}
