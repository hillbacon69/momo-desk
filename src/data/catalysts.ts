/** Dated catalyst calendar for Momo Desk.
 *  Source of truth: edit this file. Soft dates slip — verify official channels.
 *  asOf: 2026-09-09
 */

export type CatalystKind =
  | "etf"
  | "tge"
  | "fee-switch"
  | "upgrade"
  | "unlock"
  | "delist"
  | "farm-cutoff"
  | "mainnet"
  | "vote";

export type CatalystConf = "hard" | "soft" | "watch";

export type CatalystBias = "chase-only-if-quiet" | "fade" | "watch-flows" | "farm" | "skip";

export type Catalyst = {
  id: string;
  date: string;
  windowEnd?: string;
  tickers: string[];
  aliases?: string[];
  event: string;
  kind: CatalystKind;
  conf: CatalystConf;
  bias: CatalystBias;
  note: string;
};

export const CATALYST_AS_OF = "2026-09-09";

export const CATALYSTS: Catalyst[] = [
  {
    id: "kraken-delist-sep11",
    date: "2026-09-11",
    tickers: [],
    event: "Kraken trading ends on 21 tokens",
    kind: "delist",
    conf: "hard",
    bias: "fade",
    note: "Forced selling. Not a moon setup.",
  },
  {
    id: "zec-nu7-vote",
    date: "2026-09-14",
    tickers: ["ZEC"],
    event: "Zcash NU7 community vote ends",
    kind: "vote",
    conf: "hard",
    bias: "watch-flows",
    note: "Already ran on ETF. Vote is protocol path, not a new buyer.",
  },
  {
    id: "unlock-sep15",
    date: "2026-09-15",
    tickers: ["ARB", "STRK"],
    event: "Large token unlocks",
    kind: "unlock",
    conf: "hard",
    bias: "fade",
    note: "Supply hit. Default fade.",
  },
  {
    id: "arc-mainnet",
    date: "2026-09-16",
    tickers: ["ARC"],
    event: "Circle Arc mainnet",
    kind: "mainnet",
    conf: "hard",
    bias: "watch-flows",
    note: "L1 launch. Token timing still messy vs mainnet date.",
  },
  {
    id: "zk-unlock-sep16",
    date: "2026-09-16",
    tickers: ["ZK"],
    event: "ZK unlock",
    kind: "unlock",
    conf: "hard",
    bias: "fade",
    note: "Supply.",
  },
  {
    id: "bitmex-close",
    date: "2026-09-23",
    tickers: [],
    event: "BitMEX shuts",
    kind: "delist",
    conf: "hard",
    bias: "skip",
    note: "Venue death. Derivatives migrate. Not a token long.",
  },
  {
    id: "city-protocol-tge",
    date: "2026-09-28",
    tickers: [],
    event: "City Protocol TGE (claimed)",
    kind: "tge",
    conf: "soft",
    bias: "skip",
    note: "Low-quality calendar filler. Verify official only.",
  },
  {
    id: "var-points-end",
    date: "2026-09-30",
    tickers: ["VAR"],
    aliases: ["VARIATIONAL"],
    event: "Variational points end no later than this",
    kind: "farm-cutoff",
    conf: "hard",
    bias: "farm",
    note: "Docs cutoff. TGE itself not dated. Polymarket leaned by Dec 31.",
  },
  {
    id: "zcsh-flows",
    date: "2026-08-25",
    tickers: ["ZEC"],
    event: "ZCSH ETF live — track flows not launch",
    kind: "etf",
    conf: "watch",
    bias: "watch-flows",
    note: "Grayscale ZCSH listed Aug 25. Already the ZEC catalyst.",
  },
  {
    id: "hypg-flows",
    date: "2026-08-03",
    tickers: ["HYPE"],
    aliases: ["HYPERLIQUID"],
    event: "HYPG staking ETF live — monthly distributions",
    kind: "etf",
    conf: "watch",
    bias: "watch-flows",
    note: "Already listed. Not a new listing trade.",
  },
  {
    id: "uni-fee-switch",
    date: "2025-12-28",
    tickers: ["UNI"],
    aliases: ["UNISWAP"],
    event: "UNI fee-switch + burns already on (v4 expanded Jul 27 2026)",
    kind: "fee-switch",
    conf: "watch",
    bias: "watch-flows",
    note: "Track daily burn, not a future flip.",
  },
  {
    id: "apyx-tge",
    date: "2026-10-13",
    tickers: ["APYX"],
    event: "Apyx TGE (calendar claimed)",
    kind: "tge",
    conf: "soft",
    bias: "chase-only-if-quiet",
    note: "DeFi/stablecoin, not a DEX leader.",
  },
  {
    id: "ada-etf-window",
    date: "2026-10-23",
    tickers: ["ADA"],
    event: "Possible ADA ETF decision window",
    kind: "etf",
    conf: "soft",
    bias: "watch-flows",
    note: "Window only if a filer exists. No dedicated filer = no trade.",
  },
  {
    id: "ext-tge",
    date: "2026-09-30",
    windowEnd: "2026-12-31",
    tickers: ["EXT"],
    aliases: ["EXTENDED"],
    event: "Extended perp DEX TGE window Q3 leftover into Q4",
    kind: "tge",
    conf: "soft",
    bias: "farm",
    note: "$12.5M raised. No hard day.",
  },
  {
    id: "var-tge-est",
    date: "2026-11-01",
    windowEnd: "2026-12-31",
    tickers: ["VAR"],
    aliases: ["VARIATIONAL"],
    event: "Variational TGE estimate",
    kind: "tge",
    conf: "soft",
    bias: "farm",
    note: "Tracker estimate. Official TGE not posted.",
  },
  {
    id: "pacifica-tba",
    date: "2026-12-31",
    tickers: ["PACIFICA"],
    event: "Pacifica TGE — no date",
    kind: "tge",
    conf: "soft",
    bias: "farm",
    note: "Cleanest pre-token perp DEX. Points live. Do not invent a day.",
  },
  {
    id: "mon-unlock",
    date: "2026-11-24",
    tickers: ["MON"],
    aliases: ["MONAD"],
    event: "Monad large unlock",
    kind: "unlock",
    conf: "hard",
    bias: "fade",
    note: "Huge % print. Default fade.",
  },
  {
    id: "jup-buybacks",
    date: "2026-09-09",
    tickers: ["JUP"],
    aliases: ["JUPITER"],
    event: "JUP buybacks ongoing (Litterbox)",
    kind: "fee-switch",
    conf: "watch",
    bias: "watch-flows",
    note: "Already public. Flow proxy for Solana DEX volume.",
  },
  {
    id: "ray-launchlab",
    date: "2026-09-09",
    tickers: ["RAY"],
    aliases: ["RAYDIUM"],
    event: "RAY fee-to-buyback + LaunchLab flow",
    kind: "fee-switch",
    conf: "watch",
    bias: "watch-flows",
    note: "Cyclical with Solana meme volume.",
  },
];

export type TapeRow = {
  ticker: string;
  pct?: number;
  rvol?: number;
};

export type CatalystHit = {
  ticker: string;
  catalyst: Catalyst;
  days: number | null;
  scoreAdj: number;
  tag: string;
};

function parseDay(s: string): Date | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00");
  if (/^\d{4}-\d{2}$/.test(s)) return new Date(s + "-01T00:00:00");
  return null;
}

export function daysUntil(dateStr: string, now = new Date()): number | null {
  const d = parseDay(dateStr);
  if (!d) return null;
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const b = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((b - a) / 86400000);
}

export function scoreAdjFor(c: Catalyst, days: number | null): number {
  if (c.bias === "skip") return -3;
  if (c.bias === "fade") {
    if (days != null && days >= 0 && days <= 7) return -2;
    return -1;
  }
  if (c.bias === "watch-flows") return 0;
  if (c.bias === "farm") {
    if (c.kind === "farm-cutoff" && days != null && days >= 0 && days <= 21) return +1;
    return 0;
  }
  if (c.conf === "hard" && days != null && days >= 0 && days <= 7) return +2;
  if (days != null && days >= 0 && days <= 14) return +1;
  return 0;
}

export function tagFor(c: Catalyst, days: number | null): string {
  const d =
    days == null ? "" : days < 0 ? ` ${Math.abs(days)}d ago` : days === 0 ? " TODAY" : ` ${days}d`;
  return `${c.kind}${d} · ${c.conf} · ${c.bias}`;
}

function tickerKey(t: string): string {
  return t.replace(/^\$/, "").trim().toUpperCase();
}

export function catalystsForTicker(ticker: string, now = new Date()): CatalystHit[] {
  const key = tickerKey(ticker);
  return CATALYSTS.filter((c) => {
    const bag = [...c.tickers, ...(c.aliases ?? [])].map(tickerKey);
    return bag.includes(key);
  })
    .map((c) => {
      const days = daysUntil(c.date, now);
      return {
        ticker: key,
        catalyst: c,
        days,
        scoreAdj: scoreAdjFor(c, days),
        tag: tagFor(c, days),
      };
    })
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
}

export function upcoming(daysAhead = 30, now = new Date()): Catalyst[] {
  return CATALYSTS.filter((c) => {
    const d = daysUntil(c.date, now);
    if (d == null) return false;
    if (c.conf === "watch" && d < 0) return true;
    return d >= -2 && d <= daysAhead;
  }).sort((a, b) => (daysUntil(a.date, now) ?? 999) - (daysUntil(b.date, now) ?? 999));
}

export function annotateTape(rows: TapeRow[], now = new Date()) {
  return rows.map((row) => {
    const hits = catalystsForTicker(row.ticker, now);
    const adj = hits.reduce((s, h) => s + h.scoreAdj, 0);
    const primary = hits[0];
    return {
      ...row,
      catalystAdj: adj,
      catalystTag: primary ? primary.tag : "",
      catalystEvent: primary ? primary.catalyst.event : "",
      catalystBias: primary ? primary.catalyst.bias : "",
      hits,
    };
  });
}
