# Chart popup — show what the stock is doing

When the user mashes **CHART** on a tape row, the popup must include a detail panel under (or over) the plot.

## Required block

```tsx
import { ChartDetails } from "@/components/scanner/chart-details";

// inside ChartSheet, after TapeChart:
<ChartDetails
  row={row}
  going={goingWhere(row)}
  news={news}
/>
```

## What it shows

1. **Headline** — `going.label` (e.g. "Holding AVWAP, bias up") in green / red / wait color
2. **Story** — plain English: up/down %, 9 vs 20, above/below AVWAP, setup flag
3. **Look for** — `going.lookFor` (what to watch next)
4. **Levels strip** — Last, %, 9 EMA, 20 EMA, AVWAP, HOD, LOD
5. **News** — headline if any

## Layout

- Full-screen chart sheet
- Top: ticker + TF buttons (5 MIN / 15 MIN / 1 HR / 1 DAY)
- Middle: TapeChart (tight scale)
- Bottom (always visible, not buried): **ChartDetails**

## App Builder paste

> On the chart popup, under the plot, show what the stock is doing: goingWhere label, a short plain-English story (%, 9 vs 20, above/below AVWAP), Look for text, levels (9/20/AVWAP/HOD/LOD), and news. Use ChartDetails from hillbacon69/momo-desk chart-details.tsx. Keep it visible without scrolling away from the chart if possible.
