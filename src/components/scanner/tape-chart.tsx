"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  LineStyle,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { ChartBar } from "@/lib/market/quotes";
import type { ScanRow } from "@/lib/market/types";

function emaSeries(closes: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const out: (number | null)[] = [];
  let e = 0;
  for (let i = 0; i < closes.length; i++) {
    const c = closes[i]!;
    if (i === 0) e = c;
    else e = c * k + e * (1 - k);
    out.push(i < period - 1 ? null : e);
  }
  return out;
}

export function TapeChart({ bars, row }: { bars: ChartBar[]; row: ScanRow }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || bars.length < 2) return;

    const seen = new Set<number>();
    const candleData: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[] = [];
    const volData: { time: UTCTimestamp; value: number; color: string }[] = [];
    const closes: number[] = [];
    for (const bar of bars) {
      if (seen.has(bar.t)) continue;
      seen.add(bar.t);
      const time = bar.t as UTCTimestamp;
      candleData.push({ time, open: bar.o, high: bar.h, low: bar.l, close: bar.c });
      volData.push({
        time,
        value: bar.v || 0,
        color: bar.c >= bar.o ? "rgba(45, 255, 134, 0.45)" : "rgba(238, 91, 91, 0.45)",
      });
      closes.push(bar.c);
    }
    if (candleData.length < 2) return;

    const chart: IChartApi = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#111318" },
        textColor: "#8b919c",
        fontFamily: "IBM Plex Mono, ui-monospace, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#262a33" },
        horzLines: { color: "#262a33" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(45, 255, 134, 0.45)", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#2dff86" },
        horzLine: { color: "rgba(45, 255, 134, 0.45)", width: 1, style: LineStyle.Dashed, labelBackgroundColor: "#2dff86" },
      },
      rightPriceScale: {
        borderColor: "#262a33",
        scaleMargins: { top: 0.08, bottom: 0.22 },
      },
      timeScale: {
        borderColor: "#262a33",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: "#2dff86",
      downColor: "#ee5b5b",
      borderUpColor: "#2dff86",
      borderDownColor: "#ee5b5b",
      wickUpColor: "#2dff86",
      wickDownColor: "#ee5b5b",
    });
    candles.setData(candleData);

    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
    });
    volume.priceScale().applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    volume.setData(volData);

    const e9 = emaSeries(closes, 9);
    const e20 = emaSeries(closes, 20);
    const ema9 = chart.addSeries(LineSeries, {
      color: "#2dff86",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    ema9.setData(
      candleData.flatMap((bar, i) => (e9[i] == null ? [] : [{ time: bar.time, value: e9[i]! }])),
    );
    const ema20 = chart.addSeries(LineSeries, {
      color: "#8b919c",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    ema20.setData(
      candleData.flatMap((bar, i) => (e20[i] == null ? [] : [{ time: bar.time, value: e20[i]! }])),
    );

    const line = (price: number, color: string, title: string) => {
      candles.createPriceLine({
        price,
        color,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title,
      });
    };
    if (row.vwap) line(row.vwap, "#e2c15a", "AVWAP");
    if (row.avwapLod) line(row.avwapLod, "#2dff86", "AVWAP LOD");
    if (row.avwapHod) line(row.avwapHod, "#ee5b5b", "AVWAP HOD");
    if (row.high) line(row.high, "#2dff86", "HOD");
    if (row.low) line(row.low, "#ee5b5b", "LOD");

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [bars, row.vwap, row.avwapLod, row.avwapHod, row.high, row.low]);

  return <div ref={host} className="h-96 w-full" role="img" aria-label="Intraday candlestick chart" />;
}
