# Momo Desk

Live tape scanner with 4D neon buttons and TradingView [lightweight-charts](https://github.com/tradingview/lightweight-charts).

## Charts

Mash **CHART** on a name.

- **5 MIN / 15 MIN / 1 HR / 1 DAY**
- Neon candles, volume, 9/20 EMA, AVWAP / HOD / LOD
- Pattern arrows: HAMMER, DOJI, ENGULF, STAR, MORNING, EVENING, MARU

## Catalyst tape

Dated ETF / TGE / fee-switch / unlock calendar sits above the tape.

- Data: `src/data/catalysts.ts`
- Panel: `src/components/scanner/catalyst-panel.tsx`
- Wire-up: `src/components/scanner/CATALYST_TAPE.md`
- `annotateTape(rows)` adds score adj + tag. Does not invent quotes.

Unlocks default fade. Watch items (ZCSH, HYPG, UNI burns) are flow, not launches.

## GROK button

Opens an **Ideas** sheet (not a blank grok.com tab):

- Build history from this desk
- Idea chips to copy
- Your note + **OPEN GROK WITH PROMPT** to push updates

See `src/components/scanner/GROK_BUTTON.md` and `grok-ideas.tsx`.
