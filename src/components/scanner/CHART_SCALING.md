# Chart scaling rules (Momo Desk)

Goal: **candles are tall and readable** — not a thin strip on a stretched axis.

## Vertical (price) — make candles tall

1. Scale **only the last 50 bars** (visible window). Never full multi-day history.
2. `min` = lowest low in window · `max` = highest high in window
3. **Pad = 0.5% of (max − min)** — almost no empty space above/below
4. Force range via `autoscaleInfoProvider` on the candlestick series
5. Price scale margins: `top: 0.01`, `bottom: 0.05`
6. Volume on separate `priceScaleId: "vol"` with `scaleMargins: { top: 0.95, bottom: 0 }`
7. HOD / LOD / AVWAP lines only if inside the tight range

## Horizontal (time)

1. Default view = last **50 bars**
2. `barSpacing: 18`, `minBarSpacing: 10` (fat bodies)

## Layout

1. Full-screen chart sheet
2. Plot: `minHeight: calc(100dvh - 11rem)`

## App Builder paste

> Make candles a lot taller: Y scale from last 50 bars only, 0.5% pad, volume thin strip, barSpacing 18, plot minHeight calc(100dvh - 11rem). Candles must fill almost the full vertical plot.
