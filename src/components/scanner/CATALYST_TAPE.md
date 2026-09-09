# Catalyst tape

Dated events only. Not a buy list.

## Wire-up

```tsx
import { CatalystPanel } from "@/components/scanner/catalyst-panel";
import { annotateTape } from "@/data/catalysts";

// under SCAN / CLEAN / GROK header, above the tape list:
<CatalystPanel tickers={rows.map((r) => r.ticker)} />

// when ranking / scoring tape rows:
const scored = annotateTape(rows);
```

## Rules

- Tape list rows stay clean: symbol, %, vol, 9/20/AVWAP, CHART, news.
- Catalyst lives in the header tape + optional one-line tag on CHART popup (`going.label` can append catalystTag).
- Unlocks and delists are fade/skip.
- Watch items (ZCSH, HYPG, UNI burns, JUP/RAY buybacks) are flow, not launches.
- Pacifica / Variational / Extended are farm / pre-token. Do not invent TGE days.
- Source of truth: `src/data/catalysts.ts` (asOf stamp at top).
