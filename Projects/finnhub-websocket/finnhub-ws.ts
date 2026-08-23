"use client";

import { useEffect, useRef, useState } from "react";

const CRYPTO = new Set([
  "BTCUSD",
  "ETHUSD",
  "SOLUSD",
  "XRPUSD",
  "DOGEUSD",
  "ADAUSD",
  "LINKUSD",
  "SUIUSD",
]);

export function toFinnhubSymbol(sym: string): string {
  if (CRYPTO.has(sym) || (sym.endsWith("USD") && sym.length >= 6 && /^[A-Z]+USD$/.test(sym))) {
    return `BINANCE:${sym.slice(0, -3)}USDT`;
  }
  return sym;
}

export function fromFinnhubSymbol(sym: string): string {
  const upper = sym.toUpperCase();
  const binance = /^BINANCE:([A-Z0-9]+)USDT$/.exec(upper);
  if (binance) return `${binance[1]}USD`;
  const coinbase = /^COINBASE:([A-Z0-9]+)-USD$/.exec(upper);
  if (coinbase) return `${coinbase[1]}USD`;
  return upper;
}

type TradeMsg = {
  type?: string;
  data?: { s?: string; p?: number; t?: number; v?: number }[];
};

function readKey(): string {
  return (
    (typeof process !== "undefined" && (process.env.FINNHUB_API_KEY || process.env.VITE_FINNHUB_API_KEY)) ||
    (typeof import.meta !== "undefined" && (import.meta as { env?: { VITE_FINNHUB_API_KEY?: string } }).env?.VITE_FINNHUB_API_KEY) ||
    ""
  );
}

/** Live last-price ticks. Empty array if no Finnhub key. */
export function useFinnhubTrades(symbols: string[]) {
  const [ticks, setTicks] = useState<{ symbol: string; price: number; live: boolean }[]>([]);
  const symbolsKey = symbols.join(",");
  const latest = useRef(symbols);
  latest.current = symbols;

  useEffect(() => {
    if (symbols.length === 0) return;
    let ws: WebSocket | null = null;
    let stopped = false;
    let retry: number | undefined;

    const connect = () => {
      const token = readKey();
      if (!token || stopped) return;
      const socket = new WebSocket(`wss://ws.finnhub.io?token=${encodeURIComponent(token)}`);
      ws = socket;
      socket.onopen = () => {
        for (const symbol of latest.current) {
          socket.send(JSON.stringify({ type: "subscribe", symbol: toFinnhubSymbol(symbol) }));
        }
      };
      socket.onmessage = (event) => {
        let msg: TradeMsg;
        try {
          msg = JSON.parse(String(event.data)) as TradeMsg;
        } catch {
          return;
        }
        if (msg.type === "ping") {
          socket.send(JSON.stringify({ type: "pong" }));
          return;
        }
        if (msg.type !== "trade" || !Array.isArray(msg.data)) return;
        setTicks((prev) => {
          const by = new Map(prev.map((row) => [row.symbol, row]));
          for (const trade of msg.data ?? []) {
            if (!trade.s || !Number.isFinite(trade.p)) continue;
            const symbol = fromFinnhubSymbol(trade.s);
            by.set(symbol, { symbol, price: trade.p!, live: true });
          }
          return [...by.values()];
        });
      };
      socket.onclose = () => {
        if (!stopped) retry = window.setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      stopped = true;
      if (retry) window.clearTimeout(retry);
      ws?.close();
    };
  }, [symbolsKey, symbols.length]);

  return ticks;
}
