/* ── Static data for the Mar 16 2026 Market Color report ─────────────── */

// ── 01 Macro Snapshot (Friday close) ────────────────────────────────────
export const macroStats = [
  { label: 'S&P 500',        value: '6,632',    sub: '-0.61% · 2026 low',       direction: 'dn' as const },
  { label: 'Nasdaq',         value: '22,105',   sub: '-0.93% · 3rd losing week', direction: 'dn' as const },
  { label: 'Dow Jones',      value: '46,558',   sub: '-0.26% · -2% on week',    direction: 'dn' as const },
  { label: 'WTI Crude',      value: '$98.71',   sub: '+3.1% · approaching $100', direction: 'dn' as const },
  { label: 'Gold',           value: '~$5,100',  sub: 'Safe-haven bid intact',   direction: 'up' as const },
  { label: '10-yr Yield',    value: '4.21%',    sub: 'Inflation fear premium',  direction: 'dn' as const },
  { label: 'Core PCE (Jan)', value: '3.1%',     sub: 'Re-accelerating',         direction: 'dn' as const },
  { label: 'Feb Payrolls',   value: '-92k',     sub: 'First drop since 2020',   direction: 'dn' as const },
  { label: 'Q4 \'25 GDP',   value: '+0.7%',    sub: 'Revised down',            direction: 'dn' as const },
  { label: 'UMich Sentiment', value: '55.5',    sub: 'Near multi-year low',     direction: 'dn' as const },
  { label: 'Fed No-Cut (2026)', value: '19%',   sub: 'Was 7% in February',      direction: 'dn' as const },
  { label: 'First Cut Priced', value: 'Sept \'26', sub: 'FOMC decision: Mar 18', direction: 'nt' as const },
];

// ── 02 FOMC Prediction Markets ──────────────────────────────────────────
export const fomcColumns = [
  { key: 'market',       label: 'Market Question' },
  { key: 'probability',  label: 'Probability',    align: 'right' as const },
  { key: 'vol24h',       label: '24h Volume',     align: 'right' as const },
  { key: 'volTotal',     label: 'Total Volume',   align: 'right' as const },
  { key: 'significance', label: 'Significance' },
];

export const fomcData = [
  { market: 'Will Stephen Miran dissent at March FOMC?',      probability: '99%',    vol24h: '$11,369', volTotal: '$31,644',    significance: 'Trump appointee on record for cuts' },
  { market: 'Will Christopher Waller dissent at March FOMC?', probability: '70.5%',  vol24h: '$94',     volTotal: '$4,248',     significance: 'Second dissent = political pressure confirmed' },
  { market: 'Will Kevin Warsh be confirmed as Fed Chair?',    probability: '95%',    vol24h: '$214,755', volTotal: '$6,935,375', significance: 'Powell replacement incoming — dovish future priced' },
  { market: 'Will Trump nominate Kevin Warsh as Fed Chair?',  probability: '100%',   vol24h: '$69',     volTotal: '$617,334k',  significance: 'Already resolved — Warsh nominated' },
];

// ── 03 Live Perps & Funding ─────────────────────────────────────────────
export const perpTableColumns = [
  { key: 'asset',    label: 'Asset' },
  { key: 'mark',     label: 'Mark Price',   align: 'right' as const },
  { key: 'change',   label: '24h Change',   align: 'right' as const },
  { key: 'range',    label: '24h Range' },
  { key: 'funding',  label: 'Funding /8h',  align: 'right' as const },
  { key: 'vol',      label: '24h Vol',      align: 'right' as const },
  { key: 'oi',       label: 'Open Interest', align: 'right' as const },
  { key: 'signal',   label: 'Read' },
];

export const perpTableData = [
  { asset: 'BTC',  mark: '$73,177', change: '+$1,388 (+1.93%)', range: '$71,340 – $74,493', funding: '+0.00125%', vol: '$8.29M',  oi: '431 BTC',     signal: 'Spot-driven breakout' },
  { asset: 'ETH',  mark: '$2,242',  change: '+$123 (+5.80%)',   range: '$2,088 – $2,279',   funding: '-0.000188%', vol: '$2.63M',  oi: '3,079 ETH',   signal: 'Outpacing BTC — rotation' },
  { asset: 'SOL',  mark: '$92.82',  change: '+$5.47 (+6.3%)',   range: '$87.35 – $94.23',   funding: '+0.00125%', vol: '$6.33M',  oi: '5,762 SOL',   signal: 'Altcoin bid broadening' },
  { asset: 'XRP',  mark: '$1.470',  change: '+0.001 (+0.1%)',   range: '$1.400 – $1.548',   funding: '+0.00125%', vol: '—',       oi: '12,271',      signal: 'Lagging the move' },
  { asset: 'HYPE', mark: '$39.12',  change: '+$1.44 (+3.8%)',   range: '$36.81 – $39.31',   funding: '-0.00560%', vol: '$11.85M', oi: '230,205',     signal: 'Squeeze accelerating' },
  { asset: 'DOGE', mark: '$0.1003', change: '—',                range: '$0.0965 – $0.1043', funding: '+0.00125%', vol: '—',       oi: '64,828',      signal: 'No signal' },
];

// ── 04 Spot & Open Interest ─────────────────────────────────────────────
export const spotStats = [
  { label: 'BTC Spot',       value: '$73,136',  sub: '+$1,347 vs 24h ago',        direction: 'up' as const },
  { label: 'ETH Spot',       value: '$2,244',   sub: '+$125 vs 24h ago',          direction: 'up' as const },
  { label: 'BTC Perp OI',    value: '~612 BTC', sub: 'Not expanding with price',  direction: 'nt' as const },
  { label: 'ETH Perp OI',    value: '~3,305 ETH', sub: 'Slight drop on rally',   direction: 'dn' as const },
  { label: 'BTC Options OI', value: '~15,019',  sub: 'Dec \'26 strikes dominant', direction: 'nt' as const },
  { label: 'ETH Options OI', value: '~94,200',  sub: 'Growing with staking ETF',  direction: 'up' as const },
  { label: 'HYPE OI',        value: '230,205',  sub: '+3k vs yesterday — growing', direction: 'dn' as const },
  { label: 'HYPE Funding',   value: '-0.0056%', sub: 'Deepening — most negative on venue', direction: 'dn' as const },
];

// ── 05 Volume Heat ──────────────────────────────────────────────────────
export const volumeBars = [
  { label: 'HYPE-PERP', value: 11.85, displayValue: '$11.85M', highlight: true },
  { label: 'BTC-PERP',  value: 8.29,  displayValue: '$8.29M' },
  { label: 'SOL-PERP',  value: 6.33,  displayValue: '$6.33M' },
  { label: 'ETH-PERP',  value: 2.63,  displayValue: '$2.63M' },
  { label: 'ENA-PERP',  value: 0.023, displayValue: '$2.3k' },
];

// ── 07 Watchlist / Triggers ─────────────────────────────────────────────
export const watchlistItems = [
  { event: 'FOMC — Mar 18, 2pm ET',    detail: 'Rate hold is 100% baked. Dissent count is everything. Miran at 99%, Waller at 70.5%. Two dissents = dovish signal that accelerates H2 cut pricing.',  severity: 'red' as const },
  { event: 'BTC $74,493 / $75k',       detail: 'Today\'s high was $74,493. Close above $75k during or after FOMC = structural trend change. Below $72,800 on close breaks the breakout thesis.',      severity: 'amber' as const },
  { event: 'ETH / BTC Ratio',          detail: 'ETH at +5.8% vs BTC at +1.9% — the rotation is live. If ETH holds above $2,200 through FOMC, the alt-season ignition sequence has begun.',            severity: 'green' as const },
  { event: 'HYPE Squeeze',             detail: 'Funding at -0.0056% and deepening for a third session. OI still growing. Shorts not covering. Watch for funding to flip positive as the exhaustion signal.', severity: 'amber' as const },
  { event: 'Oil — $100/bbl',           detail: 'WTI at $98.71 on Friday. Clean break above $100 before or during FOMC reframes the entire macro narrative and caps the crypto rally.',                severity: 'red' as const },
  { event: 'Warsh Confirmation',       detail: 'At 95% probability, largely priced. Any Senate floor vote timing could accelerate the dovish narrative. Confirmed Warsh = Powell\'s end date visible.',  severity: 'green' as const },
];
