# Look for — charts only

## Rule

- Tape list rows: NO Look for text, NO catalyst text. Keep symbol, %, open/prev/vol, 9/20/AVWAP, spark, CHART button, news.
- Chart popup only: going.label + Look for under the EMA legend, above the candle plot.
- Catalyst line sits under Look for in that same chart block only.

## App Builder paste

Remove Look for from every tape list row (the CAN-style cards). Keep Look for only inside the chart popup, under the 9/20/AVWAP legend and above the candle plot. Pass goingWhere(row) into TapeChart as going={going}. Add Catalyst · under Look for via withChartCatalyst(row.symbol, going) or TapeChart auto-fill.
