'use client';

import { useEffect, useRef } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  heroStats,
  signals,
  analysisCards,
  genLabels,
  BTC, REAL, NUPL, SOPR, MVRV, LTH, SSR,
} from './data';

/* ── Signal badge component ──────────────────────────────────────────────── */

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

/* ── Analysis card component ─────────────────────────────────────────────── */

function AnalysisCard({ card }: { card: typeof analysisCards[0] }) {
  const dotColor = card.type === 'bull' ? '#4caf78' : card.type === 'bear' ? '#e05050' : '#4a4945';
  const tagColor = card.type === 'bull' ? '#4caf78' : card.type === 'bear' ? '#e05050' : 'var(--ink-secondary, #999)';

  return (
    <div
      style={{
        background: 'var(--bg-card, #f5f4f0)',
        border: '1px solid var(--border-element, rgba(0,0,0,0.08))',
        borderRadius: 6,
        padding: '18px 20px',
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontFamily: 'var(--font-geist-mono, monospace)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 7,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color: tagColor,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        {card.tag}
      </div>
      <h3 style={{ fontSize: 13, fontWeight: 500, marginBottom: 7, lineHeight: 1.3 }}>
        {card.title}
      </h3>
      <p
        style={{
          fontSize: 12.5,
          color: 'var(--ink-secondary, #888)',
          lineHeight: 1.7,
          fontWeight: 300,
        }}
        dangerouslySetInnerHTML={{ __html: card.body }}
      />
    </div>
  );
}

/* ── Chart wrapper using Chart.js ────────────────────────────────────────── */

interface ChartConfig {
  id: string;
  height?: number;
  title: string;
  subtitle: string;
  legend: { color: string; label: string; dashed?: boolean }[];
  datasets: {
    data: number[];
    color: string;
    width?: number;
    dashed?: boolean;
    yAxisID: string;
    label: string;
    opacity?: number;
  }[];
  yFormat: (v: number) => string;
  yMin?: number;
  yMax?: number;
  y2Format?: (v: number) => string;
  referenceLine?: number;
}

function OnChainChart({ config }: { config: ChartConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    let mounted = true;
    import('chart.js/auto').then((mod) => {
      if (!mounted || !canvasRef.current) return;
      const Chart = mod.default;

      // Destroy previous chart
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }

      const labels = genLabels();
      const gc = 'rgba(128,128,128,0.08)';
      const tickCfg = { font: { size: 8 as const }, maxTicksLimit: 8 };

      const datasets = config.datasets.map((ds) => ({
        type: 'line' as const,
        data: ds.data,
        borderColor: ds.opacity ? ds.color.replace(')', `,${ds.opacity})`) : ds.color,
        borderWidth: ds.width || 2,
        borderDash: ds.dashed ? [5, 3] : undefined,
        pointRadius: 0,
        fill: false,
        tension: 0.3,
        yAxisID: ds.yAxisID,
        label: ds.label,
        order: ds.yAxisID === 'y2' ? 2 : 1,
      }));

      // Add reference line if needed
      if (config.referenceLine !== undefined) {
        datasets.push({
          type: 'line' as const,
          data: labels.map(() => config.referenceLine!),
          borderColor: 'rgba(224,80,80,0.4)',
          borderWidth: 1,
          borderDash: [4, 3],
          pointRadius: 0,
          fill: false,
          tension: 0,
          yAxisID: 'y',
          label: `${config.referenceLine}`,
          order: 3,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scales: any = {
        x: {
          ticks: { ...tickCfg, maxTicksLimit: 12, callback: (_v: unknown, i: number) => labels[i] || '' },
          grid: { color: gc },
          border: { display: false },
        },
        y: {
          ticks: { ...tickCfg, callback: config.yFormat },
          grid: { color: gc },
          border: { display: false },
          ...(config.yMin !== undefined ? { min: config.yMin } : {}),
          ...(config.yMax !== undefined ? { max: config.yMax } : {}),
        },
      };

      if (config.datasets.some((ds) => ds.yAxisID === 'y2')) {
        const priceFmt = config.y2Format || ((v: number) => `$${(v / 1000).toFixed(0)}K`);
        scales.y2 = {
          position: 'right',
          ticks: { ...tickCfg, color: '#3a5870', callback: priceFmt },
          grid: { drawOnChartArea: false },
          border: { display: false },
        };
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#17171d',
              borderColor: '#2e2e38',
              borderWidth: 1,
              titleColor: '#666',
              bodyColor: '#e4e2d8',
              titleFont: { size: 9 },
              bodyFont: { size: 10 },
              padding: 9,
            },
          },
          scales,
        },
      });
    });

    return () => {
      mounted = false;
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [config]);

  return (
    <div
      style={{
        background: 'var(--bg-card, #f5f4f0)',
        border: '1px solid var(--border-element, rgba(0,0,0,0.08))',
        borderRadius: 6,
        padding: '14px 16px 12px',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontFamily: 'var(--font-geist-mono, monospace)',
          color: 'var(--ink-secondary, #999)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}
      >
        {config.title}
      </div>
      <div
        style={{
          fontSize: 15,
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontWeight: 500,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'baseline',
          gap: 7,
        }}
      >
        {config.subtitle.split(' | ')[0]}
        <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--ink-secondary, #999)' }}>
          {config.subtitle.split(' | ')[1] || ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
        {config.legend.map((l, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 9,
              color: 'var(--ink-secondary, #999)',
              fontFamily: 'var(--font-geist-mono, monospace)',
            }}
          >
            <div
              style={{
                width: 14,
                height: 2,
                borderRadius: 1,
                background: l.color,
                ...(l.dashed
                  ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0, ${l.color} 4px, transparent 4px, transparent 7px)`, background: 'none' }
                  : {}),
              }}
            />
            {l.label}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', height: config.height || 160 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

/* ── Chart configurations ────────────────────────────────────────────────── */

const priceRealizedChart: ChartConfig = {
  id: 'c1',
  height: 200,
  title: 'BTC Price vs Realized Price \u00b7 1-Year',
  subtitle: '$69,923 | market price today \u00b7 $54,356 realized price',
  legend: [
    { color: '#4a9fd4', label: 'BTC Price' },
    { color: '#f0a030', label: 'Realized Price', dashed: true },
  ],
  datasets: [
    { data: BTC, color: '#4a9fd4', width: 1.5, yAxisID: 'y', label: 'BTC Price' },
    { data: REAL, color: '#f0a030', width: 1.5, dashed: true, yAxisID: 'y', label: 'Realized Price' },
  ],
  yFormat: (v: number) => `$${(v / 1000).toFixed(0)}K`,
};

const nuplChart: ChartConfig = {
  id: 'c2',
  title: 'NUPL + BTC Price \u00b7 1-Year',
  subtitle: '0.22 | hope/fear \u00b7 peak 0.59 Jul \u00b7 crash 0.12 Feb',
  legend: [
    { color: '#9d8fd4', label: 'NUPL' },
    { color: 'rgba(74,159,212,0.6)', label: 'BTC Price' },
  ],
  datasets: [
    { data: NUPL, color: '#9d8fd4', yAxisID: 'y', label: 'NUPL' },
    { data: BTC, color: 'rgba(74,159,212,0.55)', width: 1.2, yAxisID: 'y2', label: 'Price' },
  ],
  yFormat: (v: number) => v.toFixed(2),
};

const soprChart: ChartConfig = {
  id: 'c3',
  title: 'SOPR + BTC Price \u00b7 1-Year',
  subtitle: '0.990 | below 1.0 baseline \u00b7 Jun\u2013Aug high 1.07\u20131.18',
  legend: [
    { color: '#4caf78', label: 'SOPR' },
    { color: 'rgba(74,159,212,0.6)', label: 'BTC Price' },
  ],
  datasets: [
    { data: SOPR, color: '#4caf78', yAxisID: 'y', label: 'SOPR' },
    { data: BTC, color: 'rgba(74,159,212,0.55)', width: 1.2, yAxisID: 'y2', label: 'Price' },
  ],
  yFormat: (v: number) => v.toFixed(3),
  yMin: 0.94,
  yMax: 1.20,
  referenceLine: 1.0,
};

const mvrvChart: ChartConfig = {
  id: 'c4',
  title: 'MVRV Z-Score + BTC Price \u00b7 1-Year',
  subtitle: '0.54 | fair value \u00b7 peak 2.90 Jul \u00b7 low 0.32 Feb',
  legend: [
    { color: '#e07840', label: 'MVRV Z' },
    { color: 'rgba(74,159,212,0.6)', label: 'BTC Price' },
  ],
  datasets: [
    { data: MVRV, color: '#e07840', yAxisID: 'y', label: 'MVRV Z' },
    { data: BTC, color: 'rgba(74,159,212,0.55)', width: 1.2, yAxisID: 'y2', label: 'Price' },
  ],
  yFormat: (v: number) => v.toFixed(1),
};

const lthChart: ChartConfig = {
  id: 'c5',
  title: 'LTH Supply + BTC Price \u00b7 1-Year',
  subtitle: '14.57M | BTC \u00b7 peak 14.85M Jul \u00b7 low 14.43M Feb',
  legend: [
    { color: '#4caf78', label: 'LTH Supply' },
    { color: 'rgba(74,159,212,0.6)', label: 'BTC Price' },
  ],
  datasets: [
    { data: LTH, color: '#4caf78', yAxisID: 'y', label: 'LTH Supply' },
    { data: BTC, color: 'rgba(74,159,212,0.55)', width: 1.2, yAxisID: 'y2', label: 'Price' },
  ],
  yFormat: (v: number) => `${v.toFixed(2)}M`,
};

const ssrChart: ChartConfig = {
  id: 'c6',
  height: 200,
  title: 'Stablecoin Supply Ratio (SSR) + BTC Price \u00b7 1-Year',
  subtitle: '5.21 | current \u00b7 peak 10.49 Jul 2025 \u00b7 low 4.81 Feb 5 2026',
  legend: [
    { color: '#f0a030', label: 'SSR' },
    { color: 'rgba(74,159,212,0.6)', label: 'BTC Price' },
  ],
  datasets: [
    { data: SSR, color: '#f0a030', yAxisID: 'y', label: 'SSR' },
    { data: BTC, color: 'rgba(74,159,212,0.55)', width: 1.2, yAxisID: 'y2', label: 'Price' },
  ],
  yFormat: (v: number) => v.toFixed(1),
};

/* ── Main content component ──────────────────────────────────────────────── */

export default function BtcOnChain1YrMar202026() {
  return (
    <BlogLayout meta={meta}>
      {/* ── 00 Overview ──────────────────────────────────────────── */}
      <SectionHeader number="00" title="1-Year On-Chain Overview" sourceTag="Glassnode" live />
      <Prose>
        <p>
          Full 12-month on-chain analysis covering March 20, 2025 through March 19, 2026.
          Six core metrics tracked daily across 366 data points each. BTC price overlay on every chart.
        </p>
      </Prose>

      <SignalBar />
      <StatGrid cells={heroStats} />

      {/* ── 01 Daily Analysis ────────────────────────────────────── */}
      <SectionHeader number="01" title="Daily Analysis — 1-Year Context" sourceTag="Glassnode" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {analysisCards.map((card, i) => (
          <AnalysisCard key={i} card={card} />
        ))}
      </div>

      {/* ── Bottom Line ──────────────────────────────────────────── */}
      <CalloutBox variant="amber">
        <strong>Bottom Line — Mar 20, 2026 · 1-Year Perspective:</strong> The 12-month on-chain
        picture shows a market that completed a full cycle arc:{' '}
        <strong>accumulation → ATH at $123K → distribution → crash → capitulation → early recovery</strong>.
        Today sits in the recovery phase, supported by LTH buying and fair-value MVRV Z, but
        constrained by SOPR loss regime, NUPL below 0.25, and the structural overhang of Jan 2026
        buyers sitting on 25–30% losses. Bitcoin&apos;s on-chain health is not broken — realized price
        is rising, LTH supply is recovering, and the Feb 5 capitulation appears to have been a genuine
        clearing event. But the path back to new highs runs through $84K, $97K, and ultimately $123K+.{' '}
        <em>The floor looks solid. The ceiling is far. Size for the journey, not the sprint.</em>
      </CalloutBox>

      {/* ── 02 Charts ────────────────────────────────────────────── */}
      <SectionHeader number="02" title="On-Chain Charts — 1 Year (Mar 20 2025 → Mar 19 2026)" sourceTag="Glassnode" />

      <OnChainChart config={priceRealizedChart} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 10,
        }}
      >
        <OnChainChart config={nuplChart} />
        <OnChainChart config={soprChart} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 10,
        }}
      >
        <OnChainChart config={mvrvChart} />
        <OnChainChart config={lthChart} />
      </div>

      <OnChainChart config={ssrChart} />

      {/* ── Source ────────────────────────────────────────────────── */}
      <Prose>
        <p>
          <em>
            Data: Glassnode · On-chain metrics only · Not financial advice · March 20, 2026
          </em>
        </p>
      </Prose>
    </BlogLayout>
  );
}
