# Catalyst tape

Dated events only. Not a buy list.

## Wire-up

```tsx
import { CatalystPanel } from "@/components/scanner/catalyst-panel";
import { annotateTape } from "@/data/catalysts";
import { applyCryptoSession } from "@/lib/market/crypto-session";

const cryptoOn = session === "Crypto";
const visible = applyCryptoSession(rows, cryptoOn);
const scored = annotateTape(visible);

<CatalystPanel tickers={visible.map((r) => r.ticker)} />
<TapeChart bars={bars} row={row} going={going} />
```

## Rules

- Tape list rows stay clean: symbol, %, vol, 9/20/AVWAP, CHART, news.
- Catalyst lives in the header tape + one line on CHART popup under Look for.
- Unlocks and delists are fade/skip.
- Watch items (ZCSH, HYPG, UNI burns, JUP/RAY buybacks) are flow, not launches.
- Pacifica / Variational / Extended are farm / pre-token. Do not invent TGE days.
- Source of truth: `src/data/catalysts.ts` (asOf stamp at top).
