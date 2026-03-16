'use client';

import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import { heroStats, upsideData, downsideData, bestMonthData } from './data';

/* ── Inline bar chart component (vertical bars, CSS-only) ──────────────── */

interface BarItem {
  label: string;
  value: number;
  resolved?: boolean;
}

const BAR_AREA_HEIGHT = 180; // px for the bar drawing area

function VerticalBarChart({
  data,
  colorFn,
  maxValue = 100,
}: {
  data: BarItem[];
  colorFn: (value: number, index: number) => string;
  maxValue?: number;
}) {
  const ticks = maxValue <= 20
    ? [0, 5, 10, 15, 20].filter((t) => t <= maxValue)
    : [0, 25, 50, 75, 100].filter((t) => t <= maxValue);

  return (
    <div style={{ position: 'relative', paddingLeft: 32, paddingBottom: 28, marginBottom: 8 }}>
      {/* Y-axis gridlines */}
      {ticks.map((tick) => (
        <div
          key={tick}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${28 + (tick / maxValue) * BAR_AREA_HEIGHT}px`,
            borderTop: '1px solid var(--border-element, rgba(0,0,0,0.06))',
            fontSize: 9,
            color: 'var(--ink-secondary, #999)',
            fontFamily: 'var(--font-geist-mono, monospace)',
            pointerEvents: 'none',
          }}
        >
          {`${tick}%`}
        </div>
      ))}
      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: data.length > 12 ? 2 : 6,
          height: BAR_AREA_HEIGHT,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {data.map((item, i) => {
          const barH = Math.max((item.value / maxValue) * BAR_AREA_HEIGHT, item.value > 0 ? 2 : 0);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'flex-end',
              }}
            >
              {/* Value label */}
              <span
                style={{
                  fontSize: 9,
                  color: 'var(--ink-secondary, #999)',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  marginBottom: 2,
                  lineHeight: 1,
                }}
              >
                {item.value > 0 ? `${item.value}%` : ''}
              </span>
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 28,
                  height: barH,
                  backgroundColor: colorFn(item.value, i),
                  borderRadius: '3px 3px 0 0',
                }}
              />
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div
        style={{
          display: 'flex',
          gap: data.length > 12 ? 2 : 6,
          marginTop: 4,
        }}
      >
        {data.map((item, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              fontSize: 9,
              color: 'var(--ink-secondary, #999)',
              fontFamily: 'var(--font-geist-mono, monospace)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Color functions for each chart ────────────────────────────────────── */

function upsideColor(v: number): string {
  if (v >= 40) return '#EF9F27';
  if (v >= 20) return '#FAC775';
  return 'var(--border-element, #FAEEDA)';
}

function downsideColor(v: number): string {
  if (v >= 55) return '#E24B4A';
  if (v >= 30) return '#F09595';
  return 'var(--border-element, #FCEBEB)';
}

function monthColor(v: number, i: number): string {
  if (i < 2) return 'var(--border-element, rgba(0,0,0,0.07))';
  if (v >= 14) return '#1D9E75';
  if (v >= 9) return '#5DCAA5';
  return '#9FE1CB';
}

/* ── Legend component ──────────────────────────────────────────────────── */

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10, fontSize: 12, color: 'var(--ink-secondary, #999)' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: 'inline-block' }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ── Main content component ────────────────────────────────────────────── */

export default function BtcPolymarketMar162026() {
  return (
    <BlogLayout meta={meta}>
      {/* ── 00 Overview ────────────────────────────────────────────── */}
      <SectionHeader number="00" title="BTC Prediction Market Overview" sourceTag="Polymarket" live />
      <Prose>
        <p>
          Live prediction market probabilities across 30+ active BTC markets with $25M+ total
          volume. This report maps how Polymarket participants are pricing Bitcoin&apos;s year-end
          distribution — upside targets, downside risks, and the monthly seasonality bet.
        </p>
      </Prose>
      <StatGrid cells={heroStats} />

      {/* ── 01 Upside Targets ──────────────────────────────────────── */}
      <SectionHeader number="01" title="Upside Targets — Probability of Reaching by Dec 31, 2026" sourceTag="Polymarket" />
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <VerticalBarChart data={upsideData} colorFn={upsideColor} />
        <Legend
          items={[
            { color: '#EF9F27', label: 'Strong (≥40%)' },
            { color: '#FAC775', label: 'Moderate (20–40%)' },
            { color: '#FAEEDA', label: 'Low (<20%)' },
          ]}
        />
      </div>

      {/* ── 02 Two-column: Downside + Best Month ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div>
          <SectionHeader number="02" title="Downside Risk — Probability of Dipping To by EOY" sourceTag="Polymarket" />
          <VerticalBarChart data={downsideData} colorFn={downsideColor} />
        </div>
        <div>
          <SectionHeader number="03" title="Best Month for BTC in 2026" sourceTag="Polymarket" />
          <VerticalBarChart data={bestMonthData} colorFn={monthColor} maxValue={20} />
        </div>
      </div>

      {/* ── 04 Market Read ─────────────────────────────────────────── */}
      <SectionHeader number="04" title="Market Read" />
      <CalloutBox variant="amber">
        <strong>Market read:</strong> The crowd puts a <strong>~57% chance</strong> BTC stays below
        $100k at year-end while simultaneously pricing a <strong>68% chance</strong> of another dip
        to $55k — implying significant volatility expectations in both directions. The $55k dip
        market is the single most actively traded contract (vol24h $49.6k). On the upside,{' '}
        <strong>Q4 is favored</strong> for the biggest monthly move, with October, November, and
        December collectively capturing ~48% of &ldquo;best month&rdquo; probability, echoing
        Bitcoin&apos;s historical Q4 seasonality. February has already resolved{' '}
        <strong>No</strong>, concentrating remaining probability across the 10 remaining months.
      </CalloutBox>

      {/* ── Source ─────────────────────────────────────────────────── */}
      <Prose>
        <p>
          <em>
            Source: Polymarket prediction markets · Data as of March 16, 2026 · Not financial
            advice · Built with live MCP data
          </em>
        </p>
      </Prose>
    </BlogLayout>
  );
}
