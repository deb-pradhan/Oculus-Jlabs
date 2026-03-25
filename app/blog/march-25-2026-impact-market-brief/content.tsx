'use client';

import React from 'react';
import Image from 'next/image';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  heroStats,
  polymarketToday,
  polymarketFriday,
  scenarios,
} from './data';

/* Palette */
const GOLD = '#f7931a';
const TEAL = '#00e5c3';
const RED = '#ff4d4d';
const MUTED = '#666688';
const INK2 = '#14141f';
const BORDER = '#2a2a3d';
const TEXT2 = '#b0b0c8';

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: MUTED,
};

const cardBg: React.CSSProperties = {
  background: INK2,
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  padding: '16px',
};

/* ── Probability bar row (Polymarket) ── */
function PmRow({
  label,
  pct,
  barWidth,
  tier,
  peak,
}: {
  label: string;
  pct: number;
  barWidth: number;
  tier: 'peak' | 'high' | 'mid' | 'low' | 'tiny';
  peak?: boolean;
}) {
  const fillColors: Record<string, string> = {
    peak: 'linear-gradient(90deg, #d4620a, #f7931a)',
    high: 'linear-gradient(90deg, #b04d08, #d4620a)',
    mid: 'linear-gradient(90deg, #6b3505, #9a4007)',
    low: 'rgba(100,60,20,0.6)',
    tiny: 'rgba(60,40,20,0.4)',
  };

  const showInside = barWidth >= 7;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
      <span
        style={{
          ...mono,
          fontSize: 11,
          width: 90,
          textAlign: 'right',
          flexShrink: 0,
          color: peak ? GOLD : MUTED,
          fontWeight: peak ? 700 : 400,
        }}
      >
        {label}{peak ? ' ★' : ''}
      </span>
      <div
        style={{
          flex: 1,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 2,
          height: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            background: fillColors[tier],
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 6,
          }}
        >
          {showInside && (
            <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.85)' }}>
              {pct}%
            </span>
          )}
        </div>
        {!showInside && (
          <span
            style={{
              ...mono,
              fontSize: 10,
              color: MUTED,
              position: 'absolute',
              right: 5,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {pct < 2 ? `~${pct}%` : `${pct}%`}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Path card (fractal signal) ── */
function PathCard({
  label,
  price,
  desc,
  variant,
}: {
  label: string;
  price: string;
  desc: string;
  variant: 'bear' | 'avg';
}) {
  const accentColor = variant === 'bear' ? TEAL : GOLD;
  return (
    <div style={{ ...cardBg, borderLeft: `3px solid ${accentColor}` }}>
      <div style={{ ...mono, fontSize: 9, marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: 22,
          fontWeight: 700,
          color: accentColor,
        }}
      >
        {price}
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{desc}</div>
    </div>
  );
}

/* ── Scenario block ── */
function ScenarioBlock({
  trigger,
  body,
  watchLevel,
}: {
  trigger: string;
  body: string;
  watchLevel: string;
}) {
  return (
    <div style={{ ...cardBg, margin: '12px 0', padding: '20px 24px' }}>
      <div style={{ ...mono, fontSize: 10, color: TEAL, fontWeight: 700, marginBottom: 6 }}>
        {trigger}
      </div>
      <div style={{ fontSize: 14, color: TEXT2 }}>
        {body}
        {watchLevel && <> <strong>{watchLevel}</strong></>}
      </div>
    </div>
  );
}

/* ── Method box ── */
function MethodBox() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(247,147,26,0.06), rgba(0,229,195,0.04))',
        border: '1px solid rgba(247,147,26,0.2)',
        borderRadius: 6,
        padding: '28px 32px',
        margin: '32px 0',
      }}
    >
      <div style={{ fontSize: 22, color: '#e8e8f0', marginBottom: 18, fontWeight: 600 }}>
        Crowd Intelligence x Orderflow Intelligence = Edge
      </div>
      <p style={{ fontSize: 14, color: TEXT2, marginBottom: 20, lineHeight: 1.6 }}>
        Impact Market combines two orthogonal signal sources — prediction market crowd data and structural orderflow analysis —
        to identify when mass consensus and market microstructure are aligned. When they diverge, that divergence{' '}
        <em style={{ color: '#ffb347', fontStyle: 'normal', fontWeight: 500 }}>is the trade</em>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ ...mono, color: GOLD, marginBottom: 8 }}>Layer 1: Crowd Intelligence</div>
          <div style={{ fontSize: 13.5, color: TEXT2, lineHeight: 1.6 }}>
            Polymarket prediction markets aggregate real money bets from thousands of participants into a probability distribution.
            Unlike analyst forecasts, these are skin in the game signals — someone's dollar is on the line for every price they quote.
            We extract the modal price expectation, the distribution skew, and the 24hr volume as a conviction signal.
            High confidence crowd distributions with tight spread = high quality signal.
          </div>
        </div>
        <div>
          <div style={{ ...mono, color: GOLD, marginBottom: 8 }}>Layer 2: Orderflow Intelligence</div>
          <div style={{ fontSize: 13.5, color: TEXT2, lineHeight: 1.6 }}>
            The fractal model uses Dynamic Time Warping (DTW) across price + global bid ask ratio simultaneously,
            scanning 1,000 days of historical data across 20 exchanges. When the current price structure and order book
            profile match a historical pattern with statistically significant precision, we weight those matches
            to produce a probabilistic forward path. The green line represents the highest weight single historical analog.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Position box ── */
function PositionBox() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255,77,77,0.08), rgba(0,0,0,0))',
        border: '1px solid rgba(255,77,77,0.25)',
        borderRadius: 6,
        padding: '28px 32px',
        margin: '28px 0',
      }}
    >
      <div style={{ fontSize: 28, color: TEAL, marginBottom: 16, fontWeight: 600 }}>
        Bearish — 60 Day Horizon
      </div>
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(0,229,195,0.1)',
            border: '1px solid rgba(0,229,195,0.3)',
            color: TEAL,
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: 10,
            letterSpacing: '2px',
            padding: '4px 10px',
            borderRadius: 2,
            textTransform: 'uppercase',
          }}
        >
          Half Book Conviction
        </span>
      </div>
      <p style={{ fontSize: 15, color: TEXT2, marginBottom: 12, lineHeight: 1.6 }}>
        The fractal's best historical match — 7 distinct pattern alignments against Aug to Dec 2025 price structure —
        resolves to <strong style={{ color: '#e8e8f0' }}>$53.3K</strong>. The global bid ask ratio is negative. The macro regime is Risk Off Stagflation.
        The Polymarket crowd confirms the near term directional move to $70–72K, which sets the entry point
        for the second leg. The path is written. Prepare for it.
      </p>
      <div
        style={{
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: 11,
          color: MUTED,
          paddingTop: 12,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        WHAT KILLS IT: <span style={{ color: RED }}>A weekly close above $78K with positive BAR across 20 exchanges and stablecoin liquidity influx.
        That would invalidate the historical analog entirely and force a full position reassessment.</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ImpactMarketBriefMar252026() {
  return (
    <BlogLayout meta={meta}>
      {/* Hero stats */}
      <StatGrid
        cells={[
          { label: 'Current Price', value: '~$71.2K', sub: 'Fractal entry zone', direction: 'dn' },
          { label: 'Crowd Consensus', value: '$70–72K', sub: 'Polymarket modal range', direction: 'nt' },
          { label: 'Fractal Target', value: '$53.3K', sub: 'Best match 60 day path', direction: 'dn' },
          { label: 'BAR (20 exchanges)', value: '−0.018', sub: 'Net sell pressure', direction: 'dn' },
        ]}
      />

      <CalloutBox variant="amber">
        Polymarket sees $70 to $72K. The fractal sees $53K. Both signals are live. The gap between them is where the trade lives.
      </CalloutBox>

      {/* ── Section 01: Macro Field ── */}
      <SectionHeader number="01" title="Macro Field" />
      <Prose>
        <p>
          The macro regime is <em>Risk Off Stagflation</em>. Dollar strength persists, equities are grinding without conviction,
          and rate expectations are anchored higher for longer. That backdrop historically compresses BTC liquidity — not expands it.
        </p>
        <p>
          The 10Y yield is moving slowly, which Simons would label a growth signal — but the DXY refuses to roll over,
          and that is the headwind that matters. Strong dollar + tight liquidity = difficult environment for crypto to sustain
          a new ATH push. When the macro environment does not support the price level, the fractal will do the corrective work.
        </p>
        <p>
          <strong>Regime label: Risk Off Stagflation.</strong> Every directional call that follows lives in this context.
        </p>
      </Prose>

      {/* ── Section 02: BTC — The Book ── */}
      <SectionHeader number="02" title="BTC — The Book" sourceTag="Hyblock MCP" live />
      <Prose>
        <p>
          BTC currently trades near <strong>$71,200</strong> — squarely inside what the fractal model identifies as the{' '}
          <em>entry zone for the historical analog</em>. Seven distinct pattern matches across the last 1,000 days all walked into this
          same price structure. Only one path was taken in the majority of cases.
        </p>
        <p>
          The global bid ask ratio across 20 exchanges is printing at <strong>−0.018</strong>. That is a negative value —
          meaning more sell pressure than buy pressure is embedded in the order book right now.
          Funding is not screaming, but the structural lean is clear: the tape is tilted.
        </p>
      </Prose>

      {/* Data grid cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '28px 0' }}>
        <div style={cardBg}>
          <div style={{ ...mono, fontSize: 9, marginBottom: 8 }}>Current Price</div>
          <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 20, fontWeight: 700, color: GOLD }}>~$71.2K</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Fractal entry zone</div>
        </div>
        <div style={cardBg}>
          <div style={{ ...mono, fontSize: 9, marginBottom: 8 }}>Weighted Avg Forecast</div>
          <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 20, fontWeight: 700, color: '#ffb347' }}>$72.2K</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Multi match average</div>
        </div>
        <div style={cardBg}>
          <div style={{ ...mono, fontSize: 9, marginBottom: 8 }}>Best Match Target</div>
          <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 20, fontWeight: 700, color: TEAL }}>$53.3K</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Green line — dominant path</div>
        </div>
      </div>

      <Prose>
        <p>
          <strong>The line in the sand: $68,000.</strong> A weekly close below $68K opens the door to
          the $72K weighted average convergence. Below $72K and the fractal's dominant path — the green line
          heading toward $53.3K over 60 days — becomes the operative scenario. Above $68K into next week,
          the thesis is under pressure but not invalidated.
        </p>
      </Prose>

      {/* ── Section 03: The Fractal Signal ── */}
      <SectionHeader number="03" title="The Fractal Signal" sourceTag="1000d DTW" />

      {/* Fractal chart image */}
      <div style={{ margin: '32px 0' }}>
        <div style={{ ...mono, fontSize: 10, letterSpacing: '1.5px', marginBottom: 10 }}>
          BTC_USDT — Fractal Model | 120d Lookback | Price + Global Bid Ask DTW | Mar 23, 2026
        </div>
        <Image
          src="/images/btc_fractal_120d_optimised.png"
          alt="BTC fractal model 120 day lookback showing dominant path to $53.3K"
          width={880}
          height={440}
          style={{ width: '100%', height: 'auto', borderRadius: 4, border: `1px solid ${BORDER}`, display: 'block' }}
          priority
        />
        <div style={{ fontSize: 12, color: MUTED, marginTop: 8, fontStyle: 'italic' }}>
          Source: Hyblock MCP — 1000 real days — Lookback=120d — Forecast=60d — W_BAR=1.5 — step=6 |
          Best match: Aug 2025 to Dec 25, 2025 — 7 distinct matches
        </div>
      </div>

      <Prose>
        <p>
          The fractal model finds the <strong>best historical match in the Aug to Dec 2025 period</strong> —
          a phase that ended in a sharp multi month drawdown. Seven distinct sub matches all align with the same structure.
          That is not noise. That is convergence.
        </p>
      </Prose>

      {/* Path cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0' }}>
        <PathCard
          label="Green Line — Best Match Path"
          price="$53.3K"
          desc="Dominant historical analog. Lowest probability in the short term — highest conviction over 60 days. Prepare for this path."
          variant="bear"
        />
        <PathCard
          label="Gold Dashed — Weighted Average"
          price="$72.2K"
          desc="Average of all 7 matches. Represents the crowd median of historical outcomes — right in the Polymarket consensus zone."
          variant="avg"
        />
      </div>

      <Prose>
        <p>
          <strong>This is what makes the signal compelling:</strong> the Polymarket crowd's $70–72K forecast for this week
          accidentally maps to the fractal's <em>weighted average</em>. The crowd is right about the near term destination —
          but wrong about it being the floor. The green line is the outlier that statistics say you should position for.
        </p>
        <p>
          The upper bound (red dashed, ~$73K) is effectively the current price level — which means the model says
          the risk reward is now decisively skewed to the downside. The downside band ($65.5K) is the first structural support
          to monitor. The green line resolution is $53.3K.
        </p>
      </Prose>

      {/* ── Section 04: Crowd Intelligence — Polymarket ── */}
      <SectionHeader number="04" title="Crowd Intelligence — Polymarket" sourceTag="Polymarket" live />
      <Prose>
        <p>
          Polymarket prediction markets are the cleanest real money signal for short term crowd consensus.
          The crowd is currently pricing BTC with very tight conviction. This week's data is telling:
        </p>
      </Prose>

      {/* Today's range probabilities */}
      <div style={{ margin: '28px 0' }}>
        <div style={{ ...mono, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${BORDER}` }}>
          March 25 (Today) — Price Range Probabilities — Vol 24h: ~$535K
        </div>
        {polymarketToday.map((row, i) => (
          <PmRow key={i} label={row.label} pct={row.pct} barWidth={row.barWidth} tier={row.tier} peak={row.peak} />
        ))}
      </div>

      {/* Friday cumulative probabilities */}
      <div style={{ margin: '28px 0' }}>
        <div style={{ ...mono, marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${BORDER}` }}>
          Friday March 28 (End of Week) — Cumulative Upside Probabilities
        </div>
        {polymarketFriday.map((row, i) => (
          <PmRow key={i} label={row.label} pct={row.pct} barWidth={row.barWidth} tier={row.tier} />
        ))}
      </div>

      <Prose>
        <p>
          Read this clearly: the crowd has essentially zero conviction in BTC sustaining above $76K by Friday.
          They are pricing a mean reversion to $70–72K with <strong>57.5% certainty today</strong>.
          The fractal says they are right about the direction — but their 60 day target is 20% above where history says this ends.
        </p>
      </Prose>

      {/* ── Section 05: How Impact Market Works ── */}
      <SectionHeader number="05" title="How Impact Market Works" />
      <MethodBox />

      <Prose>
        <p>
          <strong>Today's signal structure is textbook Impact:</strong> the Polymarket crowd ($70–72K) is looking at{' '}
          <em>the near term landing zone</em> but has not priced the full fractal resolution ($53.3K).
          That gap between crowd consensus and structural path is where the opportunity lives.
          Execution is calibrated to the fractal target with the crowd data confirming the short term directional move
          before the real leg down begins.
        </p>
      </Prose>

      {/* ── Section 06: Scenario Tree ── */}
      <SectionHeader number="06" title="Next 48 Hours — Scenario Tree" />
      {scenarios.map((s, i) => (
        <ScenarioBlock key={i} trigger={s.trigger} body={s.body} watchLevel={s.watchLevel} />
      ))}

      {/* ── Section 07: The Position ── */}
      <SectionHeader number="07" title="The Position" />
      <PositionBox />

      {/* Footer disclaimer */}
      <div
        style={{
          ...mono,
          fontSize: 10,
          marginTop: 28,
          paddingTop: 14,
          borderTop: '1px solid var(--border, rgba(0,0,0,0.08))',
        }}
      >
        This brief is for informational purposes only and does not constitute financial advice.
        Source: Hyblock MCP, Polymarket, Impact Market fractal model. Built with live MCP data.
      </div>
    </BlogLayout>
  );
}
