# Finnhub WebSocket — Momo Desk

Live prints for the scanner tape. One socket. Subscribe the names on screen. Yahoo still fills 9/20 and AVWAP.

## Setup

1. Free key: https://finnhub.io
2. Put it in env as `FINNHUB_API_KEY` (or `VITE_FINNHUB_API_KEY` for local).
3. Do **not** commit the key.

## Wire

```ts
import { useFinnhubTrades } from "./finnhub-ws";

const ticks = useFinnhubTrades(["AAPL", "NVDA", "BTCUSD"]);
// merge ticks over the tape: last price + LIVE flag
```

## Protocol

- Socket: `wss://ws.finnhub.io?token=KEY`
- Subscribe: `{"type":"subscribe","symbol":"AAPL"}`
- Crypto: `BINANCE:BTCUSDT` (not `BTCUSD`)
- Trade: `{ type: "trade", data: [{ s, p, t, v }] }`
- Ping: reply `{ "type": "pong" }`
- Free plan: **one connection per key**. Cap ~20 names.

Reconnect waits 3 seconds if the socket drops.
