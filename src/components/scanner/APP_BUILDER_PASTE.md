# App Builder — paste this

## 1. Crypto session (filters tape to dated catalysts in 14d)

```tsx
import { CatalystPanel } from "@/components/scanner/catalyst-panel";
import { applyCryptoSession } from "@/lib/market/crypto-session";
import { withChartCatalyst } from "@/components/scanner/chart-details";

const cryptoOn = session === "Crypto";
const visible = applyCryptoSession(rows, cryptoOn);

<CatalystPanel tickers={visible.map((r) => r.ticker || r.symbol)} />
```

## 2. Chart popup only (under Look for, never on tape rows)

```tsx
const going = withChartCatalyst(row.symbol || row.ticker, goingWhere(row));
<TapeChart bars={bars} row={row} going={going} />
```

Or drop this block in place of the current Look for block inside TapeChart:

```tsx
{going ? (
  <div className="shrink-0 space-y-1 border-b border-border pb-2 pt-1">
    <p className={`text-sm font-semibold ${going.tone === "up" ? "text-up" : going.tone === "down" ? "text-down" : "text-wait"}`}>{going.label}</p>
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
) : null}
```
