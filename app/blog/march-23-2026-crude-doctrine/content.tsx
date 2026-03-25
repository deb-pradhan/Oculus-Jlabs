'use client';

import { useEffect } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  cascadeChartData,
  supplyGapData,
  bufferData,
  assetImpactData,
  originalProbData,
  revisedProbData,
  strikeLog,
  phases,
  timeline,
  scenarios,
  chokepoints,
} from './data';

/* ── Colours ─────────────────────────────────────────────────────────────── */
const C = {
  amber: '#E8A020',
  red: '#E74C3C',
  redDark: '#C0392B',
  green: '#27AE60',
  blue: '#3498DB',
  dim: '#6B6860',
  border: '#2A2A32',
  textBright: '#f0ede4',
};

/* ── Reusable inline styles ──────────────────────────────────────────────── */
const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-secondary, #888)',
};

const sectionLabel: React.CSSProperties = {
  ...mono,
  color: C.amber,
  marginBottom: 4,
  fontSize: 10,
};

const cardBg: React.CSSProperties = {
  background: 'var(--surface-secondary, rgba(0,0,0,0.03))',
  borderRadius: 8,
  padding: '18px 20px',
};

/* ── Tag badges ──────────────────────────────────────────────────────────── */
function TagBadge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.08em',
        borderRadius: 3,
        whiteSpace: 'nowrap',
        background:
          color === 'green'
            ? 'rgba(39,174,96,0.14)'
            : color === 'amber'
              ? 'rgba(232,160,32,0.14)'
              : color === 'red'
                ? 'rgba(231,76,60,0.14)'
                : 'var(--surface-secondary, rgba(0,0,0,0.06))',
        color:
          color === 'green'
            ? C.green
            : color === 'amber'
              ? C.amber
              : color === 'red'
                ? C.red
                : 'var(--ink-secondary, #888)',
        border: `1px solid ${
          color === 'green'
            ? 'rgba(39,174,96,0.25)'
            : color === 'amber'
              ? 'rgba(232,160,32,0.25)'
              : color === 'red'
                ? 'rgba(231,76,60,0.25)'
                : 'var(--border, rgba(0,0,0,0.08))'
        }`,
      }}
    >
      {text}
    </span>
  );
}

/* ── Signal bar at top ───────────────────────────────────────────────────── */
function SignalBar() {
  const tags = [
    { text: 'CONFIRMED STRIKE CAMPAIGN', color: 'red' },
    { text: 'DAY 22 ACTIVE', color: 'amber' },
    { text: 'DIPLOMACY LIVE', color: 'green' },
    { text: 'PHASE 2 > 3 TRANSITION', color: 'dim' },
    { text: 'ENERGY SECURITY', color: 'dim' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24, alignItems: 'center' }}>
      <span style={{ ...mono, marginRight: 4 }}>Status</span>
      {tags.map((t, i) => (
        <TagBadge key={i} text={t.text} color={t.color} />
      ))}
    </div>
  );
}

/* ── Chart wrapper ───────────────────────────────────────────────────────── */
function ChartCanvas({
  id,
  height = 300,
  title,
  titleRight,
}: {
  id: string;
  height?: number;
  title: string;
  titleRight?: string;
}) {
  return (
    <div style={{ ...cardBg, marginTop: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          ...mono,
          letterSpacing: '0.1em',
        }}
      >
        <span>{title}</span>
        {titleRight && <span style={{ color: C.amber }}>{titleRight}</span>}
      </div>
      <canvas id={id} height={height} style={{ maxWidth: '100%' }} />
    </div>
  );
}

/* ── Strike table ────────────────────────────────────────────────────────── */
function StrikeTable() {
  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <div style={{ ...sectionLabel, marginBottom: 10 }}>Polymarket Strike Series — Full Resolution Log</div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            {['Day', 'Date', 'Market Question', 'Resolution', 'Volume', 'Model Phase'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '9px 12px',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-secondary, #888)',
                  borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
                  background: 'var(--surface-secondary, rgba(0,0,0,0.02))',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {strikeLog.map((row, i) => (
            <tr
              key={i}
              style={
                row.isToday
                  ? { background: 'rgba(232,160,32,0.06)', color: C.amber }
                  : {}
              }
            >
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : 'var(--ink-secondary, #888)' }}>{row.day}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : 'var(--ink-secondary, #888)', whiteSpace: 'nowrap' }}>{row.date}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : 'var(--ink-primary, #ccc)' }}>{row.question}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : row.resolution === 'PHASE 2' ? C.amber : C.green, fontWeight: 600 }}>{row.resolution === 'YES' || row.resolution === 'YES x 6' ? `● ${row.resolution}` : row.resolution === 'PHASE 2' ? '⚡ PHASE 2' : row.resolution}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : 'var(--ink-secondary, #888)' }}>{row.volume}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: row.isToday ? C.amber : 'var(--ink-secondary, #888)' }}>{row.phase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Phase table ─────────────────────────────────────────────────────────── */
function PhaseTable() {
  return (
    <div style={{ overflowX: 'auto', marginTop: 20 }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            {['Phase', 'Day Range', 'Brent Range', 'Primary Mechanism', 'Status'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '9px 12px',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-secondary, #888)',
                  borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
                  background: 'var(--surface-secondary, rgba(0,0,0,0.02))',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {phases.map((p) => (
            <tr key={p.num}>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', verticalAlign: 'top' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink-secondary, #888)', lineHeight: 1 }}>{p.num}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-primary, #ccc)', marginTop: 4 }}>{p.name}</div>
              </td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', ...mono, verticalAlign: 'top' }}>{p.days}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', color: C.amber, fontSize: 15, fontWeight: 600, verticalAlign: 'top' }}>{p.brent}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', fontSize: 12, color: 'var(--ink-secondary, #888)', maxWidth: 360, lineHeight: 1.55, verticalAlign: 'top' }}>{p.mechanism}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))', verticalAlign: 'top' }}>
                <TagBadge text={p.status} color={p.statusType === 'green' ? 'green' : p.statusType === 'amber' ? 'amber' : 'dim'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Timeline ────────────────────────────────────────────────────────────── */
function Timeline() {
  return (
    <div style={{ marginTop: 24 }}>
      {timeline.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 16,
            opacity: item.isForecast ? 0.5 : 1,
            borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
            padding: '14px 0',
          }}
        >
          <div
            style={{
              width: 110,
              flexShrink: 0,
              ...mono,
              paddingTop: 2,
              textAlign: 'right',
            }}
          >
            {item.date}
          </div>
          <div
            style={{
              width: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 6,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.isActive ? C.red : C.amber,
                boxShadow: item.isActive ? `0 0 0 3px rgba(231,76,60,0.2)` : 'none',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-primary, #ccc)' }}>
              {item.title}
              {item.badge && (
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: 10,
                    padding: '2px 8px',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: 3,
                    verticalAlign: 'middle',
                    background:
                      item.badgeType === 'confirmed'
                        ? 'rgba(39,174,96,0.15)'
                        : item.badgeType === 'active'
                          ? 'rgba(232,160,32,0.15)'
                          : 'rgba(231,76,60,0.15)',
                    color:
                      item.badgeType === 'confirmed'
                        ? C.green
                        : item.badgeType === 'active'
                          ? C.amber
                          : C.red,
                    border: `1px solid ${
                      item.badgeType === 'confirmed'
                        ? 'rgba(39,174,96,0.25)'
                        : item.badgeType === 'active'
                          ? 'rgba(232,160,32,0.25)'
                          : 'rgba(231,76,60,0.25)'
                    }`,
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 13,
                color: item.isActive ? C.red : C.amber,
                fontWeight: 600,
                margin: '2px 0 6px',
              }}
            >
              {item.price}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary, #888)', lineHeight: 1.6 }}>{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Scenario cards ──────────────────────────────────────────────────────── */
function ScenarioCards() {
  const colors = { bear: C.green, base: C.amber, bull: C.red };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 20 }}>
      {scenarios.map((s, i) => (
        <div key={i} style={{ ...cardBg, borderTop: `3px solid ${colors[s.type]}` }}>
          <div style={{ ...mono, fontSize: 10, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-primary, #ccc)', marginBottom: 10 }}>{s.title}</div>
          <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1, color: colors[s.type], marginBottom: 4 }}>{s.price}</div>
          <div style={{ ...mono, fontSize: 11, marginBottom: 14 }}>{s.prob}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {s.points.map((p, j) => (
              <li
                key={j}
                style={{
                  fontSize: 12,
                  color: 'var(--ink-secondary, #888)',
                  padding: '5px 0',
                  borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))',
                  display: 'flex',
                  gap: 8,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: colors[s.type], flexShrink: 0 }}>&mdash;</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Chokepoint cards ────────────────────────────────────────────────────── */
function ChokepointGrid() {
  const colorMap = { red: C.red, amber: C.amber, blue: C.blue };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 20 }}>
      {chokepoints.map((cp, i) => (
        <div key={i} style={{ ...cardBg, borderBottom: `2px solid ${colorMap[cp.color]}` }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-primary, #ccc)', marginBottom: 4 }}>{cp.name}</div>
          <div style={{ ...mono, fontSize: 11, color: colorMap[cp.color], marginBottom: 12 }}>{cp.volume}</div>
          {cp.rows.map(([label, val], j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ ...mono, fontSize: 10 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 11, color: 'var(--ink-primary, #ccc)' }}>{val}</span>
            </div>
          ))}
          <div style={{ height: 3, background: 'var(--surface-secondary, rgba(0,0,0,0.06))', marginTop: 10, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${cp.fillPct}%`, background: colorMap[cp.color], borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Polymarket card ─────────────────────────────────────────────────────── */
function PolymarketCard({
  status,
  statusColor,
  question,
  stats,
  note,
}: {
  status: string;
  statusColor: string;
  question: string;
  stats: { label: string; value: string }[];
  note: React.ReactNode;
}) {
  return (
    <div style={{ ...cardBg, borderTop: `3px solid ${statusColor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, ...mono, fontSize: 9, color: statusColor }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
        {status}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary, #ccc)', lineHeight: 1.4, marginBottom: 12 }}>{question}</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...mono, fontSize: 10 }}>
            {s.label}
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-primary, #ccc)' }}>{s.value}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 4, background: 'var(--surface-secondary, rgba(0,0,0,0.06))', borderRadius: 2 }}>
        <div style={{ height: '100%', width: '100%', background: statusColor, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-secondary, #888)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border, rgba(0,0,0,0.08))', lineHeight: 1.55, fontStyle: 'italic' }}>
        {note}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Main content component                                                  */
/* ══════════════════════════════════════════════════════════════════════════ */
export default function CrudeDoctrineMar232026() {
  useEffect(() => {
    let charts: { destroy: () => void }[] = [];

    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Destroy any existing chart instances (React Strict Mode double-mount)
      const canvasIds = ['cascadeChart', 'supplyChart', 'bufferChart', 'origProb', 'revProb', 'assetChart'];
      canvasIds.forEach((id) => {
        const existing = Chart.getChart(id);
        if (existing) existing.destroy();
      });

      const isDark =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
      const tickColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

      Chart.defaults.color = tickColor;
      Chart.defaults.borderColor = gridColor;
      Chart.defaults.font.family = "'IBM Plex Mono', monospace";
      Chart.defaults.font.size = 11;

      const el = (id: string) => document.getElementById(id) as HTMLCanvasElement | null;

      const { days } = cascadeChartData;
      const base = cascadeChartData.base(days);
      const bull = cascadeChartData.bull(days);
      const bear = cascadeChartData.bear(days);

      // Cascade chart
      const cascadeEl = el('cascadeChart');
      if (cascadeEl) {
        charts.push(
          new Chart(cascadeEl, {
            type: 'line',
            data: {
              labels: days,
              datasets: [
                { label: 'Bull', data: bull, borderColor: 'rgba(231,76,60,0.35)', borderWidth: 1.2, borderDash: [4, 4], fill: false, pointRadius: 0, tension: 0.4 },
                { label: 'Base Case', data: base, borderColor: C.amber, borderWidth: 2.5, fill: false, pointRadius: 0, tension: 0.4 },
                { label: 'Bear', data: bear, borderColor: 'rgba(39,174,96,0.35)', borderWidth: 1.2, borderDash: [4, 4], fill: false, pointRadius: 0, tension: 0.4 },
                { label: 'Confirmed (D1-10)', data: days.map((d) => (d <= 10 ? base[d] : null)), borderColor: C.green, borderWidth: 3, fill: false, pointRadius: 0, tension: 0.4 },
                { label: 'Active (D11-22)', data: days.map((d) => (d >= 10 && d <= 22 ? base[d] : null)), borderColor: 'rgba(232,160,32,0.8)', borderWidth: 3, fill: false, pointRadius: 0, tension: 0.4 },
                { label: 'Today D22', data: days.map((_, i) => (i === 22 ? base[22] : null)), borderWidth: 0, pointRadius: 9, pointBackgroundColor: C.red, fill: false },
              ],
            },
            options: {
              responsive: true,
              interaction: { mode: 'index', intersect: false },
              plugins: { legend: { labels: { boxWidth: 16, padding: 14 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toFixed(0)}/bbl` } } },
              scales: {
                x: { grid: { color: gridColor }, ticks: { maxTicksLimit: 11, callback: (v) => `D${v}` } },
                y: { grid: { color: gridColor }, ticks: { callback: (v) => `$${v}` }, min: 75, max: 215 },
              },
            },
          })
        );
      }

      // Supply gap
      const supplyEl = el('supplyChart');
      if (supplyEl) {
        charts.push(
          new Chart(supplyEl, {
            type: 'bar',
            data: {
              labels: supplyGapData.labels,
              datasets: [
                {
                  data: supplyGapData.values,
                  backgroundColor: [
                    'rgba(231,76,60,0.7)', 'rgba(52,152,219,0.55)', 'rgba(52,152,219,0.4)',
                    'rgba(52,152,219,0.5)', 'rgba(52,152,219,0.4)', 'rgba(52,152,219,0.3)', 'rgba(231,76,60,0.9)',
                  ],
                  borderColor: [C.red, C.blue, C.blue, C.blue, C.blue, C.blue, C.red],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${(ctx.parsed.y ?? 0).toFixed(1)} mb/d` } } },
              scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } },
            },
          })
        );
      }

      // Buffer depletion
      const bufferEl = el('bufferChart');
      if (bufferEl) {
        charts.push(
          new Chart(bufferEl, {
            type: 'line',
            data: {
              labels: bufferData.days,
              datasets: [
                { label: 'Floating Storage (M bbl)', data: bufferData.floatingStorage, borderColor: C.amber, borderWidth: 2, fill: true, backgroundColor: 'rgba(232,160,32,0.07)', pointRadius: 3, tension: 0.3 },
                { label: 'US/IEA SPR Available (M bbl)', data: bufferData.sprAvailable, borderColor: C.blue, borderWidth: 2, fill: true, backgroundColor: 'rgba(52,152,219,0.05)', pointRadius: 3, tension: 0.3, yAxisID: 'y2' },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { labels: { boxWidth: 14 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y ?? 0}M bbl` } } },
              scales: {
                x: { grid: { color: gridColor }, ticks: { callback: (_, i) => `D${bufferData.days[i]}` } },
                y: { min: 0, max: 100, grid: { color: gridColor }, title: { display: true, text: 'Floating (M bbl)', color: C.amber } },
                y2: { min: 0, max: 450, position: 'right', grid: { display: false }, title: { display: true, text: 'SPR (M bbl)', color: C.blue } },
              },
            },
          })
        );
      }

      // Original prob
      const origProbEl = el('origProb');
      if (origProbEl) {
        charts.push(
          new Chart(origProbEl, {
            type: 'doughnut',
            data: {
              labels: originalProbData.labels,
              datasets: [
                {
                  data: originalProbData.values,
                  backgroundColor: ['rgba(39,174,96,0.7)', 'rgba(39,174,96,0.35)', 'rgba(232,160,32,0.7)', 'rgba(231,76,60,0.65)', 'rgba(192,57,43,0.9)'],
                  borderColor: [C.green, C.green, C.amber, C.red, C.redDark],
                  borderWidth: 1.5,
                },
              ],
            },
            options: { cutout: '56%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 10 } } } } },
          })
        );
      }

      // Revised prob
      const revProbEl = el('revProb');
      if (revProbEl) {
        charts.push(
          new Chart(revProbEl, {
            type: 'doughnut',
            data: {
              labels: revisedProbData.labels,
              datasets: [
                {
                  data: revisedProbData.values,
                  backgroundColor: ['rgba(39,174,96,0.1)', 'rgba(52,152,219,0.55)', 'rgba(232,160,32,0.75)', 'rgba(231,76,60,0.7)', 'rgba(192,57,43,0.95)'],
                  borderColor: [C.green, C.blue, C.amber, C.red, C.redDark],
                  borderWidth: 1.5,
                },
              ],
            },
            options: { cutout: '56%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 10 } } } } },
          })
        );
      }

      // Asset impact
      const assetEl = el('assetChart');
      if (assetEl) {
        charts.push(
          new Chart(assetEl, {
            type: 'bar',
            data: {
              labels: assetImpactData.labels,
              datasets: [
                {
                  label: 'Est. % Change Day 30',
                  data: assetImpactData.values,
                  backgroundColor: assetImpactData.values.map((v) => (v >= 0 ? (v > 20 ? 'rgba(231,76,60,0.65)' : 'rgba(232,160,32,0.55)') : 'rgba(39,174,96,0.5)')),
                  borderColor: assetImpactData.values.map((v) => (v >= 0 ? C.red : C.green)),
                  borderWidth: 1,
                },
              ],
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => { const x = ctx.parsed.x ?? 0; return ` ${x > 0 ? '+' : ''}${x}%`; } } } },
              scales: { x: { grid: { color: gridColor }, ticks: { callback: (v) => `${Number(v) > 0 ? '+' : ''}${v}%` } }, y: { grid: { display: false } } },
            },
          })
        );
      }
    }

    draw();
    return () => charts.forEach((c) => c.destroy());
  }, []);

  return (
    <BlogLayout meta={meta}>
      <SignalBar />

      {/* ── Hero stats ── */}
      <StatGrid
        cells={[
          { label: 'Strike Days Confirmed YES', value: '10/10', sub: '$7M total volume', direction: 'nt' },
          { label: 'Hormuz Daily Throughput at Risk', value: '21 mb/d', sub: '~21% of global oil demand', direction: 'dn' },
          { label: 'Phase 4 Panic Peak Ceiling', value: '$185', sub: 'Day 60-90 forecast', direction: 'up' },
          { label: 'Critical Inflection — Passed', value: 'Day 14', sub: 'Floating storage exhausted', direction: 'dn' },
        ]}
      />

      {/* ── Ch 1: Polymarket intelligence ── */}
      <SectionHeader number="01" title="The Crowd Was Right" sourceTag="Polymarket" />
      <Prose>
        <p>
          Polymarket real-money markets across the Iran geopolitical cluster. All values represent collective crowd intelligence bets with skin in the game.
        </p>
      </Prose>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 16 }}>
        <PolymarketCard
          status="Resolved YES — 10/10 Days"
          statusColor={C.green}
          question="US/Israel strikes Iran — Sustained 10 day campaign, March 1-10, 2026"
          stats={[
            { label: 'Total Volume', value: '$7.0M' },
            { label: 'Peak Day', value: 'Mar 3 ($2.13M)' },
            { label: 'Days Hit', value: '10/10' },
          ]}
          note={
            <>
              <strong style={{ color: C.amber, fontStyle: 'normal' }}>Signal read:</strong> Volume peaked March 1-3, then declined each day. Classic confirmation pattern — market was front-running intelligence, not reacting to news.
            </>
          }
        />
        <PolymarketCard
          status="Resolved YES — Switzerland"
          statusColor={C.green}
          question="Where will the next US-Iran diplomatic meeting happen? Switzerland, Feb 26, 2026"
          stats={[
            { label: 'Event Volume', value: '$379K' },
            { label: 'Switzerland', value: '$87.7K — Won' },
            { label: 'Date', value: 'Feb 26' },
          ]}
          note={
            <>
              <strong style={{ color: C.amber, fontStyle: 'normal' }}>The underrated signal:</strong> Diplomacy happened Feb 26 — <strong style={{ fontStyle: 'normal' }}>3 days before</strong> the first strike. The Switzerland channel remains the active ceasefire mechanism.
            </>
          }
        />
        <PolymarketCard
          status="Resolved YES — H2 2025"
          statusColor={C.green}
          question="Another US military action against Iran before 2026? (June-Dec 2025)"
          stats={[
            { label: 'Volume', value: '$1.18M' },
            { label: 'Resolution', value: 'Jan 1, 2026' },
            { label: 'Verdict', value: 'YES' },
          ]}
          note={
            <>
              <strong style={{ color: C.amber, fontStyle: 'normal' }}>Context shift:</strong> March 2026 is the <strong style={{ fontStyle: 'normal' }}>second confirmed kinetic episode</strong>, not the first.
            </>
          }
        />
      </div>

      <StrikeTable />

      {/* ── Ch 2: Executive summary ── */}
      <SectionHeader number="02" title="The Arithmetic of Catastrophe" />
      <CalloutBox variant="amber">
        A sustained disruption to the Strait of Hormuz — now confirmed as underway following US/Israel strikes on Iran across 10 consecutive days in March 2026 — represents the single most catastrophic non-nuclear supply shock the global energy system can absorb. We are currently at Day 22. The peak price range of $150-200/bbl is the mathematical consequence of removing 21 million barrels per day from global circulation.
      </CalloutBox>

      <CalloutBox variant="red">
        <strong>Current Position — Day 22 — Phase 2: SPR Offset.</strong> IEA coordinated SPR release (~2 mb/d) is now the active supply response mechanism. This covers approximately 12-15% of the net supply gap — buying time, not solving the problem. The next 13 days (Days 22-35) will determine whether Brent tracks toward $95-115 or whether diplomatic breakthrough forces a premature Phase 1 reversal.
      </CalloutBox>

      {/* ── Ch 3: Price cascade ── */}
      <SectionHeader number="03" title="Brent Price Trajectory" />
      <Prose>
        <p>
          Base / bull / bear case Brent trajectory with confirmed Polymarket-verified events overlaid. Today (Day 22) marked in red. Demand destruction threshold at $130 creates a natural ceiling.
        </p>
      </Prose>
      <ChartCanvas id="cascadeChart" title="BRENT CRUDE / USD — DURATION x CHOKEPOINT CASCADE MODEL — DAYS 0-100" titleRight="TODAY = DAY 22" height={320} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
        <ChartCanvas id="supplyChart" title="SUPPLY GAP VS AVAILABLE OFFSETS" titleRight="MB/D" height={280} />
        <ChartCanvas id="bufferChart" title="BUFFER DEPLETION — FLOATING STORAGE & SPR" titleRight="MILLIONS BBL" height={280} />
      </div>

      {/* ── Ch 4: Phase anatomy ── */}
      <SectionHeader number="04" title="The Five Phases" />
      <PhaseTable />

      {/* ── Ch 5: Timeline ── */}
      <SectionHeader number="05" title="The Calendar of Crisis" />
      <Prose>
        <p>Polymarket-confirmed events mapped against model-forecast phases. The Switzerland back-channel is the critical variable determining whether we reach Phase 3 or revert.</p>
      </Prose>
      <Timeline />

      {/* ── Ch 6: Chokepoints ── */}
      <SectionHeader number="06" title="Bypass Capacity and Alternative Routes" />
      <ChokepointGrid />

      {/* ── Ch 7: Scenarios ── */}
      <SectionHeader number="07" title="Three Paths from Day 22" />
      <Prose>
        <p>Original model probabilities revised in light of Polymarket-confirmed events. The no closure scenario is eliminated. Probability mass migrated to structural disruption and full closure.</p>
      </Prose>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
        <ChartCanvas id="origProb" title="ORIGINAL PROBABILITIES" titleRight="PRE-EVENTS" height={280} />
        <ChartCanvas id="revProb" title="REVISED PROBABILITIES" titleRight="POST-POLYMARKET / DAY 22" height={280} />
      </div>
      <ScenarioCards />

      <CalloutBox variant="red">
        <strong>Critical Revision:</strong> The original model assigned 35% probability to de-escalation / no closure. That probability is now effectively zero — strikes confirmed across 10 consecutive days, floating storage exhausted, SPR response active. The question is no longer if disruption occurred but how long it persists. Watch the Switzerland channel — it is the sole de-escalation mechanism with confirmed activation.
      </CalloutBox>

      {/* ── Ch 8: Second-order effects ── */}
      <SectionHeader number="08" title="Beyond Oil — Full System Impact" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
        <ChartCanvas id="assetChart" title="ASSET CLASS IMPACT — DAY 30 SNAPSHOT" titleRight="EST. % CHANGE" height={320} />
        <div style={cardBg}>
          <div style={sectionLabel}>Macro Transmission — Second Order</div>
          <Prose>
            <p><strong>Inflation:</strong> A sustained $50/bbl increase above baseline translates to ~2.5-3.5% additional CPI within 90 days in import-dependent economies.</p>
            <p><strong>FX Markets:</strong> USD strengthens as petrodollar recycling dynamics invert. JPY collapses (Japan ~88% energy import-dependent). INR, TRY, PKR face crisis-level current account pressure.</p>
            <p><strong>Food Security:</strong> Fertilizer (natural gas derivative) and agricultural transport costs spike simultaneously — the mechanism by which an oil crisis becomes a food crisis in the Global South within 60-90 days.</p>
            <p><strong style={{ color: C.amber }}>The China Variable:</strong> China holds ~900M barrels strategic reserves (~90 days import cover). China does not panic. China buys Atlantic Basin crude while competitors hoard. China emerges from a 100-day closure with its strategic position improved relative to every major competitor except the US.</p>
          </Prose>
        </div>
      </div>

      {/* ── Ch 9: Trade positioning ── */}
      <SectionHeader number="09" title="Where to Be from Day 22" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 16 }}>
        <div style={cardBg}>
          <div style={{ ...sectionLabel, color: C.green }}>Long — Energy Complex</div>
          <Prose>
            <p><strong style={{ color: C.green }}>Brent Calendar Spread:</strong> Buy prompt, sell deferred. As backwardation steepens, the Dec/Dec spread moves 3-5x more than outright prices in supply shock events.</p>
            <p><strong style={{ color: C.green }}>US Shale Producers:</strong> Immediate margin expansion at $100+ crude. Watch for windfall tax political risk above $150.</p>
            <p><strong style={{ color: C.green }}>LNG Infrastructure:</strong> Energy-switching demand from oil to gas creates secondary LNG spike, especially Europe and East Asia.</p>
            <p><strong style={{ color: C.green }}>Defense Equities:</strong> Immediate multiple expansion. Caveat: violent reversal on ceasefire/diplomatic settlement.</p>
          </Prose>
        </div>
        <div style={cardBg}>
          <div style={{ ...sectionLabel, color: C.red }}>Short — Demand Destruction</div>
          <Prose>
            <p><strong style={{ color: C.red }}>Airlines:</strong> Jet fuel is 20-30% of operating costs. At $150+ crude, a 60-day disruption is existential for carriers without substantial hedges.</p>
            <p><strong style={{ color: C.red }}>Petrochemicals:</strong> Feedstock cost explosion + simultaneous demand decline.</p>
            <p><strong style={{ color: C.red }}>EM Equities:</strong> Turkey, India, Pakistan, Bangladesh — current account deterioration immediate. FX losses compound equity losses.</p>
            <p><strong style={{ color: C.red }}>Japanese Yen:</strong> Japan ~88% energy import-dependent. Short JPY vs USD is the macro expression trade.</p>
          </Prose>
        </div>
        <div style={cardBg}>
          <div style={{ ...sectionLabel, color: C.blue }}>Volatility and Optionality</div>
          <Prose>
            <p><strong style={{ color: C.blue }}>OVX (Oil VIX):</strong> Selling vol into the spike at Day 30-45 is the historical high-conviction mean-reversion trade once SPR visibility improves.</p>
            <p><strong style={{ color: C.blue }}>Gold:</strong> If the Fed pauses (likely), gold benefits disproportionately. Target $3,200-3,500 in sustained crisis.</p>
            <p><strong style={{ color: C.blue }}>Polymarket Signal:</strong> Watch for new ceasefire / Hormuz closure markets. $200K+ volume on a ceasefire market = leading indicator.</p>
          </Prose>
        </div>
      </div>

      {/* ── Ch 10: Analyst verdict ── */}
      <SectionHeader number="10" title="The Bottom Line" />
      <CalloutBox variant="amber">
        The Duration x Chokepoint Framework reveals a fundamental truth: the global oil system has exactly zero redundancy at the scale of a Hormuz closure. The buffers — floating storage, SPR, spare capacity — buy days and weeks, not months. We have now passed Day 14. Floating storage is gone. The market is now pricing physical shortage, not geopolitical risk.
      </CalloutBox>
      <CalloutBox variant="amber">
        Polymarket&apos;s most important contribution is the 18:1 ratio between strike volume ($7M) and diplomatic volume ($379K). The crowd bet 18x more on the military outcome than the diplomatic one. That ratio tells you everything about collective conviction. Watch for new ceasefire markets opening on Polymarket. That will be the signal before the crude market moves.
      </CalloutBox>
      <div style={{ ...cardBg, marginTop: 16 }}>
        <div style={sectionLabel}>The 13 Day Window — Days 22 to 35</div>
        <Prose>
          <p>We are at the most consequential decision point in the model. Days 22-35 is the window during which either the Switzerland channel produces a ceasefire framework (triggering a violent $20-30 downside correction in Brent) or Phase 3 physical shortages become self-reinforcing (locking in the $115-145 trajectory with no diplomatic off-ramp until Day 60+). <strong style={{ color: C.amber }}>There is no graceful middle path from here.</strong></p>
          <p>The bottom line in a single sentence: The Switzerland channel is the only thing standing between Day 22 and $145 crude by April — watch it like your portfolio depends on it, because it does.</p>
        </Prose>
      </div>

      {/* ── Source ── */}
      <div
        style={{
          ...mono,
          fontSize: 10,
          marginTop: 28,
          paddingTop: 14,
          borderTop: '1px solid var(--border, rgba(0,0,0,0.08))',
          color: 'var(--ink-secondary, #888)',
        }}
      >
        Crude Doctrine — Duration x Chokepoint Framework + Polymarket Intelligence — March 23, 2026 — All scenario prices are probabilistic model outputs — Not financial advice — Polymarket data sourced via MCP
      </div>
    </BlogLayout>
  );
}
