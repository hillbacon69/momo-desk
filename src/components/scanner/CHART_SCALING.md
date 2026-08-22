# Chart scaling rules (Momo Desk)

Use these exactly so candles stay readable (no 100–145 scale on a 131–137 name).

## Vertical (price) scale

1. **Only use the visible window** for min/max — last **90 bars** (or whatever is on screen after zoom). Never scale to the full multi-day history.
2. **min** = lowest low in that window  
   **max** = highest high in that window
3. **Pad = 2% of (max − min)**  
   Floor: `max(span * 0.02, |max| * 0.0004)`  
   Do **not** use 8%+ pad or full-session extremes.
4. Wire that range through the candlestick series:
   ```ts
   autoscaleInfoProvider: () => ({
     priceRange: { minValue: range.min, maxValue: range.max },
   })
   ```
5. **Price scale margins**: `top: 0.02`, `bottom: 0.08` (price owns the plot).
6. **Volume** on a **separate** `priceScaleId: "vol"` with `scaleMargins: { top: 0.92, bottom: 0 }` so it never stretches the candle axis.
7. **HOD / LOD / AVWAP** price lines: only draw if the level is **inside** the tight range. Skip levels outside the window so they don’t fight the scale.

## Horizontal (time) scale

1. Default visible range = last **90 bars** (+ small right offset).
2. `barSpacing: 16`, `minBarSpacing: 8`.
3. User can still pinch / scroll for more history; when they zoom, recompute min/max from **visible** bars if possible.

## Layout (full screen)

1. Chart sheet = full viewport (`fixed inset-0`).
2. Header + TF buttons + legend = fixed height at top.
3. Plot host: `flex-1` with `minHeight: calc(100dvh - 12rem)` so the canvas is the main thing on the phone.
4. Keep 9 EMA (green) and 20 EMA (white) as thick lines with last values on the legend.

## App Builder one-liner

> Apply CHART_SCALING.md: Y scale from last 90 bars only, 2% pad, volume on separate scale, plot minHeight calc(100dvh - 12rem), default zoom last 90 bars. Candles must fill the plot — no empty half-screen below price.
