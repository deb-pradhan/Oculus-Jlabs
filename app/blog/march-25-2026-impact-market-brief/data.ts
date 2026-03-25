/* Data for Impact Market Brief — Mar 25, 2026 */

export const tickerItems = [
  { label: 'BTC', value: '~$71.2K', note: 'Fractal entry zone' },
  { label: 'Crowd Consensus', value: '$70–72K', note: '' },
  { label: 'Fractal Target', value: '$53.3K', note: '' },
  { label: 'BAR (20 exchanges)', value: '−0.018', note: '' },
];

export const heroStats = [
  { label: 'Current Price', value: '~$71.2K', sub: 'Fractal entry zone', direction: 'dn' as const },
  { label: 'Weighted Avg Forecast', value: '$72.2K', sub: 'Multi match average', direction: 'nt' as const },
  { label: 'Best Match Target', value: '$53.3K', sub: 'Green line dominant path', direction: 'dn' as const },
  { label: 'BAR (20 exchanges)', value: '−0.018', sub: 'Net sell pressure', direction: 'dn' as const },
];

export const polymarketToday = [
  { label: '< $66K', pct: 1.5, barWidth: 2, tier: 'tiny' as const },
  { label: '$66–68K', pct: 1.1, barWidth: 3, tier: 'tiny' as const },
  { label: '$68–70K', pct: 16.0, barWidth: 27.8, tier: 'mid' as const },
  { label: '$70–72K', pct: 57.5, barWidth: 100, tier: 'peak' as const, peak: true },
  { label: '$72–74K', pct: 20.5, barWidth: 35.7, tier: 'high' as const },
  { label: '$74–76K', pct: 2.4, barWidth: 7, tier: 'low' as const },
  { label: '> $76K', pct: 0.7, barWidth: 1.5, tier: 'tiny' as const },
];

export const polymarketFriday = [
  { label: 'Above $60K', pct: 98.6, barWidth: 98.6, tier: 'peak' as const },
  { label: 'Above $66K', pct: 93.5, barWidth: 93.5, tier: 'high' as const },
  { label: 'Above $70K', pct: 64, barWidth: 64, tier: 'mid' as const },
  { label: 'Above $72K', pct: 41, barWidth: 41, tier: 'low' as const },
  { label: 'Above $74K', pct: 21, barWidth: 21, tier: 'low' as const },
  { label: 'Above $76K', pct: 8, barWidth: 8, tier: 'tiny' as const },
];

export const scenarios = [
  {
    trigger: "Scenario A — Fractal Resolves Lower (Base Case)",
    body: "BTC begins to lose momentum from the $71.2K level. If price fails to reclaim $73K+ on volume by Thursday, the weighted average path to $72K becomes the dominant near term narrative — validating both the Polymarket crowd and setting up the second leg toward $65.5K then $53.3K.",
    watchLevel: "Watch $68K as the first confirmation level.",
  },
  {
    trigger: "Scenario B — Crowd is Right, Fractal Delays (Alternative)",
    body: "BTC consolidates in the $70–74K zone this week, crowd confirms. The fractal's 60 day resolution clock starts ticking from a lower base. The green line path is delayed but not invalidated — the setup just reprices from a lower entry.",
    watchLevel: "Watch $74K close as the scenario B trigger.",
  },
  {
    trigger: "Scenario C — Fractal Invalidated (Bull Case, Low Probability)",
    body: "A sustained weekly close above $78K on high volume with positive BAR would suggest the historical analog is breaking down and a new ATH run is possible. At that point, the crowd's view is overly bearish and needs to reprice upward. Probability given current BAR readings: ~12%.",
    watchLevel: '',
  },
];
