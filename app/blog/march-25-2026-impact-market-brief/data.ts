/* ── Static data for Impact Market Brief — Mar 25, 2026 ────────────────── */

// ── Hero / Ticker stats ─────────────────────────────────────────────────
export const heroStats = [
  { label: 'BTC Price', value: '~$87K', sub: 'Fractal entry zone', direction: 'dn' as const },
  { label: 'Crowd Consensus', value: '$70-72K', sub: 'Polymarket modal', direction: 'dn' as const },
  { label: 'Fractal Target', value: '$53.3K', sub: 'Green line dominant path', direction: 'dn' as const },
  { label: 'BAR (20 exchanges)', value: '-0.018', sub: 'Bid ask ratio negative', direction: 'dn' as const },
];

// ── Signals ──────────────────────────────────────────────────────────────
export const signals: { text: string; type: 'bull' | 'bear' | 'neutral' }[] = [
  { text: 'Fractal: 7 matches converge', type: 'bear' },
  { text: 'BAR negative across 20 exchanges', type: 'bear' },
  { text: 'Macro: Risk off stagflation', type: 'bear' },
  { text: 'Polymarket: 57.5% at $70-72K', type: 'neutral' },
  { text: 'Crowd confirms direction', type: 'neutral' },
  { text: 'Bull invalidation: weekly close >$90K', type: 'bull' },
];

// ── BTC Book data grid ──────────────────────────────────────────────────
export const bookGrid = [
  { label: 'Current Price', value: '~$87K', sub: 'Fractal entry zone', direction: 'dn' as const },
  { label: 'Weighted Avg Forecast', value: '$72.2K', sub: 'Multi match average', direction: 'dn' as const },
  { label: 'Best Match Target', value: '$53.3K', sub: 'Green line — dominant path', direction: 'dn' as const },
];

// ── Fractal signal paths ────────────────────────────────────────────────
export const fractalPaths = [
  {
    label: 'Green Line — Best Match Path',
    price: '$53.3K',
    type: 'bear' as const,
    description:
      'Dominant historical analog. Lowest probability in the short term — highest conviction over 60 days. Prepare for this path.',
  },
  {
    label: 'Gold Dashed — Weighted Average',
    price: '$72.2K',
    type: 'neutral' as const,
    description:
      'Average of all 7 matches. Represents the crowd median of historical outcomes — right in the Polymarket consensus zone.',
  },
];

// ── Polymarket probability bars (Today, Mar 25) ─────────────────────────
export const pmToday = [
  { label: '< $66K', pct: 1.5, tier: 'tiny' as const },
  { label: '$66-68K', pct: 1.1, tier: 'tiny' as const },
  { label: '$68-70K', pct: 16.0, tier: 'mid' as const },
  { label: '$70-72K', pct: 57.5, tier: 'peak' as const, star: true },
  { label: '$72-74K', pct: 20.5, tier: 'high' as const },
  { label: '$74-76K', pct: 2.4, tier: 'low' as const },
  { label: '> $76K', pct: 0.7, tier: 'tiny' as const },
];

// ── Polymarket cumulative upside (Friday Mar 28) ────────────────────────
export const pmFriday = [
  { label: 'Above $60K', pct: 98.6, tier: 'peak' as const },
  { label: 'Above $66K', pct: 93.5, tier: 'high' as const },
  { label: 'Above $70K', pct: 64.0, tier: 'mid' as const },
  { label: 'Above $72K', pct: 41.0, tier: 'low' as const },
  { label: 'Above $74K', pct: 21.0, tier: 'low' as const },
  { label: 'Above $76K', pct: 8.0, tier: 'tiny' as const },
];

// ── Scenarios ────────────────────────────────────────────────────────────
export const scenarios = [
  {
    id: 'A',
    title: 'Fractal Resolves Lower (Base Case)',
    body: 'BTC begins to lose momentum from the $87K level. If price fails to reclaim $88K+ on volume by Thursday, the weighted average path to $72K becomes the dominant near term narrative — validating both the Polymarket crowd and setting up the second leg toward $65.5K then $53.3K. Watch $80K as the first confirmation level.',
  },
  {
    id: 'B',
    title: 'Crowd is Right, Fractal Delays (Alternative)',
    body: "BTC consolidates in the $70-74K zone this week, crowd confirms. The fractal's 60 day resolution clock starts ticking from a lower base. The green line path is delayed but not invalidated — the setup just reprices from a lower entry. Watch $74K close as the scenario B trigger.",
  },
  {
    id: 'C',
    title: 'Fractal Invalidated (Bull Case, Low Probability)',
    body: "A sustained weekly close above $90K on high volume with positive BAR would suggest the historical analog is breaking down and a new ATH run is possible. At that point, the crowd's view is overly bearish and needs to reprice upward. Probability given current BAR readings: ~12%.",
  },
];

// ── Position ─────────────────────────────────────────────────────────────
export const position = {
  lean: 'Bearish — 60 Day Horizon',
  conviction: 'Half Book Conviction',
  thesis:
    "The fractal's best historical match — 7 distinct pattern alignments against Aug to Dec 2025 price structure — resolves to $53.3K. The global bid ask ratio is negative. The macro regime is Risk Off Stagflation. The Polymarket crowd confirms the near term directional move to $70-72K, which sets the entry point for the second leg. The path is written. Prepare for it.",
  killCondition:
    'A weekly close above $90K with positive BAR across 20 exchanges and stablecoin liquidity influx. That would invalidate the historical analog entirely and force a full position reassessment.',
};

// ── Impact Method ────────────────────────────────────────────────────────
export const methodLayers = [
  {
    title: 'Layer 1: Crowd Intelligence',
    body: "Polymarket prediction markets aggregate real money bets from thousands of participants into a probability distribution. Unlike analyst forecasts, these are skin in the game signals — someone's dollar is on the line for every price they quote. We extract the modal price expectation, the distribution skew, and the 24hr volume as a conviction signal. High confidence crowd distributions with tight spread = high quality signal.",
  },
  {
    title: 'Layer 2: Orderflow Intelligence',
    body: 'The fractal model uses Dynamic Time Warping (DTW) across price + global bid ask ratio simultaneously, scanning 1,000 days of historical data across 20 exchanges. When the current price structure and order book profile match a historical pattern with statistically significant precision, we weight those matches to produce a probabilistic forward path. The green line represents the highest weight single historical analog.',
  },
];

// ── Chart data: Polymarket probability distribution (horizontal bar) ────
export const pmChartLabels = ['< $66K', '$66-68K', '$68-70K', '$70-72K', '$72-74K', '$74-76K', '> $76K'];
export const pmChartValues = [1.5, 1.1, 16.0, 57.5, 20.5, 2.4, 0.7];

// ── Chart data: Cumulative upside probabilities ─────────────────────────
export const pmCumulativeLabels = ['> $60K', '> $66K', '> $70K', '> $72K', '> $74K', '> $76K'];
export const pmCumulativeValues = [98.6, 93.5, 64.0, 41.0, 21.0, 8.0];
