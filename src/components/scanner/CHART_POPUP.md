# Chart popup — Look for in the charts section

## Order (top → bottom)

1. Ticker + price + TF buttons
2. EMA legend (9 / 20 / AVWAP / HOD / LOD)
3. **Look for** (going.label + lookFor) ← **in the charts section**
4. Candle plot
5. Optional story / news under plot

## Wire it

```tsx
const going = goingWhere(row);

<TapeChart bars={bars} row={row} going={going} />
```

`going` is required for Look for to show above the candles.

Do **not** leave Look for only in a footer away from the chart.

## App Builder paste

> Put Look for in the charts section. Pass goingWhere(row) into TapeChart as going={going}. Show going.label and "Look for · …" under the 9/20/AVWAP legend and above the candle plot. Remove duplicate Look for from any footer if it is still only there.
