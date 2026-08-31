// Free EDGAR 424B + submissions on WATCH names. No key. 10 req/sec.
// Requires a descriptive User-Agent (SEC fair-access policy).

const UA = 'MomoDesk/1.0 (momo-desk@example.com)';
const HEADERS = { 'User-Agent': UA, 'Accept': 'application/json, application/atom+xml' };

const TICKER_MAP = 'https://www.sec.gov/files/company_tickers.json';
const SUBMISSIONS = (cik10: string) => `https://data.sec.gov/submissions/CIK${cik10}.json`;
const ATOM_424B = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=424B&owner=include&count=40&output=atom';
const ATOM_8K = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&owner=include&count=40&output=atom';

export type SecHit = {
  ticker: string;
  form: '424B' | '424B5' | 'S-3' | '8-K';
  item?: string;          // e.g. '1.01' for 8-K
  filed: string;          // YYYY-MM-DD
  title: string;          // short read for the card
  url: string;
  bias: 'fade' | 'watch' | 'news';
};

// ticker -> zero-padded CIK (cached)
let cikCache: Record<string, string> | null = null;
async function cikFor(ticker: string): Promise<string | null> {
  if (!cikCache) {
    const r = await fetch(TICKER_MAP, { headers: HEADERS });
    const j = await r.json();
    cikCache = {};
    for (const row of Object.values(j) as any[]) {
      cikCache[row.ticker.toUpperCase()] = String(row.cik_str).padStart(10, '0');
    }
  }
  return cikCache[ticker.toUpperCase()] ?? null;
}

// Last relevant filing for one ticker (submissions JSON)
export async function lastFiling(ticker: string): Promise<SecHit | null> {
  const cik = await cikFor(ticker);
  if (!cik) return null;
  const r = await fetch(SUBMISSIONS(cik), { headers: HEADERS });
  if (!r.ok) return null;
  const j = await r.json();
  const forms: string[] = j.filings?.recent?.form ?? [];
  const dates: string[] = j.filings?.recent?.filingDate ?? [];
  const docs: string[] = j.filings?.recent?.primaryDocument ?? [];
  const acc: string[] = j.filings?.recent?.accessionNumber ?? [];
  for (let i = 0; i < forms.length; i++) {
    const f = forms[i];
    if (!/^(8-K|424B|424B5|S-3|S-1)$/.test(f)) continue;
    const cikPath = cik.replace(/^0+/, '');
    const accPath = acc[i].replace(/-/g, '');
    return {
      ticker,
      form: f as SecHit['form'],
      filed: dates[i],
      title: f.startsWith('424B') ? 'shelf / ATM takedown' : f === '8-K' ? 'current report' : 'registration',
      url: `https://www.sec.gov/Archives/edgar/data/${cikPath}/${accPath}/${docs[i]}`,
      bias: f.startsWith('424B') ? 'fade' : 'watch',
    };
  }
  return null;
}

// 424B firehose (all filers) — match against WATCH tickers
export async function recent424B(watch: string[]): Promise<SecHit[]> {
  const r = await fetch(ATOM_424B, { headers: HEADERS });
  const xml = await r.text();
  const out: SecHit[] = [];
  const re = /<title>([^<]+)<\/title>[\s\S]*?<link[^>]*href="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const title = m[1];
    const url = m[2];
    const tm = title.match(/424B\d*\s*-\s*([A-Z.]+)(?:\s*\((\d+)\))?/);
    if (!tm) continue;
    const ticker = tm[1];
    if (!watch.map(t => t.toUpperCase()).includes(ticker)) continue;
    out.push({
      ticker,
      form: '424B',
      filed: (title.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] || '',
      title: 'prospectus supplement (dilution)',
      url,
      bias: 'fade',
    });
  }
  return out;
}

// Merge: 424B first (fade), then 8-K items, then lastFiling per name
export async function secForWatch(watch: string[]): Promise<SecHit[]> {
  const [b, ...rest] = await Promise.all([
    recent424B(watch),
    ...watch.map(t => lastFiling(t).catch(() => null)),
  ]);
  const seen = new Set<string>();
  const merged: SecHit[] = [];
  for (const h of [...b, ...rest.filter(Boolean) as SecHit[]]) {
    const k = h.ticker + h.form;
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(h);
  }
  // 424B / S-3 on top
  merged.sort((a, b) => (a.bias === 'fade' ? 0 : 1) - (b.bias === 'fade' ? 0 : 1));
  return merged;
}
