/** Stat cells and constants for the Ambarella edge AI opinion post. */

/* ── Hero stat cells: the headline financials ── */
export const heroStats = [
  { label: 'FY26 revenue', value: '$390.7M', sub: 'up 37% year over year', direction: 'up' as const },
  { label: 'From edge AI', value: '~80%', sub: 'of total revenue', direction: 'up' as const },
  { label: 'Cumulative edge AI', value: '$1B+', sub: 'milestone just crossed', direction: 'up' as const },
  { label: 'Hanwha agreement', value: '$800M+', sub: 'over 10 plus years', direction: 'up' as const },
];

/* ── Platform scale: why this is a platform, not a project ── */
export const platformStats = [
  { label: 'Chips deployed', value: '45M', sub: 'AI running at the edge', direction: 'nt' as const },
  { label: 'AI chips in production', value: '12', sub: 'distinct SoCs', direction: 'up' as const },
  { label: 'Customer projects', value: '370+', sub: 'unique designs', direction: 'up' as const },
  { label: 'Model architectures', value: '200+', sub: 'supported in silicon', direction: 'up' as const },
];

/* ── High timeframe price context ──
 * Approximate month end closes for AMBA, reconstructed from public sources
 * (stockanalysis.com, companiesmarketcap.com) to illustrate the trend. The
 * recent anchors are close to reported values: April 2026 near $60, May 2026
 * near $72, and the current quote near $92, against a trailing 52 week range
 * of roughly $48 to $97. Shown for trend context, not as exact tick data.
 */
export const ambaChartLabels = [
  'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24',
  'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
  'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
  'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25',
  'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26',
];

export const ambaChartPrices = [
  62, 65, 68, 58, 55, 52,
  56, 60, 58, 64, 70, 72,
  70, 66, 60, 55, 52, 49,
  48, 53, 58, 62, 66, 68,
  66, 70, 67, 60, 72, 86, 92,
];

/* Stat cells that frame the price chart. */
export const priceStats = [
  { label: 'Latest quote', value: '~$92', sub: 'near 52 week highs', direction: 'up' as const },
  { label: '52 week range', value: '$48 to $97', sub: 'wide, volatile', direction: 'nt' as const },
  { label: 'Off the 2025 low', value: '~90%', sub: 'from roughly $48', direction: 'up' as const },
  { label: 'Forward P/E', value: '~50x', sub: 'priced for growth', direction: 'dn' as const },
];
