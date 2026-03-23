/* ── Chart & table data for Crude Doctrine report ── */

export const cascadeChartData = {
  days: Array.from({ length: 101 }, (_, i) => i),
  base: (days: number[]) =>
    days.map((d) => {
      if (d === 0) return 82;
      if (d <= 14) return 82 + (d / 14) * 13;
      if (d <= 35) return 95 + ((d - 14) / 21) * 20;
      if (d <= 60) return 115 + ((d - 35) / 25) * 30;
      if (d <= 90) return 145 + ((d - 60) / 30) * 40;
      return 185 - ((d - 90) / 10) * 10;
    }),
  bull: (days: number[]) =>
    days.map((d) => {
      if (d === 0) return 82;
      if (d <= 14) return 82 + (d / 14) * 16;
      if (d <= 35) return 98 + ((d - 14) / 21) * 26;
      if (d <= 60) return 124 + ((d - 35) / 25) * 38;
      if (d <= 90) return 162 + ((d - 60) / 30) * 40;
      return 200 - ((d - 90) / 10) * 6;
    }),
  bear: (days: number[]) =>
    days.map((d) => {
      if (d === 0) return 82;
      if (d <= 14) return 82 + (d / 14) * 9;
      if (d <= 35) return 91 + ((d - 14) / 21) * 12;
      if (d <= 60) return 103 + ((d - 35) / 25) * 19;
      if (d <= 90) return 122 + ((d - 60) / 30) * 23;
      return 140 - ((d - 90) / 10) * 14;
    }),
};

export const supplyGapData = {
  labels: [
    'Total Gap',
    'US SPR',
    'IEA SPR',
    'Saudi Bypass',
    'Non-Gulf OPEC+',
    'Russia / Caspian',
    'Net Uncovered',
  ],
  values: [21, 1.5, 0.5, 1.8, 1.2, 0.8, 15.2],
};

export const bufferData = {
  days: [0, 5, 10, 14, 20, 25, 30, 40, 50, 60, 75, 90],
  floatingStorage: [68, 55, 40, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  sprAvailable: [350, 343, 336, 329, 314, 299, 284, 254, 224, 194, 149, 104],
};

export const assetImpactData = {
  labels: [
    'Brent Crude',
    'Natural Gas',
    'Gold',
    'USD Index',
    'S&P 500',
    'JPY/USD',
    'Airlines',
    'Defense',
    'EM Equities',
  ],
  values: [52, 38, 14, 8, -18, -12, -42, 28, -24],
};

export const originalProbData = {
  labels: [
    'De-escalation / No Closure (35%)',
    'Brief Disruption <21d (20%)',
    'Partial / Extended 30-60d (30%)',
    'Full Closure 60-90d (12%)',
    'Systemic War 90d+ (3%)',
  ],
  values: [35, 20, 30, 12, 3],
};

export const revisedProbData = {
  labels: [
    'De-escalation / No Closure (0%)',
    'Swift Ceasefire by D35 (15%)',
    'Partial / Extended 45-75d (45%)',
    'Full Closure 75-100d (20%)',
    'Systemic War 100d+ (20%)',
  ],
  values: [0.5, 15, 45, 20, 20],
};

export const strikeLog = [
  { day: 'D1', date: 'Mar 1', question: 'US/Israel strike Iran on March 1, 2026?', resolution: 'YES', volume: '$1.55M', phase: 'Phase 1 — Risk Premium' },
  { day: 'D2', date: 'Mar 2', question: 'US/Israel strike Iran on March 2, 2026?', resolution: 'YES', volume: '$2.11M', phase: 'Phase 1 — Risk Premium' },
  { day: 'D3', date: 'Mar 3', question: 'US/Israel strike Iran on March 3, 2026?', resolution: 'YES', volume: '$2.13M', phase: 'Phase 1 — Risk Premium' },
  { day: 'D4', date: 'Mar 4', question: 'US/Israel strike Iran on March 4, 2026?', resolution: 'YES', volume: '$1.20M', phase: 'Phase 1 — Risk Premium' },
  { day: 'D5-10', date: 'Mar 5-10', question: 'US/Israel strike Iran on [date], 2026?', resolution: 'YES x 6', volume: '~$2.0M total', phase: 'Phase 1 > Phase 2' },
  { day: 'D14', date: '~Mar 14', question: 'Floating storage buffer exhausted (model)', resolution: 'PHASE 2', volume: '—', phase: 'SPR Offset begins' },
  { day: 'D22', date: 'Mar 23', question: 'TODAY — Phase 2/3 transition zone', resolution: 'LIVE', volume: 'ACTIVE', phase: 'Phase 2 > 3', isToday: true },
];

export const phases = [
  {
    num: '01',
    name: 'Risk Premium',
    days: 'Day 1-14',
    brent: '$80-95',
    mechanism:
      'War risk premium injected instantaneously. Insurance markets seize on Persian Gulf tanker coverage. Physical supply still covered by ~68M bbl floating storage (~12 days). Futures curve goes into sharp backwardation. Shipping rates spike 400-600% within 72 hours.',
    status: 'PASSED',
    statusType: 'green' as const,
  },
  {
    num: '02',
    name: 'SPR Offset',
    days: 'Day 15-35',
    brent: '$95-115',
    mechanism:
      'Floating buffer exhausted ~Day 14. IEA coordinates SPR release (~2 mb/d across member states) — covers only 12-15% of the ~14 mb/d net supply gap. US SPR at historically depleted levels. Asian refiners begin rationing feedstock allocation. Saudi/UAE offline or restricted.',
    status: 'ACTIVE NOW',
    statusType: 'amber' as const,
  },
  {
    num: '03',
    name: 'Structural Shortage',
    days: 'Day 35-60',
    brent: '$115-145',
    mechanism:
      'Physical shortfalls materialize at the refinery gate in Asia-Pacific. Japan and South Korea begin mandatory power rationing. India refinery utilization drops to 60%. China activates SPRs at state discretion. LNG prices simultaneously spike. Crack spreads blow out to $40+.',
    status: 'APPROACHING D35',
    statusType: 'outline' as const,
  },
  {
    num: '04',
    name: 'Panic Pricing',
    days: 'Day 60-90',
    brent: '$140-185',
    mechanism:
      'SPR depletion fears cascade into sovereign hoarding. Atlantic Basin crudes trade at unprecedented premiums. Demand destruction begins above $130 — industrial shutdowns, air travel collapse, recession signals — but supply fear momentum overshoots. CTA/momentum funds accelerate the move.',
    status: 'D60-90 FORECAST',
    statusType: 'outline' as const,
  },
  {
    num: '05',
    name: 'Equilibrium',
    days: 'Day 90-100+',
    brent: '$150-200',
    mechanism:
      'Dynamic balance between accelerating demand destruction and residual supply fear. Spikes to $200 unsustainable — at that level GDP contraction of 3-5% destroys demand faster than supply is removed. Price determined entirely by geopolitical news flow.',
    status: 'D90+ FORECAST',
    statusType: 'outline' as const,
  },
];

export const timeline = [
  {
    date: 'H2 2025',
    title: 'First Kinetic Episode',
    badge: 'POLYMARKET CONFIRMED',
    badgeType: 'confirmed' as const,
    price: 'Brent: Elevated',
    detail:
      'US military action against Iran in H2 2025 — resolved YES on Polymarket ($1.18M volume, Jan 1, 2026 resolution). This is Strike Campaign #1. March 2026 is Strike Campaign #2.',
  },
  {
    date: 'Feb 17-26',
    title: 'Diplomatic Contact — Switzerland',
    badge: 'POLYMARKET CONFIRMED',
    badgeType: 'confirmed' as const,
    price: 'Brent: $82 (pre-campaign)',
    detail:
      'Polymarket opens "Where will US-Iran meet?" cluster Feb 17 ($379K volume). Meeting confirmed in Switzerland Feb 26. The crowd anticipated the diplomatic track 9 days early. Result: no de-escalation agreement. Strikes follow 3 days later.',
  },
  {
    date: 'Mar 1-10',
    title: '10 Day Sustained Strike Campaign',
    badge: 'POLYMARKET CONFIRMED',
    badgeType: 'confirmed' as const,
    price: 'Brent: $82 > ~$95 (+15.9%)',
    detail:
      'All 10 daily Polymarket markets resolve YES ($7M total volume). Campaign represents the largest sustained US/Israel military action against Iran on record. Floating storage absorbs the initial physical gap.',
  },
  {
    date: '~Mar 14',
    title: 'Floating Storage Exhausted — Critical Inflection',
    badge: 'PASSED',
    badgeType: 'default' as const,
    price: 'Brent: ~$95-100',
    detail:
      'The ~68M bbl floating storage buffer depletes after ~12-14 days. The market transitions from geopolitical risk pricing to physical shortage pricing. IEA emergency meeting convened. Coordinated SPR release announced.',
  },
  {
    date: 'Mar 23 / Day 22',
    title: 'Today — Phase 2: SPR Offset Zone',
    badge: 'YOU ARE HERE',
    badgeType: 'active' as const,
    price: 'Brent: Est. $95-108',
    isActive: true,
    detail:
      'SPR release is the active supply response. Asian refiners rationing feedstock. Switzerland channel presumably still open. The next 13 days (Days 22-35) are the pivot point.',
  },
  {
    date: '~Apr 4 / Day 35',
    title: 'Phase 3 Onset — Structural Shortage',
    badge: '',
    badgeType: 'default' as const,
    price: 'Forecast: $115-145',
    isForecast: true,
    detail:
      'Physical shortfalls emerge at Asia-Pacific refinery gates. Japan, South Korea begin mandatory industrial power rationing. India at 60% refinery utilization. LNG prices spike simultaneously.',
  },
  {
    date: '~May 1 / Day 60',
    title: 'Phase 4 Onset — Panic Pricing',
    badge: '',
    badgeType: 'default' as const,
    price: 'Forecast: $140-185',
    isForecast: true,
    detail:
      'SPR depletion fears. Sovereign hoarding. Atlantic Basin crude at unprecedented premiums. Demand destruction ($130 threshold) racing against supply fear momentum. Confirmed recession in Eurozone and major Asian economies.',
  },
];

export const scenarios = [
  {
    type: 'bear' as const,
    label: 'Scenario A — Swift Ceasefire (Revised: 15%)',
    title: 'SWITZERLAND SAVES IT',
    price: '$90',
    prob: 'Probability: 15% (down from 20%) | Resolution by Day 35',
    points: [
      'Switzerland channel produces ceasefire by Day 30-35',
      'Iran accepts face-saving formula on nuclear program',
      'Brent correction: -$20-30 within 72 hours',
      'SPR released barrels re-enter market; backwardation collapses',
      'Duration premium evaporates faster than supply premium built',
      'End-state: $80-92 range, elevated but declining',
    ],
  },
  {
    type: 'base' as const,
    label: 'Scenario B — Partial/Extended 45-75 Days (Revised: 45%)',
    title: 'BASE CASE: LONG GRIND',
    price: '$140',
    prob: 'Probability: 45% (up from 30%) | Duration: 45-75 days',
    points: [
      'Partial Hormuz closure via mine/drone harassment, not full blockade',
      'US Navy escorts resume limited traffic by ~Day 40',
      'IEA SPR covers partial gap; global recession signals emerge',
      'Switzerland produces ceasefire framework around Day 60-75',
      'Slow normalization; Brent settles in $100-120 post-resolution',
      'Permanent supply route diversification investment accelerates',
    ],
  },
  {
    type: 'bull' as const,
    label: 'Scenario C — Full Closure / Systemic War (Revised: 20%)',
    title: 'IRAN GOES ALL IN',
    price: '$185+',
    prob: 'Probability: 20% (up from 12%) | Duration: 90+ days',
    points: [
      'Iran deploys full naval interdiction in retaliation for sustained strikes',
      'Zero Hormuz throughput achieved Days 20-90',
      'Saudi/UAE infrastructure targeted by cruise missiles',
      'US military intervention escalates; Switzerland channel collapses',
      'SPR globally exhausted by Day 60; demand destruction ceiling ~$200',
      'Global recession confirmed; energy transition permanently accelerated',
    ],
  },
];

export const chokepoints = [
  {
    name: 'Strait of Hormuz',
    volume: '21.0 MB/D — Primary Trigger — Active Disruption',
    color: 'red' as const,
    fillPct: 100,
    rows: [
      ['Width at Narrowest', '33 km'],
      ['Bypass Capacity', '~2-3 MB/D (partial)'],
      ['Alternative Route', 'IPSA / Abu Dhabi East-West'],
      ['Military Control', 'IRGC Navy'],
      ['Price Multiplier', 'x3.8 (historical avg)'],
    ],
  },
  {
    name: 'Suez Canal',
    volume: '9.5 MB/D — Secondary Risk — Houthi Disruption Ongoing',
    color: 'amber' as const,
    fillPct: 60,
    rows: [
      ['Throughput (Oil)', '~5.5 MB/D oil equiv.'],
      ['Bypass Route', 'Cape of Good Hope (+9 days)'],
      ['Vulnerability', 'Sinai / Red Sea conflict'],
      ['Current Status', 'Houthi disruption ongoing'],
      ['Price Multiplier', 'x1.4'],
    ],
  },
  {
    name: 'Strait of Malacca',
    volume: '16.0 MB/D — Asia Demand Channel',
    color: 'red' as const,
    fillPct: 75,
    rows: [
      ['Throughput', '16 MB/D (oil + LNG)'],
      ['Primary Users', 'China, Japan, South Korea'],
      ['Bypass Capacity', 'Limited (Lombok / Sunda)'],
      ['Risk Factor', 'Piracy / China-Taiwan scenario'],
      ['Price Multiplier', 'x2.1'],
    ],
  },
  {
    name: 'Turkish Straits',
    volume: '3.0 MB/D — Caspian Route',
    color: 'blue' as const,
    fillPct: 25,
    rows: [
      ['Throughput', '~3 MB/D Caspian crude'],
      ['Bypass Route', 'BTC Pipeline to Ceyhan'],
      ['Political Complexity', 'High (Montreux Convention)'],
      ['Russia Factor', 'Novorossiysk alternative'],
      ['Price Multiplier', 'x0.8'],
    ],
  },
];
