# Chart popup — Look for + catalyst in the charts section

## Order (top → bottom)

1. Ticker + price + TF buttons
2. EMA legend (9 / 20 / AVWAP / HOD / LOD)
3. **Look for** (going.label + lookFor)
4. **Catalyst** (chart-popup only — never on tape rows)
5. Candle plot
6. Optional story / news under plot

## Wire it

```tsx
import { withChartCatalyst } from "@/components/scanner/chart-details";

const going = withChartCatalyst(row.symbol, goingWhere(row));

<TapeChart bars={bars} row={row} going={going} />
```

TapeChart also auto-fills catalyst from `chartCatalystLine(symbol)` if going.catalyst is empty.

## App Builder paste

> Put Look for in the charts section. Under Look for, show Catalyst · event only inside the chart popup. Never print catalyst on tape list rows. When session is Crypto, filter the tape with applyCryptoSession(rows, true) so only names with a dated event in 14 days (or live watch-flows) remain.
