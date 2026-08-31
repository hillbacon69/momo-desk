# EDGAR 424B + Submissions on WATCH (free, no key)

## Why
8-K atom catches events. 424B catches **dilution** (ATM / registered direct / shelf takedown) — the fade signal for momo. Submissions JSON gives the **last form + item** per ticker so the card can say "SEC 424B5" instead of a generic 8-K.

## Endpoints (all free, no key, 10 req/sec, User-Agent required)

### 1. 424B atom (dilution firehose)
```
https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=424B&owner=include&count=40&output=atom
```
Also poll `type=424B5` and `type=S-3` if you want shelf + takedown separately.

Each `<entry>` title: `424B5 - TICKER (0001234567) (Filer)` + link to index page.

### 2. Submissions JSON (per ticker, last 1000 filings)
```
https://data.sec.gov/submissions/CIK##########.json
```
CIK = 10-digit zero-padded. Map ticker → CIK via:
```
https://www.sec.gov/files/company_tickers.json
```
Read `filings.recent.form[]`, `.filingDate[]`, `.primaryDocument[]`. First match of `8-K` / `424B*` / `S-1` / `S-3` = the card line.

### 3. 8-K item numbers (already in atom summary)
The 8-K atom `<summary>` includes item numbers, e.g. `Item 1.01: Entry into a Material Definitive Agreement`. Parse those for the card: `SEC 8-K Item 1.01` (deal) vs `Item 8.01` (other) vs `Item 2.01` (acquisition).

## Ranking on WATCH
1. **SEC 424B / S-3** (dilution) — red chip, top of list, fade bias
2. **SEC 8-K Item 1.01 / 2.01 / 1.05 / 8.01** — gold chip
3. Finnhub / PR wire headline
4. Yahoo news
5. Rest of movers

## Rate limit
Poll 424B atom every 60s. Submissions JSON only for names already on WATCH (cap ~30). Sleep 150ms between calls. Cache ticker→CIK map 24h.

## Card line examples
- `SEC 424B5 · shelf takedown · 2.1M shares`
- `SEC 8-K Item 1.01 · material agreement`
- `SEC 8-K Item 8.01 · other event`

## Skip
sec-api.io ($49/mo) — only if you later want second-level item extraction + stream. Free EDGAR covers the momo use case.
