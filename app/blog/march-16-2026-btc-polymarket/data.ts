/* ── Static data for the BTC Polymarket report — Mar 16, 2026 ─────────── */

// ── Hero metrics ──────────────────────────────────────────────────────────
export const heroStats = [
  { label: 'Reach $100k by EOY', value: '42.5%', sub: 'vol24h $20.9k', direction: 'dn' as const },
  { label: 'Reach $200k by EOY', value: '5.0%', sub: 'vol24h $11.8k', direction: 'dn' as const },
  { label: 'Dip to $55k by EOY', value: '68.0%', sub: 'vol24h $49.6k — highest', direction: 'dn' as const },
  { label: 'Total event volume', value: '$25.1M', sub: '$326k vol in last 24h', direction: 'nt' as const },
];

// ── Upside targets — probability of reaching by Dec 31, 2026 ─────────
export const upsideData = [
  { label: '$75k', value: 93.6 },
  { label: '$80k', value: 80.5 },
  { label: '$90k', value: 56.5 },
  { label: '$100k', value: 42.5 },
  { label: '$110k', value: 29.5 },
  { label: '$120k', value: 22 },
  { label: '$130k', value: 16.5 },
  { label: '$140k', value: 11.5 },
  { label: '$150k', value: 9.5 },
  { label: '$160k', value: 7.5 },
  { label: '$170k', value: 7.5 },
  { label: '$180k', value: 6.5 },
  { label: '$200k', value: 5 },
  { label: '$250k', value: 4.5 },
  { label: '$500k', value: 2.5 },
  { label: '$1M', value: 1.7 },
];

// ── Downside risk — probability of dipping to by EOY ─────────────────
export const downsideData = [
  { label: '$55k', value: 68 },
  { label: '$50k', value: 57.5 },
  { label: '$45k', value: 44.5 },
  { label: '$40k', value: 34.5 },
  { label: '$35k', value: 24.5 },
  { label: '$30k', value: 17.5 },
  { label: '$25k', value: 14.5 },
  { label: '$20k', value: 10.5 },
  { label: '$15k', value: 6.9 },
  { label: '$10k', value: 5.1 },
  { label: '$5k', value: 4.2 },
];

// ── Best month for BTC in 2026 ───────────────────────────────────────
export const bestMonthData = [
  { label: 'Jan', value: 1.8, resolved: true },
  { label: 'Feb', value: 0, resolved: true },
  { label: 'Mar', value: 7 },
  { label: 'Apr', value: 5.5 },
  { label: 'May', value: 7.5 },
  { label: 'Jun', value: 9 },
  { label: 'Jul', value: 10 },
  { label: 'Aug', value: 9.5 },
  { label: 'Sep', value: 10.5 },
  { label: 'Oct', value: 16.5 },
  { label: 'Nov', value: 14.5 },
  { label: 'Dec', value: 16.5 },
];
