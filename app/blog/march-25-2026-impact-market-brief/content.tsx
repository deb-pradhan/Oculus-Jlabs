'use client';

import { useEffect } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  heroStats,
  signals,
  bookGrid,
  fractalPaths,
  pmToday,
  pmFriday,
  scenarios,
  position,
  methodLayers,
  pmChartLabels,
  pmChartValues,
  pmCumulativeLabels,
  pmCumulativeValues,
} from './data';

/* ── Signal badge bar ──────────────────────────────────────────────────── */

function SignalBar() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 24,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 500,
          color: 'var(--ink-secondary, #999)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginRight: 4,
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
      >
        Signals
      </span>
      {signals.map((s, i) => {
        const colors = {
          bull: { bg: 'rgba(76,175,120,0.14)', color: '#4caf78', border: 'rgba(76,175,120,0.24)' },
          bear: { bg: 'rgba(224,80,80,0.11)', color: '#e07070', border: 'rgba(224,80,80,0.2)' },
          neutral: { bg: 'rgba(136,134,128,0.11)', color: 'var(--ink-secondary, #888)', border: 'rgba(136,134,128,0.18)' },
        };
        const c = colors[s.type];
        return (
          <span
            key={i}
            style={{
              fontSize: 10,
              fontWeight: 500,
              padding: '3px 9px',
              borderRadius: 3,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              background: c.bg,
              color: c.color,
              border: `1px solid ${c.border}`,
            }}
          >
            {s.text}
          </span>
        );
      })}
    </div>
  );
}

/* ── Polymarket probability bar row ────────────────────────────────────── */

function PmBar({ label, pct, tier, star }: { label: string; pct: number; tier: string; star?: boolean }) {
  const tierColors: Record<string, string> = {
    peak: 'linear-gradient(90deg, #d4620a, #f0a030)',
    high: 'linear-gradient(90deg, #b04d08, #d4620a)',
    mid: 'linear-gradient(90deg, #6b3505, #9a4007)',
    low: 'rgba(100,60,20,0.6)',
    tiny: 'rgba(60,40,20,0.4)',
  };
  const maxPct = 57.5;
  const width = Math.max((pct / maxPct) * 100, 2);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span
        style={{
          width: 80,
          fontSize: 11,
          fontFamily: 'var(--font-geist-mono, monospace)',
          color: star ? '#f0a030' : 'var(--ink-secondary, #999)',
          fontWeight: star ? 700 : 400,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {label}{star ? ' \u2605' : ''}
      </span>
      <div
        style={{
          flex: 1,
          height: 18,
          background: 'rgba(40,38,34,0.6)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: '100%',
            background: tierColors[tier] || tierColors.low,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: pct > 8 ? 'flex-end' : 'flex-start',
            paddingRight: pct > 8 ? 6 : 0,
            paddingLeft: pct <= 8 ? 4 : 0,
          }}
        >
          {pct > 8 && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-geist-mono, monospace)' }}>
              {pct}%
            </span>
          )}
        </div>
        {pct <= 8 && (
          <span
            style={{
              position: 'absolute',
              right: -30,
              top: 2,
              fontSize: 9,
              color: 'var(--ink-secondary, #777)',
              fontFamily: 'var(--font-geist-mono, monospace)',
            }}
          >
            {pct < 1 ? `~${pct}%` : `${pct}%`}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Fractal path card ─────────────────────────────────────────────────── */

function PathCard({ path }: { path: typeof fractalPaths[0] }) {
  const isBear = path.type === 'bear';
  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        background: isBear ? 'rgba(0,180,160,0.06)' : 'rgba(200,170,80,0.06)',
        border: `1px solid ${isBear ? 'rgba(0,180,160,0.18)' : 'rgba(200,170,80,0.18)'}`,
        borderRadius: 6,
        padding: '16px 18px',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: isBear ? '#4caf78' : '#f0a030',
          marginBottom: 4,
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
      >
        {isBear ? '\u{1F7E2}' : '\u2B50'} {path.label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: isBear ? '#00b4a0' : '#f0a030',
          marginBottom: 6,
        }}
      >
        {path.price}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-secondary, #999)', lineHeight: 1.5 }}>
        {path.description}
      </div>
    </div>
  );
}

/* ── Scenario block ────────────────────────────────────────────────────── */

function ScenarioBlock({ scenario }: { scenario: typeof scenarios[0] }) {
  return (
    <div
      style={{
        background: 'rgba(40,38,34,0.5)',
        border: '1px solid rgba(100,96,88,0.2)',
        borderRadius: 6,
        padding: '14px 18px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink-primary, #e8e6e0)',
          marginBottom: 6,
          fontFamily: 'var(--font-geist-mono, monospace)',
        }}
      >
        Scenario {scenario.id} \u2014 {scenario.title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-secondary, #999)', lineHeight: 1.6 }}>
        {scenario.body}
      </div>
    </div>
  );
}

/* ── Method layer column ───────────────────────────────────────────────── */

function MethodColumn({ layer }: { layer: typeof methodLayers[0] }) {
  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#f0a030',
          marginBottom: 6,
          fontFamily: 'var(--font-geist-mono, monospace)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {layer.title}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-secondary, #999)', lineHeight: 1.6 }}>
        {layer.body}
      </div>
    </div>
  );
}

/* ── Main content component ────────────────────────────────────────────── */

export default function ImpactMarketBriefMar252026() {
  /* ── Chart.js: Polymarket distribution & cumulative ──────────────────── */
  useEffect(() => {
    let chart1: unknown;
    let chart2: unknown;

    async function renderCharts() {
      const ChartJS = (await import('chart.js/auto')).default;

      /* Probability distribution chart */
      const ctx1 = (document.getElementById('pm-dist-chart') as HTMLCanvasElement | null)?.getContext('2d');
      if (ctx1) {
        chart1 = new ChartJS(ctx1, {
          type: 'bar',
          data: {
            labels: pmChartLabels,
            datasets: [
              {
                label: 'Probability %',
                data: pmChartValues,
                backgroundColor: pmChartValues.map((v) =>
                  v >= 50 ? '#d4620a' : v >= 15 ? '#9a4007' : v >= 5 ? 'rgba(100,60,20,0.7)' : 'rgba(60,40,20,0.5)',
                ),
                borderColor: 'rgba(200,170,80,0.3)',
                borderWidth: 1,
                borderRadius: 3,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Polymarket \u2014 BTC Price Range Today (Mar 25)',
                color: '#e8e6e0',
                font: { size: 12, family: 'var(--font-geist-mono, monospace)' },
                padding: { bottom: 12 },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${(ctx.parsed.x ?? 0).toFixed(1)}%`,
                },
              },
            },
            scales: {
              x: {
                max: 65,
                ticks: { color: '#777', font: { size: 10 }, callback: (v) => `${v}%` },
                grid: { color: 'rgba(100,96,88,0.15)' },
              },
              y: {
                ticks: { color: '#ccc', font: { size: 10, family: 'var(--font-geist-mono, monospace)' } },
                grid: { display: false },
              },
            },
          },
        });
      }

      /* Cumulative upside chart */
      const ctx2 = (document.getElementById('pm-cum-chart') as HTMLCanvasElement | null)?.getContext('2d');
      if (ctx2) {
        chart2 = new ChartJS(ctx2, {
          type: 'bar',
          data: {
            labels: pmCumulativeLabels,
            datasets: [
              {
                label: 'Cumulative %',
                data: pmCumulativeValues,
                backgroundColor: pmCumulativeValues.map((v) =>
                  v >= 90 ? '#d4620a' : v >= 60 ? '#9a4007' : v >= 30 ? 'rgba(100,60,20,0.7)' : 'rgba(60,40,20,0.5)',
                ),
                borderColor: 'rgba(200,170,80,0.3)',
                borderWidth: 1,
                borderRadius: 3,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Friday Mar 28 \u2014 Cumulative Upside Probabilities',
                color: '#e8e6e0',
                font: { size: 12, family: 'var(--font-geist-mono, monospace)' },
                padding: { bottom: 12 },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${(ctx.parsed.x ?? 0).toFixed(1)}%`,
                },
              },
            },
            scales: {
              x: {
                max: 105,
                ticks: { color: '#777', font: { size: 10 }, callback: (v) => `${v}%` },
                grid: { color: 'rgba(100,96,88,0.15)' },
              },
              y: {
                ticks: { color: '#ccc', font: { size: 10, family: 'var(--font-geist-mono, monospace)' } },
                grid: { display: false },
              },
            },
          },
        });
      }
    }

    renderCharts();
    return () => {
      if (chart1 && typeof (chart1 as { destroy: () => void }).destroy === 'function')
        (chart1 as { destroy: () => void }).destroy();
      if (chart2 && typeof (chart2 as { destroy: () => void }).destroy === 'function')
        (chart2 as { destroy: () => void }).destroy();
    };
  }, []);

  return (
    <BlogLayout meta={meta}>
      {/* ── Signal badges ──────────────────────────────────────────────────── */}
      <SignalBar />

      {/* ── Hero stats ─────────────────────────────────────────────────────── */}
      <StatGrid cells={heroStats} />

      {/* ── Section 1: Macro Field ─────────────────────────────────────────── */}
      <SectionHeader number="01" title="Macro Field" sourceTag="Macro Regime" />
      <Prose>
        <p>
          The macro regime is <strong>Risk Off Stagflation</strong>. Dollar strength persists, equities are grinding
          without conviction, and rate expectations are anchored higher for longer. That backdrop historically
          compresses BTC liquidity — not expands it.
        </p>
        <p>
          The 10Y yield is moving slowly, which Simons would label a growth signal — but the DXY refuses to
          roll over, and that is the headwind that matters. Strong dollar + tight liquidity = difficult environment
          for crypto to sustain a new ATH push. When the macro environment does not support the price level,
          the fractal will do the corrective work.
        </p>
        <p>
          <strong>Regime label: Risk Off Stagflation.</strong> Every directional call that follows lives in this context.
        </p>
      </Prose>

      {/* ── Section 2: BTC — The Book ──────────────────────────────────────── */}
      <SectionHeader number="02" title="BTC \u2014 The Book" sourceTag="Fractal + Orderflow" />
      <Prose>
        <p>
          BTC currently trades near <strong>$87K</strong> — squarely inside what the fractal model identifies as
          the entry zone for the historical analog. Seven distinct pattern matches across the last 1,000 days
          all walked into this zone and exited lower. That is not a single match fluke — it is convergence
          across multiple independent time windows.
        </p>
      </Prose>
      <StatGrid cells={bookGrid} />
      <Prose>
        <p>
          <strong>The line in the sand: $80,000.</strong> A weekly close below $80K opens the door to the $72K
          weighted average convergence. Below $72K and the fractal&apos;s dominant path — the green line heading
          toward $53.3K over 60 days — becomes the operative scenario. Above $80K into next week, the thesis
          is under pressure but not invalidated.
        </p>
      </Prose>

      {/* ── Section 3: The Fractal Signal ──────────────────────────────────── */}
      <SectionHeader number="03" title="The Fractal Signal" sourceTag="Hyblock MCP" />
      <CalloutBox variant="amber">
        <div style={{ fontSize: 11, color: 'var(--ink-secondary, #999)', fontFamily: 'var(--font-geist-mono, monospace)', marginBottom: 6 }}>
          BTC_USDT — Fractal Model | 120d Lookback | Grid Optimised | Price + Global Bid Ask DTW | Mar 23, 2026
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink-secondary, #777)', lineHeight: 1.5 }}>
          Source: Hyblock MCP · 1000 real days · Lookback=120d · Forecast=60d · W_BAR=1.5 · step=6 |
          Best match: Aug 2025 to Dec 25, 2025 · 7 distinct matches
        </div>
      </CalloutBox>
      <Prose>
        <p>
          The fractal model finds the <strong>best historical match in the Aug to Dec 2025 period</strong> —
          a phase that ended in a sharp multi month drawdown. Seven distinct sub matches all align with the same
          structure. That is not noise. That is convergence.
        </p>
      </Prose>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        {fractalPaths.map((p, i) => (
          <PathCard key={i} path={p} />
        ))}
      </div>
      <Prose>
        <p>
          <strong>This is what makes the signal compelling:</strong> the Polymarket crowd&apos;s $70\u201372K forecast
          for this week accidentally maps to the fractal&apos;s weighted average. The crowd is right about the near
          term destination — but wrong about it being the floor. The green line is the outlier that statistics
          say you should position for.
        </p>
      </Prose>

      {/* ── Section 4: Crowd Intelligence — Polymarket ─────────────────────── */}
      <SectionHeader number="04" title="Crowd Intelligence \u2014 Polymarket" sourceTag="Polymarket" live />
      <Prose>
        <p>
          Polymarket prediction markets are the cleanest real money signal for short term crowd consensus.
          The crowd is currently pricing BTC with very tight conviction. This week&apos;s data is telling:
        </p>
      </Prose>

      {/* Custom probability bars */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#f0a030',
            fontFamily: 'var(--font-geist-mono, monospace)',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          March 25 (Today) — Price Range Probabilities · Vol 24h: ~$535K
        </div>
        {pmToday.map((bar, i) => (
          <PmBar key={i} label={bar.label} pct={bar.pct} tier={bar.tier} star={bar.star} />
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#f0a030',
            fontFamily: 'var(--font-geist-mono, monospace)',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Friday March 28 (End of Week) — Cumulative Upside Probabilities
        </div>
        {pmFriday.map((bar, i) => (
          <PmBar key={i} label={bar.label} pct={bar.pct} tier={bar.tier} />
        ))}
      </div>

      {/* Chart.js charts */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 300, height: 280, background: 'rgba(40,38,34,0.4)', borderRadius: 6, padding: 14 }}>
          <canvas id="pm-dist-chart" />
        </div>
        <div style={{ flex: 1, minWidth: 300, height: 260, background: 'rgba(40,38,34,0.4)', borderRadius: 6, padding: 14 }}>
          <canvas id="pm-cum-chart" />
        </div>
      </div>

      <Prose>
        <p>
          Read this clearly: the crowd has essentially zero conviction in BTC sustaining above $76K by Friday.
          They are pricing a mean reversion to $70\u201372K with <strong>57.5% certainty today</strong>.
          The fractal says they are right about the direction — but their 60 day target is 20% above where
          history says this ends.
        </p>
      </Prose>

      {/* ── Section 5: How Impact Market Works ─────────────────────────────── */}
      <SectionHeader number="05" title="How Impact Market Works" sourceTag="Methodology" />
      <div
        style={{
          background: 'rgba(40,38,34,0.5)',
          border: '1px solid rgba(200,170,80,0.15)',
          borderRadius: 8,
          padding: '20px 22px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#f0a030',
            marginBottom: 12,
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          Crowd Intelligence x Orderflow Intelligence = Edge
        </div>
        <Prose>
          <p>
            Impact Market combines two orthogonal signal sources — prediction market crowd data and structural
            orderflow analysis — to identify when mass consensus and market microstructure are aligned. When they
            diverge, that divergence is the trade.
          </p>
        </Prose>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 14 }}>
          {methodLayers.map((layer, i) => (
            <MethodColumn key={i} layer={layer} />
          ))}
        </div>
      </div>
      <Prose>
        <p>
          <strong>Today&apos;s signal structure is textbook Impact:</strong> the Polymarket crowd ($70\u201372K) is
          looking at the near term landing zone but has not priced the full fractal resolution ($53.3K). That gap
          between crowd consensus and structural path is where the opportunity lives. Execution is calibrated to
          the fractal target with the crowd data confirming the short term directional move before the real leg
          down begins.
        </p>
      </Prose>

      {/* ── Section 6: Scenario Tree ───────────────────────────────────────── */}
      <SectionHeader number="06" title="Next 48 Hours \u2014 Scenario Tree" sourceTag="Scenarios" />
      {scenarios.map((s, i) => (
        <ScenarioBlock key={i} scenario={s} />
      ))}

      {/* ── Section 7: The Position ────────────────────────────────────────── */}
      <SectionHeader number="07" title="The Position" sourceTag="Positioning" />
      <CalloutBox variant="red">
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#00b4a0',
            marginBottom: 4,
          }}
        >
          {position.lean}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#f0a030',
            fontFamily: 'var(--font-geist-mono, monospace)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 12,
          }}
        >
          {position.conviction}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-secondary, #ccc)', lineHeight: 1.7, marginBottom: 14 }}>
          {position.thesis}
        </p>
        <div
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'var(--ink-secondary, #999)',
            borderTop: '1px solid rgba(224,80,80,0.2)',
            paddingTop: 10,
          }}
        >
          WHAT KILLS IT:{' '}
          <span style={{ color: '#e05050' }}>{position.killCondition}</span>
        </div>
      </CalloutBox>
    </BlogLayout>
  );
}
