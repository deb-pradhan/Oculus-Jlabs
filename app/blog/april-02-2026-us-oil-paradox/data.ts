/* ================================================================
   Data for "The American Oil Paradox" — April 2, 2026
   All chart data extracted from the interactive HTML report.
   ================================================================ */

/* ── Hero KPI strip ── */
export const heroStats = [
  { label: 'Crude Production', value: '13.6M', sub: 'b/d — all time record, world #1', direction: 'up' as const },
  { label: 'Petroleum Exports', value: '11.0M', sub: 'b/d total petroleum exports, 2025', direction: 'up' as const },
  { label: 'Petroleum Imports', value: '8.4M', sub: 'b/d — lowest since 1971', direction: 'dn' as const },
  { label: 'Trade Surplus', value: '$59B', sub: 'petroleum trade surplus, 2024', direction: 'up' as const },
];

/* ── Ticker bar items ── */
export const tickerItems = [
  { label: 'WTI CRUDE', value: '$94.20', note: '+38% MTD', dir: 'up' as const },
  { label: 'BRENT', value: '$97.80', note: 'Peak $126', dir: 'up' as const },
  { label: 'US PRODUCTION', value: '13.6M b/d', note: 'World #1', dir: 'up' as const },
  { label: 'RECESSION ODDS', value: '32.5%', note: 'Polymarket', dir: 'dn' as const },
  { label: 'BITCOIN', value: '~$66–67k', note: 'Range bound', dir: 'dn' as const },
  { label: '10Y TREASURY', value: '4.6%', note: 'Yield rising', dir: 'dn' as const },
  { label: 'S&P 500', value: 'Est. −12%', note: 'Off peak', dir: 'dn' as const },
  { label: 'HORMUZ STATUS', value: 'CLOSED', note: 'Since Mar 2', dir: 'dn' as const },
];

/* ── Section I: Historical Arc chart ── */
export const histLabels = [
  '2000','2002','2004','2005','2006','2008','2010','2012',
  '2014','2015','2016','2018','2019','2020','2021','2022','2023','2024','2025',
];
export const histImports = [11.5,11.4,12.8,14.0,13.7,12.9,11.8,10.6,9.2,9.0,8.9,9.0,9.1,7.9,8.5,8.3,8.5,8.4,8.1];
export const histExports = [1.0,1.0,1.1,1.1,1.2,1.8,2.2,3.2,4.2,4.8,5.2,7.5,8.5,8.5,9.2,9.5,10.2,10.8,11.0];
export const histProduction = [5.8,5.7,5.4,5.1,5.1,5.0,5.5,6.5,8.7,9.4,8.8,10.9,12.9,11.3,11.2,12.0,12.9,13.3,13.6];

export const histAnnotations = [
  { label: '2005: Import peak (14M b/d)', x: '2005' },
  { label: '2008: Fracking ramps up', x: '2008' },
  { label: '2015: Export ban lifted', x: '2015' },
  { label: '2018: US becomes #1 producer', x: '2018' },
  { label: '2020: Net exporter for first time', x: '2020' },
  { label: '2022: Ukraine war shifts flows', x: '2022' },
  { label: '2025: Record production, exports dip', x: '2025' },
];

/* ── Supplier switch chart ── */
export const supplierLabels = ['2006','2008','2010','2012','2014','2016','2018','2020','2022','2024'];
export const supplierOPEC = [4.8,4.5,3.8,3.5,3.2,2.8,2.5,1.8,1.5,1.3];
export const supplierCanada = [2.3,2.5,2.5,2.8,3.4,3.8,4.3,4.0,4.3,4.1];
export const supplierOthers = [4.2,4.2,3.9,3.6,3.2,2.9,2.8,2.5,2.4,2.4];

/* ── Import sources pie ── */
export const importPieLabels = ['Canada (61.7%)','Mexico (7.1%)','Saudi Arabia (4%)','Iraq (3.1%)','Brazil (3.4%)','Others (20.7%)'];
export const importPieData = [61.7,7.1,4,3.1,3.4,20.7];
export const importPieColors = ['#1a3a5c','#2d5a8b','#4a7aab','#6a9abb','#8ab5cc','#bbb'];

/* ── Export product mix pie ── */
export const exportPieLabels = ['Crude oil (38%)','Propane/HGL (23%)','Distillate/diesel (12%)','Motor gasoline (10%)','Jet fuel (2%)','Other products (15%)'];
export const exportPieData = [38,23,12,10,2,15];
export const exportPieColors = ['#1a3a5c','#c94a00','#1a5c2e','#6b4200','#7777bb','#888'];

/* ── Export destinations grouped bar ── */
export const exportDestLabels = ['Europe (total)','India','South Korea','Netherlands','Mexico','Japan','Nigeria','China'];
export const exportDest2024 = [1820,260,300,200,420,120,40,460];
export const exportDest2025 = [1700,350,310,280,410,200,110,50];

export const countryShiftsDown = [
  { name: 'China: ↓ 89%', detail: 'Shifted to Russian & Malaysian crude' },
  { name: 'Singapore: ↓ 75%', detail: 'Entrepot volumes collapsed' },
  { name: 'UK: ↓ 35% (~100k b/d)', detail: 'OPEC replaced US volumes' },
];
export const countryShiftsUp = [
  { name: 'India: +90k b/d', detail: 'Replaced Russian crude in 2025' },
  { name: 'Japan: +80k b/d', detail: 'Diversifying from Gulf' },
  { name: 'Nigeria: +70k b/d', detail: 'Dangote refinery opened Jan 2024' },
];

/* ── Net trade chart ── */
export const netTradeLabels = ['Crude oil\n(still net importer)','Petroleum\nproducts','Propane\n& HGL','Total\npetroleum'];
export const netTradeExports = [4.0,4.5,2.5,11.0];
export const netTradeImports = [6.2,2.0,0.2,8.4];

/* ── Infrastructure cards ── */
export interface InfraItem {
  name: string;
  status: string;
  statusColor: 'red' | 'amber' | 'green';
  pct: number;
  gaugeLabel: string;
  gaugeColor: string;
  note: string;
  notBuilt?: boolean;
}
export const infraCards: InfraItem[] = [
  {
    name: 'Permian → Corpus Christi Pipelines',
    status: '99% Full',
    statusColor: 'red',
    pct: 99,
    gaugeLabel: 'Current utilization',
    gaugeColor: '#8b1a1a',
    note: 'No new greenfield pipeline under active development. When Permian exceeds 6.5M b/d (2026–27), apportionment will cut export volumes 10–20%.',
  },
  {
    name: 'Enbridge Ingleside Energy Center',
    status: '~85%',
    statusColor: 'amber',
    pct: 85,
    gaugeLabel: 'Handles ~25% of all Gulf exports',
    gaugeColor: '#c94a00',
    note: '3 VLCC capable berths. Largest US crude export facility. Can partially load VLCCs (~1.35M barrels). Uses reverse lightering offshore for full loads.',
  },
  {
    name: 'South Texas Gateway',
    status: '~80%',
    statusColor: 'amber',
    pct: 80,
    gaugeLabel: '800k b/d, expandable to 1M',
    gaugeColor: '#c94a00',
    note: 'Second largest export terminal. Same VLCC constraints as Ingleside — requires reverse lightering for full 2M barrel VLCC loads.',
  },
  {
    name: 'LOOP (Louisiana)',
    status: 'Only Full VLCC Port',
    statusColor: 'green',
    pct: 35,
    gaugeLabel: '~35% of capacity used for exports',
    gaugeColor: '#1a5c2e',
    note: 'The ONLY US facility that can fully load a VLCC. Historically used for imports. Has potential to expand export role.',
  },
  {
    name: 'Enterprise SPOT Terminal',
    status: 'Not Built',
    statusColor: 'red',
    pct: 0,
    gaugeLabel: 'Licensed April 2024 — no FID',
    gaugeColor: '#ccc',
    note: 'Anchor customer Chevron withdrew. Enterprise cites insufficient customer commitments. Earliest possible construction start: 2027. First cargoes: 2029 at earliest.',
    notBuilt: true,
  },
  {
    name: 'Texas GulfLink',
    status: 'Not Built',
    statusColor: 'red',
    pct: 0,
    gaugeLabel: 'Licensed January 2026 — no FID',
    gaugeColor: '#ccc',
    note: 'Located 30.5 miles offshore Texas. Would reduce emissions 86% vs reverse lightering. No final investment decision. Demand was insufficient pre Hormuz — crisis may change calculus.',
    notBuilt: true,
  },
];

/* ── VLCC cost chart ── */
export const vlccLabels = [
  'Middle East → Asia\n(VLCC, direct)',
  'US Gulf → Europe\n(Suezmax/Aframax)',
  'US Gulf → Asia\n(VLCC via LOOP)',
  'US Gulf → Asia\n(Reverse lightering)',
  'US Gulf → Asia\n(Partial load + topping)',
];
export const vlccCosts = [1.2, 2.0, 2.4, 3.8, 3.2];
export const vlccColors = ['#1a5c2e','#2d7a6e','#6b4200','#8b1a1a','#c94a00'];

/* ── Supply gap visualization ── */
export const supplyGapRows = [
  {
    label: 'Asia total oil consumption (annual)',
    total: '~30M b/d',
    segments: [
      { pct: 53, color: '#1a3a5c', text: 'Already supplied (non Gulf)' },
      { pct: 33, color: '#8b1a1a', text: 'Gulf sourced — DISRUPTED' },
      { pct: 14, color: '#6b4200', text: 'Other supply' },
    ],
  },
  {
    label: 'US total petroleum exports (2025)',
    total: '11M b/d',
    segments: [
      { pct: 36, color: '#1a5c2e', text: 'Crude oil (4.0M)' },
      { pct: 28, color: '#2d7a4a', text: 'Products + HGL (7M)' },
      { pct: 36, color: '#2d5a8b', text: 'Already going to Americas/Europe buyers' },
    ],
  },
  {
    label: 'US crude realistically deliverable to Asia today',
    total: '~1.5–2.5M b/d',
    segments: [
      { pct: 8, color: '#1a5c2e', text: 'Current Asia flows' },
      { pct: 5, color: '#6b9a6b', text: 'Surge possible' },
      { pct: 87, color: '#e0ddd8', text: 'Infrastructure ceiling', textColor: '#999' },
    ],
  },
  {
    label: "Asia's supply gap from Hormuz closure",
    total: '~10–16M b/d',
    segments: [
      { pct: 13, color: '#1a5c2e', text: 'US fills this' },
      { pct: 87, color: '#f5e6e6', text: 'Unfilled — requires SPR releases, demand destruction, OPEC spare capacity', textColor: '#8b1a1a' },
    ],
  },
];

/* ── Gulf dependence by country ── */
export const gulfDepLabels = ['Japan','South Korea','India','China','EU (avg)','UK','USA'];
export const gulfDepData = [85,72,50,35,25,18,8];
export const gulfDepColors = ['#8b1a1a','#8b1a1a','#c94a00','#c94a00','#6b4200','#6b4200','#1a5c2e'];

/* ── Transmission chain chart ── */
export const transmissionLabels = ['Oil price\nspike (+$32/b)','CPI inflation\nimpact','GDP growth\nimpact','Recession\nprobability','Fed policy\nspace'];
export const transmissionData = [51.6, 1.1, -0.64, 12.5, -100];
export const transmissionColors = ['#c94a00','#8b1a1a','#8b1a1a','#8b1a1a','#6b4200'];
export const transmissionTooltips = [
  '+$32/barrel above pre crisis',
  '+1.1 percentage points to CPI',
  '−0.64 percentage points from GDP',
  'Recession risk now 32.5%',
  'Fed effectively frozen',
];

/* ── Sector chart ── */
export const sectorLabels = ['Energy E&P','LNG','Defense','TIPS','S&P 500\nbroad','Consumer\nDisc.','Tech\nGrowth','Airlines','Chemicals'];
export const sectorData = [45, 38, 22, 15, -8, -18, -15, -65, -28];

/* ── Bond chart ── */
export const bondLabels = ['2Y Treasury\n(Fed pinned)','5Y Treasury','10Y Treasury','30Y Treasury','TIPS 10Y','IG Corp\nspread (bps)','HY/Junk\nspread (bps)'];
export const bondPreCrisis = [3.8, 3.9, 4.2, 4.4, 1.8, 90, 320];
export const bondCurrent = [3.9, 4.3, 4.8, 5.1, 2.1, 145, 520];

/* ── Crypto (BTC) chart ── */
export const btcStrikes = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
export const btcProbs = [99.95, 99.85, 97.45, 68.5, 3.5, 0.25, 0.05, 0.05, 0.05, 0.05, 0.05];

/* ── Polymarket cards ── */
export const polyCards = [
  {
    label: 'US Recession by End 2026',
    value: '32.5%',
    valueColor: '#8b1a1a',
    desc: "Goldman Sachs raised 12 month recession odds to 30% following February's payroll shock (−92,000 jobs). Fed at 3.5–3.75%. March CPI on April 10 is next catalyst.",
    source: '$1.02M total volume · 24h vol: $35.5k · Last trade: 0.32',
  },
  {
    label: 'Bitcoin Price Today (Apr 2)',
    value: '~$66–67k',
    valueColor: '#1a3a5c',
    desc: 'Above $64k: 97.5% · Above $66k: 68.5% · Above $68k: 3.5% · Above $70k: 0.25%. Market is tightly clustered in the $66–68k range with very little upside priced.',
    source: '$3.67M weekly volume · 10 active strike prices · Most liquid market',
  },
  {
    label: 'WTI in April 2026',
    value: '$110+ = 86%',
    valueColor: '#c94a00',
    desc: 'WTI hits $110 in April: 86% · $120: 51.5% · $130: 30.5% · $140: 17.5% · $150: 9.5% · $200: 1.6%. Already hit $100 (99.9%). Low side: drops to $80 = 19.5%.',
    source: '$2.78M total volume · $929k in 24h · Highly active',
  },
];

/* ── WTI distribution chart ── */
export const wtiDistLabels = ['$90↑','$100↑','$110↑','$120↑','$130↑','$140↑','$150↑','$160↑','$170↑','$200↑','$80↓','$70↓','$60↓'];
export const wtiDistData = [100, 99.9, 86, 51.5, 30.5, 17.5, 9.5, 5.25, 3.05, 1.55, 19.5, 5.5, 1.55];
export const wtiDistColors = [
  '#1a5c2e','#1a5c2e','#2d7a6e','#6b4200','#c94a00',
  '#8b1a1a','#8b1a1a','#8b1a1a','#8b1a1a','#8b1a1a',
  '#2d5a8b','#2d5a8b','#2d5a8b',
];

/* ── Oil price journey chart ── */
export const oilPriceLabels = ['Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26'];
export const oilPrices = [77, 76, 74, 69, 67, 65, 63, 61, 60, 62, 64, 66, 68, 80, 118];
export const oilAnnotations = [
  { x: 3, y: 69, text: 'Tariff shock\n−$10/b' },
  { x: 9, y: 62, text: 'OPEC+ floods\nmarket' },
  { x: 12, y: 68, text: 'Hormuz\ntensions build' },
  { x: 14, y: 118, text: 'Hormuz\nCLOSED' },
];

/* ── Scenario builder radar default ── */
export const radarLabels = ['S&P 500\nimpact','Oil price\nlevel','BTC price\nrisk','Bond yields','Recession\nprob','Inflation\npressure'];
export const radarDefaults = [50, 70, 40, 65, 32, 60];

/* ── Scenario matrix chart ── */
export const scenMatrixLabels = ['S&P 500\nchange','10Y yield\ntarget (%)','BTC range\n(midpoint $k)','Recession\nprob (%)','Oil duration\n(months)'];
export const scenFast = [-5, 4.1, 80, 25, 1];
export const scenModerate = [-12, 4.8, 57, 48, 8];
export const scenProlonged = [-28, 5.2, 38, 65, 18];

/* ── Scenario summary cards ── */
export const scenarioCards = [
  {
    variant: 'green' as const,
    title: 'Fast reopening (<4 wks) — 35% prob',
    body: 'S&P +8–12% · BTC $75–85k · Oil falls to $70–80 · Fed resumes easing path',
  },
  {
    variant: 'amber' as const,
    title: 'Moderate (1–3 months) — 45% prob',
    body: 'S&P −10–15% · BTC $45–65k · Oil $90–110 sustained · Recession odds hit 50%',
  },
  {
    variant: 'red' as const,
    title: 'Prolonged (3+ months) — 20% prob',
    body: 'S&P −25–35% · BTC $30–45k then potential surge on Fed pivot · Recession confirmed',
  },
];

/* ── Equities tab asset cards ── */
export interface AssetCardData {
  title: string;
  badge: string;
  badgeType: 'up' | 'dn' | 'neutral';
  borderColor: string;
  body: string;
}

export const equityCards: AssetCardData[] = [
  {
    title: 'US Energy Producers (E&P)',
    badge: 'WINNER',
    badgeType: 'up',
    borderColor: '#1a5c2e',
    body: 'ExxonMobil, ConocoPhillips, EOG, Devon, Pioneer. Each $10/barrel increase in WTI adds $500M–$2B in annual earnings for major producers. At $94–$126/barrel with record 13.6M b/d production, margins are historic. Energy ETF (XLE, XOP) is the clearest equity trade in this environment.',
  },
  {
    title: 'LNG Exporters & Oilfield Services',
    badge: 'WINNER',
    badgeType: 'up',
    borderColor: '#1a5c2e',
    body: 'Cheniere Energy surges as Qatar declares force majeure on all LNG contracts. The world scrambles for US LNG. Halliburton, SLB, Baker Hughes see elevated drilling demand as $90+ oil makes new wells economically compelling. US rig count at 414 (down from 500) could recover sharply.',
  },
  {
    title: 'Defense Contractors',
    badge: 'WINNER',
    badgeType: 'up',
    borderColor: '#1a5c2e',
    body: 'Lockheed Martin, RTX, Northrop, General Dynamics benefit from the US Israel Iran conflict. Multi year procurement cycles are being triggered. Congress likely approves emergency supplementals. Defense ETF (ITA) outperforms in this geopolitical environment.',
  },
  {
    title: 'Airlines, Shipping, Transports',
    badge: 'LOSER',
    badgeType: 'dn',
    borderColor: '#8b1a1a',
    body: 'Jet fuel and diesel prices have doubled since the Hormuz closure. Multiple Asian carriers have already canceled routes. Delta, United, and American face acute margin compression. Shipping companies face 10–14 day rerouting delays and insurance cost spikes. Transport ETF (IYT) at significant risk.',
  },
  {
    title: 'Consumer Discretionary & Growth Tech',
    badge: 'LOSER',
    badgeType: 'dn',
    borderColor: '#8b1a1a',
    body: 'Higher fuel costs reduce consumer spending power. Amazon, Target face supply chain cost spikes. Tech valuation compression hits when inflation forces the Fed to hold rates. At 32.5% recession probability, the risk premium on long duration growth stocks rises significantly.',
  },
  {
    title: 'Broad S&P 500 — Net negative',
    badge: 'MIXED',
    badgeType: 'neutral',
    borderColor: '#6b4200',
    body: 'Energy is only ~4% of the S&P 500. Energy sector gains are arithmetically overwhelmed by damage to the other 96%. Historical analog: 1973 oil embargo — S&P down 48%. 1979 Iranian Revolution — S&P down 27%. Current estimate: 10–20% drawdown risk if Hormuz stays closed 60+ days.',
  },
];

export const bondCards: AssetCardData[] = [
  {
    title: 'TIPS (Inflation Protected)',
    badge: 'WINNER',
    badgeType: 'up',
    borderColor: '#1a5c2e',
    body: 'Treasury Inflation Protected Securities adjust principal to CPI. With oil adding 0.5–1.5% to headline CPI, TIPS outperform nominal Treasuries in virtually every Hormuz scenario. iShares TIP ETF is the textbook trade. Real yields compress as nominal compensation rises.',
  },
  {
    title: 'High Yield / Junk Bonds',
    badge: 'LOSER',
    badgeType: 'dn',
    borderColor: '#8b1a1a',
    body: 'At 32.5% recession probability, credit spreads widen sharply. Airline, shipper, and consumer company junk debt faces acute distress. HYG and JNK spreads likely blow out 150–300 basis points from pre crisis levels of ~320bps. Avoid.',
  },
  {
    title: 'Long Nominal Treasuries',
    badge: 'CONFLICTED',
    badgeType: 'neutral',
    borderColor: '#6b4200',
    body: 'Inflation pressure (bad for bonds) fights recession fear (flight to safety, good for bonds). Net: 10 year yield drifts from 4.2% pre crisis toward 4.5–5.0%. Short end is pinned by Fed at 3.5–3.75%. Yield curve steepens. Long duration bonds underperform TIPS.',
  },
  {
    title: 'The Fed Policy Trap',
    badge: 'WATCH',
    badgeType: 'neutral',
    borderColor: '#8b1a1a',
    body: "Fed cannot cut (CPI ~3.4% and rising) or hike (32.5% recession risk). Classic 1970s stagflation paralysis. The critical catalyst: March CPI on April 10, then Q1 GDP advance estimate. February payrolls already showed −92,000 — first monthly loss in years. If unemployment rises sharply, Fed may cut regardless of inflation signal.",
  },
];

export const cryptoCards: AssetCardData[] = [
  {
    title: 'Bitcoin — Two competing narratives',
    badge: 'CONFLICTED',
    badgeType: 'neutral',
    borderColor: '#6b4200',
    body: "Currently ~$66–67k (Polymarket: 68.5% probability above $66k, 3.5% above $68k). The \"digital gold\" thesis (BTC wins in inflation/dollar debasement) fights the \"risk asset\" thesis (BTC falls with equities in recessions). The 2022 precedent — oil spike + tightening took BTC from $68k to $16k — is impossible to dismiss.",
  },
  {
    title: 'The Stagflation Precedent Is Bad for Crypto',
    badge: 'RISK',
    badgeType: 'dn',
    borderColor: '#8b1a1a',
    body: 'In April 2025, the tariff shock triggered a sharp crypto selloff. Risk off events force leveraged crypto positions to be unwound. At 32.5% recession probability, downside scenario: BTC tests $45–55k. Altcoins face 50–70% declines. DeFi TVL halves. Liquidation cascades.',
  },
  {
    title: 'What Would Drive a BTC Rally',
    badge: 'BULL CASE',
    badgeType: 'up',
    borderColor: '#1a5c2e',
    body: 'Fed pivots to rate cuts in H2 2026 (likely if recession materializes) → dollar weakness → BTC rips. Emergency fiscal spending → debasement narrative strengthens. Hormuz reopens quickly → risk on returns → BTC targets $75–85k. Spot Bitcoin ETF flows provide structural bid throughout.',
  },
  {
    title: 'Altcoins and DeFi',
    badge: 'AVOID',
    badgeType: 'dn',
    borderColor: '#8b1a1a',
    body: 'ETH, SOL, and altcoins have zero inflation hedge narrative. They are pure risk assets. In a 32.5% recession probability environment, they reprice with the same logic as high yield corporate debt: rising default risk, tightening liquidity. Leveraged DeFi positions face cascade risk. Avoid entirely in acute stagflation.',
  },
];
