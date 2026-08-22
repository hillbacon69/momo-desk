# Chart popup layout

## Charts section (order)

1. Ticker + price + TF buttons (5 MIN / 15 MIN / 1 HR / 1 DAY)
2. EMA legend (9 / 20 / AVWAP / HOD / LOD)
3. **Look for** ← inside the charts section
   - `going.label` (colored)
   - `Look for · {going.lookFor}`
4. TapeChart plot (tight scale)
5. Optional story + news under the plot

## Wire it

```tsx
import { ChartLookFor, ChartDetails } from "@/components/scanner/chart-details";

const going = goingWhere(row);

// INSIDE the charts block, above the plot:
<ChartLookFor going={going} />
<TapeChart bars={bars} row={row} />

// Optional under plot:
<ChartDetails row={row} going={going} news={news} />
```

## App Builder paste

> Take Look for and put it in the charts section — directly under the 9/20/AVWAP legend and above the candle plot. Show going.label and "Look for · …" there. Do not leave Look for only in a footer away from the chart.
