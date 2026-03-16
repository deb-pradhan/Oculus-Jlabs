/* ── Static data for the Mar 15 2026 Market Color report ─────────────── */

// ── 01 Macro Snapshot ──────────────────────────────────────────────────
export const macroStats = [
  { label: 'S&P 500',       value: '5,638',    sub: '-1.4% WoW',   direction: 'dn' as const },
  { label: 'Nasdaq 100',    value: '19,282',   sub: '-2.1% WoW',   direction: 'dn' as const },
  { label: 'DXY',           value: '103.6',    sub: '-0.8% WoW',   direction: 'dn' as const },
  { label: 'US 10Y',        value: '4.28%',    sub: '-6 bps WoW',  direction: 'dn' as const },
  { label: 'VIX',           value: '22.5',     sub: '+3.4 WoW',    direction: 'up' as const },
  { label: 'Gold',          value: '$2,988',   sub: '+1.6% WoW',   direction: 'up' as const },
  { label: 'Crypto MVRV',   value: '1.85',     sub: 'Below 2.0',   direction: 'dn' as const },
  { label: 'BTC Dom',       value: '62.3%',    sub: '+0.5% WoW',   direction: 'up' as const },
  { label: 'Total3',        value: '$1.02T',   sub: '-3.8% WoW',   direction: 'dn' as const },
  { label: 'Stables MCap',  value: '$228B',    sub: '+$1.2B WoW',  direction: 'up' as const },
  { label: 'Fear & Greed',  value: '28',       sub: 'Fear',         direction: 'dn' as const },
  { label: 'MOVE Index',    value: '98.2',     sub: '+4.1 WoW',    direction: 'up' as const },
];

// ── 02 Perps & Funding (Derive MCP) ───────────────────────────────────
export const perpTableColumns = [
  { key: 'asset',    label: 'Asset'         },
  { key: 'mark',     label: 'Mark Price',   align: 'right' as const },
  { key: 'funding',  label: 'Funding (8h)',  align: 'right' as const },
  { key: 'annRate',  label: 'Ann. Rate',     align: 'right' as const },
  { key: 'oi',       label: 'Open Interest', align: 'right' as const },
  { key: 'signal',   label: 'Signal',        align: 'center' as const },
];

export const perpTableData = [
  { asset: 'BTC',  mark: '$70,142', funding: '+0.003%',  annRate: '+3.1%',   oi: '$18.4B', signal: 'Neutral' },
  { asset: 'ETH',  mark: '$3,812',  funding: '+0.001%',  annRate: '+1.1%',   oi: '$8.6B',  signal: 'Neutral' },
  { asset: 'SOL',  mark: '$124.30', funding: '-0.002%',  annRate: '-2.2%',   oi: '$3.1B',  signal: 'Mild short' },
  { asset: 'XRP',  mark: '$0.612',  funding: '-0.004%',  annRate: '-4.4%',   oi: '$1.2B',  signal: 'Short bias' },
  { asset: 'HYPE', mark: '$24.18',  funding: '-0.012%',  annRate: '-13.1%',  oi: '$620M',  signal: 'Squeeze risk' },
  { asset: 'DOGE', mark: '$0.082',  funding: '-0.001%',  annRate: '-1.1%',   oi: '$480M',  signal: 'Neutral' },
];

// ── 03 Spot Snapshot ───────────────────────────────────────────────────
export const spotStats = [
  { label: 'BTC',  value: '$70,085',  sub: '+0.8% 24h',  direction: 'up' as const },
  { label: 'ETH',  value: '$3,805',   sub: '-0.4% 24h',  direction: 'dn' as const },
  { label: 'SOL',  value: '$124.10',  sub: '-1.2% 24h',  direction: 'dn' as const },
  { label: 'XRP',  value: '$0.610',   sub: '-2.1% 24h',  direction: 'dn' as const },
  { label: 'HYPE', value: '$24.05',   sub: '+4.2% 24h',  direction: 'up' as const },
  { label: 'DOGE', value: '$0.0815',  sub: '-0.6% 24h',  direction: 'dn' as const },
  { label: 'ETH/BTC', value: '0.0543', sub: '-1.1% 24h', direction: 'dn' as const },
  { label: 'SOL/ETH', value: '0.0326', sub: '-0.8% 24h', direction: 'dn' as const },
];

// ── 04 Volume Heat ─────────────────────────────────────────────────────
export const volumeBars = [
  { label: 'BTC',  value: 38.4, displayValue: '$38.4B' },
  { label: 'ETH',  value: 16.2, displayValue: '$16.2B' },
  { label: 'SOL',  value: 5.8,  displayValue: '$5.8B'  },
  { label: 'HYPE', value: 4.1,  displayValue: '$4.1B', highlight: true },
  { label: 'XRP',  value: 3.4,  displayValue: '$3.4B'  },
  { label: 'DOGE', value: 2.2,  displayValue: '$2.2B'  },
];

// ── 05 Polymarket ──────────────────────────────────────────────────────
export const polymarketColumns = [
  { key: 'market',     label: 'Market'       },
  { key: 'yesPrice',   label: 'YES',          align: 'right' as const },
  { key: 'noPrice',    label: 'NO',           align: 'right' as const },
  { key: 'volume',     label: 'Volume',       align: 'right' as const },
  { key: 'delta',      label: '7d Delta',     align: 'right' as const },
];

export const polymarketData = [
  { market: 'Fed cuts 25bp Mar 18',          yesPrice: '12%',  noPrice: '88%',  volume: '$14.2M', delta: '+3%'  },
  { market: 'Fed cuts by June 2026',         yesPrice: '68%',  noPrice: '32%',  volume: '$41.8M', delta: '+5%'  },
  { market: 'BTC above $80K by Apr 30',      yesPrice: '42%',  noPrice: '58%',  volume: '$28.3M', delta: '-4%'  },
  { market: 'US recession 2026',             yesPrice: '34%',  noPrice: '66%',  volume: '$22.1M', delta: '+6%'  },
  { market: 'ETH/BTC above 0.06 by Jun',     yesPrice: '24%',  noPrice: '76%',  volume: '$8.4M',  delta: '-2%'  },
  { market: 'Trump tariff escalation Mar',   yesPrice: '55%',  noPrice: '45%',  volume: '$18.6M', delta: '+8%'  },
];

// ── 07 Watchlist / Triggers ────────────────────────────────────────────
export const watchlistItems = [
  { event: 'FOMC Decision',           detail: 'Mar 17-18 — hold expected, dot-plot is the catalyst',        severity: 'red'   as const },
  { event: 'Trump Tariff Deadline',   detail: 'Mar 20 — reciprocal tariffs on EU/Asia go live',             severity: 'red'   as const },
  { event: 'HYPE Token Unlock',       detail: 'Mar 22 — 12M tokens ($290M) unlock, shorts front-running',  severity: 'amber' as const },
  { event: 'ETH Dencun Anniversary',  detail: 'Mar 13 — narrative catalyst for L2 repricing',              severity: 'green' as const },
  { event: 'PCE Inflation Print',     detail: 'Mar 28 — core PCE expected 2.7%, hot = risk-off',           severity: 'amber' as const },
  { event: 'Quarter-End Rebalance',   detail: 'Mar 31 — pension/fund flows, historically positive BTC',    severity: 'green' as const },
];

// ── Status Bar ─────────────────────────────────────────────────────────
export const statusBarItems = [
  { label: 'Report',   value: 'Market Color' },
  { label: 'Date',     value: 'Mar 15, 2026' },
  { label: 'Desk',     value: 'Axe Capital' },
  { label: 'Regime',   value: 'Risk-Off', highlight: true },
  { label: 'Sources',  value: 'Derive MCP, Polymarket, CoinGlass, TradingView' },
];
