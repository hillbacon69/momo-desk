"use client";

import { useEffect, useMemo, useRef } from "react";
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

function formatPx(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1000) return n.toFixed(2);
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toPrecision(3);
}

export function TapeChart({ bars, row }: { bars: ChartBar[]; row: ScanRow }) {
  const host = useRef<HTMLDivElement>(null);

  const packed = useMemo(() => {
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
        color: bar.c >= bar.o ? "rgba(45, 255, 134, 0.5)" : "rgba(238, 91, 91, 0.5)",
      });
      closes.push(bar.c);
    }
    const e9 = emaSeries(closes, 9);
    const e20 = emaSeries(closes, 20);
    const last9 = [...e9].reverse().find((v) => v != null) ?? null;
    const last20 = [...e20].reverse().find((v) => v != null) ?? null;
    return { candleData, volData, e9, e20, last9, last20 };
  }, [bars]);

  useEffect(() => {
    const el = host.current;
    const { candleData, volData, e9, e20 } = packed;
    if (!el || candleData.length < 2) return;

    const chart: IChartApi = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#07080a" },
        textColor: "#c5ccd6",
        fontFamily: "IBM Plex Mono, ui-monospace, monospace",
        fontSize: 13,
      },
      grid: {
        vertLines: { color: "#1a1d25" },
        horzLines: { color: "#1a1d25" },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: "rgba(45, 255, 134, 0.55)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#0d3d24",
        },
        horzLine: {
          color: "rgba(45, 255, 134, 0.55)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#0d3d24",
        },
      },
      rightPriceScale: {
        borderColor: "#262a33",
        scaleMargins: { top: 0.06, bottom: 0.18 },
      },
      timeScale: {
        borderColor: "#262a33",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 16,
        minBarSpacing: 8,
        rightOffset: 8,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: "#2dff86",
      downColor: "#ee5b5b",
      borderVisible: false,
      wickUpColor: "#2dff86",
      wickDownColor: "#ee5b5b",
      lastValueVisible: true,
      priceLineVisible: true,
      priceLineColor: "#2dff86",
      priceLineWidth: 1,
    });
    candles.setData(candleData);

    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volume.priceScale().applyOptions({
      scaleMargins: { top: 0.86, bottom: 0 },
    });
    volume.setData(volData);

    const ema9 = chart.addSeries(LineSeries, {
      color: "#2dff86",
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: true,
      title: "9 EMA",
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });
    ema9.setData(
      candleData.flatMap((bar, i) => (e9[i] == null ? [] : [{ time: bar.time, value: e9[i]! }])),
    );

    const ema20 = chart.addSeries(LineSeries, {
      color: "#e8eaee",
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: true,
      title: "20 EMA",
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
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
    if (row.high) line(row.high, "#2dff86", "HOD");
    if (row.low) line(row.low, "#ee5b5b", "LOD");

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [packed, row.vwap, row.high, row.low]);

  return (
    <div className="flex h-full flex-col" style={{ minHeight: "70vh" }}>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pb-2 font-mono text-sm">
        <span className="font-semibold text-up">
          9 EMA {packed.last9 != null ? formatPx(packed.last9) : "—"}
        </span>
        <span className="font-semibold text-fg">
          20 EMA {packed.last20 != null ? formatPx(packed.last20) : "—"}
        </span>
        {row.vwap != null ? (
          <span className="text-wait">AVWAP {formatPx(row.vwap)}</span>
        ) : null}
        {row.high != null ? <span className="text-up">HOD {formatPx(row.high)}</span> : null}
        {row.low != null ? <span className="text-down">LOD {formatPx(row.low)}</span> : null}
      </div>
      <div
        ref={host}
        className="w-full flex-1"
        style={{ minHeight: "62vh" }}
        role="img"
        aria-label="Chart with 9 EMA and 20 EMA"
      />
      <p className="pt-1 text-xs text-muted">
        Green = 9 EMA · White = 20 EMA · Gold dashed = AVWAP
      </p>
    </div>
  );
}
