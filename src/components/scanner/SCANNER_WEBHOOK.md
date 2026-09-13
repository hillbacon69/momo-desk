# Scanner webhook

When a name **first** prints A+ / setup / strong jump, the server POSTs it to your webhook.
Edge only — a name that stays lit does not re-send.

## Files

- `src/lib/market/scanner-webhook.ts` — client: spots the edge, calls the route
- `src/routes/api/scanner-webhook.ts` — server route `POST /api/scanner-webhook`
- `src/lib/market/scanner-webhook.server.ts` — reads env, dedupes, posts
- `src/lib/market/never-feature.ts` — AZI, EHGO, BEEM, PWCM, CDTG, YJ never go out

## Rules

- Same symbol: once per 20 min (server side).
- Env missing: silent no-op.
- Page load does not replay names already lit — only new edges after load.
- The secret header stays on the server. The browser never sees it.

## App Builder paste

One line in the live scanner, next to where the tape rows are ready:

```tsx
import { useScannerWebhook } from "@/lib/market/scanner-webhook";

useScannerWebhook(rows, timeframe);
```

If the tape names its flags differently than `grade === "A+"`, `setup`, or `strongJump`,
edit `scannerSignal()` in `scanner-webhook.ts` — that's the only place.

## Payload

```json
{ "symbol": "GPRO", "price": 1.28, "changePct": 46.07, "volume": 35141922,
  "timeframe": "5m", "setup": "A+", "source": "momo-desk",
  "timestamp": "2026-09-12T14:31:05.000Z" }
```
