'use client';

import React, { useEffect, useRef } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import { heroStats, platformStats, priceStats, ambaChartLabels, ambaChartPrices } from './data';

/* ── Palette ── */
const INK3 = '#777';

const byline: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK3,
  marginTop: 0,
  marginBottom: 8,
};

/* ── AmbaChart: high timeframe monthly price line (Chart.js on a raw canvas) ── */
function AmbaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    let mounted = true;
    import('chart.js/auto').then((mod) => {
      if (!mounted || !canvasRef.current) return;
      const Chart = mod.default;

      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }

      const gc = 'rgba(128,128,128,0.10)';
      const line = '#c94a00';
      const tickCfg = { font: { size: 9 as const }, maxTicksLimit: 8 };

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          labels: ambaChartLabels,
          datasets: [
            {
              data: ambaChartPrices,
              borderColor: line,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: true,
              backgroundColor: 'rgba(201,74,0,0.08)',
              tension: 0.3,
              label: 'AMBA',
            },
          ],
        },
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
              titleColor: '#999',
              bodyColor: '#e4e2d8',
              titleFont: { size: 9 },
              bodyFont: { size: 11 },
              padding: 9,
              callbacks: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (ctx: any) => `$${Number(ctx.parsed.y).toFixed(0)}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { ...tickCfg, maxTicksLimit: 10 },
              grid: { color: gc },
              border: { display: false },
            },
            y: {
              ticks: { ...tickCfg, callback: (v: string | number) => `$${v}` },
              grid: { color: gc },
              border: { display: false },
            },
          },
        },
      });
    });

    return () => {
      mounted = false;
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        background: 'var(--bg-card, #f5f4f0)',
        border: '1px solid var(--border-element, rgba(0,0,0,0.08))',
        borderRadius: 6,
        padding: '16px 18px 14px',
        margin: '24px 0',
        // The card surface is always light cream, so keep text dark in both themes.
        color: '#1a1a1a',
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontFamily: 'var(--font-geist-mono, monospace)',
          color: 'var(--ink-secondary, #999)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}
      >
        AMBA · Nasdaq · Monthly close
      </div>
      <div
        style={{
          fontSize: 15,
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontWeight: 500,
          marginBottom: 10,
          display: 'flex',
          alignItems: 'baseline',
          gap: 7,
        }}
      >
        ~$92
        <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--ink-secondary, #999)' }}>
          high timeframe view, roughly 2.5 years
        </span>
      </div>
      <div style={{ position: 'relative', height: 220 }}>
        <canvas ref={canvasRef} />
      </div>
      <div style={{ fontSize: 11, color: INK3, marginTop: 10, fontStyle: 'italic' }}>
        Approximate month end closes reconstructed from public sources (stockanalysis.com,
        companiesmarketcap.com). Recent anchors sit near reported values. Shown for trend context,
        not as exact tick data.
      </div>
    </div>
  );
}

export default function AmbarellaEdgeAI() {
  return (
    <BlogLayout meta={meta}>
      <Prose>
        <p style={byline}>Opinion · By Jan Cortenbach</p>

        <p>
          There are 45 million tiny chips out in the world right now, running AI on doorbells, dashboards,
          drones, and factory cameras. Most people who own one don&apos;t know it. Most investors who own the
          stock don&apos;t fully know what they&apos;ve bought. It&apos;s called Ambarella. And it just quietly
          became the largest independent edge AI chip company that isn&apos;t run by NVIDIA or a hyperscaler.
        </p>
        <p>
          Here&apos;s the pitch. The chip that already sees everywhere doesn&apos;t need to convince anyone.
          Ambarella already won its market. Now that market is expanding into every physical AI application on
          the planet. That&apos;s the thesis, and here&apos;s why it holds up.
        </p>
      </Prose>

      <StatGrid cells={heroStats} />

      {/* ── Section 01 ── */}
      <SectionHeader number="01" title="What edge AI actually means" />

      <Prose>
        <p>
          Cloud AI is what runs ChatGPT, the massive data centers doing the heavy lifting far away. Edge AI is
          when the chip in the device does the thinking itself. A security camera that recognizes a person
          without sending video to a server. A car that spots a pedestrian in 50 milliseconds instead of waiting
          for the internet. A robot that sees a broken pallet and adapts. Edge AI is faster, cheaper, and more
          private. It&apos;s like the difference between calling a friend for help and already knowing the answer
          yourself.
        </p>
      </Prose>

      {/* ── Section 02 ── */}
      <SectionHeader number="02" title="Ambarella owns this space" sourceTag="FY26 results" />

      <Prose>
        <p>
          FY26 revenue came in at $390.7 million, up 37% year over year. Roughly 80% of that revenue comes from
          edge AI applications. Their cumulative edge AI revenue just crossed $1 billion. They have 12 different
          AI chips in production, supporting more than 370 unique customer projects, running over 200 different
          AI model architectures. That&apos;s not a science project. That&apos;s a platform business with
          switching costs.
        </p>
      </Prose>

      <StatGrid cells={platformStats} />

      {/* ── Section 03 ── */}
      <SectionHeader number="03" title="Then there's the Hanwha deal" sourceTag="Q1 FY27" />

      <Prose>
        <p>
          Announced in Q1 FY27, it is an agreement worth more than $800 million over more than 10 years to
          jointly develop edge AI silicon for security cameras, robotics, industrial automation, and life sciences.
          That&apos;s the kind of deal that quietly takes the risk out of a whole decade of revenue. Hanwha is
          one of the largest security camera makers in the world. Locking them in for 10 years is not something
          you do with a shaky product.
        </p>
      </Prose>

      {/* ── Section 04 ── */}
      <SectionHeader number="04" title="The physical AI angle nobody's talking about" />

      <Prose>
        <p>
          The same chip family that runs the camera on your Ring doorbell is what a humanoid robot needs to see
          the world. Ambarella already has the manufacturing scale, the software stack, the customer
          relationships, and the low power silicon that a battery powered robot desperately needs. Building an AI
          accelerator for humanoids from scratch is like building a car company from scratch. Possible, but why
          would you when the parts are already there?
        </p>
      </Prose>

      {/* ── Section 05 ── */}
      <SectionHeader number="05" title="The risk sheet is honest" />

      <CalloutBox variant="amber">
        <p>
          Consumer IoT, meaning dashcams and action cameras, is declining as that market matures. Gross margins
          compressed a bit last quarter. And the stock trades at a premium, with analyst estimates putting the
          forward P/E around 50x. That leaves no room to disappoint. If AI adoption at the edge slows, the
          multiple contracts fast.
        </p>
      </CalloutBox>

      {/* ── Section 06 ── */}
      <SectionHeader number="06" title="But look at what's happening structurally" />

      <Prose>
        <p>
          Automotive revenue is at record highs, driven by AI in commercial vehicles. The chip design cycle is
          spinning off higher margin AI SoCs that command better prices. And robotics is a stated growth vertical
          that management is investing behind. This isn&apos;t a company hoping for the AI wave. It&apos;s a
          company that already caught it and is now widening the ride.
        </p>
      </Prose>

      <CalloutBox variant="blue">
        <p>
          Compare it to Ouster or Aeva, sensor plays that still burn cash. Ambarella is already profitable,
          already scaled, and already has the customers. It&apos;s not a bet on physical AI happening. It&apos;s
          a bet on physical AI happening on top of hardware they already ship.
        </p>
      </CalloutBox>

      {/* ── Section 07 ── */}
      <SectionHeader number="07" title="The high timeframe picture" sourceTag="AMBA monthly" />

      <Prose>
        <p>
          The tape tells the same story the fundamentals do. After a long base in the fifties and a washout to
          the high forties in 2025, the stock has broken out toward the mid nineties, near the top of its
          trailing year range. The market is starting to price in the edge AI and robotics thesis, which is
          exactly why the risk sheet above matters. You are no longer buying this quietly.
        </p>
      </Prose>

      <AmbaChart />

      <StatGrid cells={priceStats} />

      <Prose>
        <p>
          The most valuable chip company in your basket might be the one you&apos;ve never heard of. That&apos;s
          usually how it works. By the time it&apos;s obvious, the trade is over.
        </p>

        <p style={{ fontSize: 12, color: INK3, fontStyle: 'italic' }}>
          Opinion by Jan Cortenbach. Not investment advice. Verify all numbers against primary filings.
        </p>
      </Prose>
    </BlogLayout>
  );
}
