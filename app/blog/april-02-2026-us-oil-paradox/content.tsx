'use client';

import React, { useEffect, useState, useCallback } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  heroStats,
  histLabels, histImports, histExports, histProduction, histAnnotations,
  supplierLabels, supplierOPEC, supplierCanada, supplierOthers,
  importPieLabels, importPieData, importPieColors,
  exportPieLabels, exportPieData, exportPieColors,
  exportDestLabels, exportDest2024, exportDest2025,
  countryShiftsDown, countryShiftsUp,
  netTradeLabels, netTradeExports, netTradeImports,
  infraCards,
  vlccLabels, vlccCosts, vlccColors,
  supplyGapRows,
  gulfDepLabels, gulfDepData, gulfDepColors,
  transmissionLabels, transmissionData, transmissionColors, transmissionTooltips,
  sectorLabels, sectorData,
  bondLabels, bondPreCrisis, bondCurrent,
  btcStrikes, btcProbs,
  polyCards,
  wtiDistLabels, wtiDistData, wtiDistColors,
  oilPriceLabels, oilPrices,
  radarLabels, radarDefaults,
  scenMatrixLabels, scenFast, scenModerate, scenProlonged,
  scenarioCards,
  equityCards, bondCards, cryptoCards,
  type InfraItem, type AssetCardData,
} from './data';

/* ── Palette ── */
const BLUE = '#1a3a5c';
const BLUE2 = '#2d5a8b';
const GREEN = '#1a5c2e';
const RED = '#8b1a1a';
const AMBER = '#6b4200';
const ORANGE = '#c94a00';
const INK = '#1a1a1a';
const INK3 = '#777';
const BORDER = '#e0ddd8';
const SUBTLE = '#f4f2ee';
const CARD = '#fff';

const gc = 'rgba(0,0,0,0.06)';
const tc = '#888';

const sans: React.CSSProperties = {
  fontFamily: "var(--font-geist-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif)",
};

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK3,
};

/* ================================================================
   Reusable sub components
   ================================================================ */

/* ── InfraCard: infrastructure gauge card ── */
function InfraCard({ item }: { item: InfraItem }) {
  const statusBg: Record<string, string> = { red: '#f5e6e6', amber: '#f5eed6', green: '#e6f5eb' };
  const statusFg: Record<string, string> = { red: RED, amber: AMBER, green: GREEN };
  return (
    <div
      style={{
        background: item.notBuilt ? SUBTLE : CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: INK, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        {item.name}
        <span
          style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 10,
            fontWeight: 600,
            background: statusBg[item.statusColor],
            color: statusFg[item.statusColor],
          }}
        >
          {item.status}
        </span>
      </div>
      <div style={{ margin: '8px 0' }}>
        <div style={{ ...sans, fontSize: 11, color: INK3, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.gaugeLabel}</span>
          <span>{item.pct}%</span>
        </div>
        <div style={{ height: 12, background: SUBTLE, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 6, width: `${item.pct}%`, background: item.gaugeColor, transition: 'width 0.8s ease' }} />
        </div>
      </div>
      <div style={{ ...sans, fontSize: 11, color: INK3, marginTop: 8, lineHeight: 1.5 }}>{item.note}</div>
    </div>
  );
}

/* ── AssetCard: for market tab cards ── */
function AssetCard({ card }: { card: AssetCardData }) {
  const badgeBg: Record<string, string> = { up: '#e6f5eb', dn: '#f5e6e6', neutral: '#f5eed6' };
  const badgeFg: Record<string, string> = { up: GREEN, dn: RED, neutral: AMBER };
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: 14, borderLeftColor: card.borderColor, borderLeftWidth: 3 }}>
      <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3, background: badgeBg[card.badgeType], color: badgeFg[card.badgeType] }}>
          {card.badge}
        </span>
        {card.title}
      </h4>
      <p style={{ fontSize: 14, color: '#444', lineHeight: 1.55, margin: 0 }}>{card.body}</p>
    </div>
  );
}

/* ── PolyCard: prediction market card ── */
function PolyCard({ label, value, valueColor, desc, source }: {
  label: string; value: string; valueColor: string; desc: string; source: string;
}) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
      <div style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3, marginBottom: 8 }}>{label}</div>
      <div style={{ ...sans, fontSize: 26, fontWeight: 700, marginBottom: 4, color: valueColor }}>{value}</div>
      <div style={{ ...sans, fontSize: 11, color: INK3, lineHeight: 1.4 }}>{desc}</div>
      <div style={{ ...sans, fontSize: 10, color: INK3, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>{source}</div>
    </div>
  );
}

/* ── ChartBlock: consistent chart container ── */
function ChartBlock({ title, sub, note, children }: {
  title: string; sub?: string; note?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 24, margin: '28px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ ...sans, fontSize: 14, fontWeight: 700, color: INK, marginBottom: 4 }}>{title}</div>
        {sub && <div style={{ ...sans, fontSize: 12, color: INK3 }}>{sub}</div>}
      </div>
      {children}
      {note && <p style={{ ...sans, fontSize: 11, color: INK3, marginTop: 8, fontStyle: 'italic' }}>{note}</p>}
    </div>
  );
}

/* ── ChartLegend: colored dots with labels ── */
function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12, ...sans, fontSize: 12, color: INK3 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: it.color, flexShrink: 0 }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ── CountryShiftCard ── */
function CountryShiftCard({ name, detail, variant }: { name: string; detail: string; variant: 'up' | 'dn' }) {
  const bg = variant === 'dn' ? '#f5e6e6' : '#e6f5eb';
  const fg = variant === 'dn' ? RED : GREEN;
  return (
    <div style={{ background: bg, padding: '10px 12px', borderRadius: 4, ...sans, fontSize: 12, color: fg }}>
      <strong>{name}</strong><br />{detail}
    </div>
  );
}

/* ── SupplyGapBar ── */
function SupplyGapBar({ label, total, segments }: {
  label: string; total: string;
  segments: { pct: number; color: string; text: string; textColor?: string }[];
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ ...sans, fontSize: 12, color: '#444', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span><span>{total}</span>
      </div>
      <div style={{ height: 28, background: SUBTLE, borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              height: '100%',
              width: `${seg.pct}%`,
              background: seg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...sans,
              fontSize: 10,
              fontWeight: 600,
              color: seg.textColor || '#fff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              padding: '0 4px',
            }}
          >
            {seg.pct > 15 ? seg.text : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   Main content component
   ================================================================ */
export default function USoilParadox() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'bonds' | 'crypto'>('stocks');
  const [duration, setDuration] = useState(8);
  const [peakPrice, setPeakPrice] = useState(110);
  const [chartReady, setChartReady] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  /* ── Dynamic Chart.js import ── */
  useEffect(() => {
    import('chart.js/auto').then(() => {
      setChartReady(true);
    });
  }, []);

  /* ── Render all charts once Chart.js is loaded ── */
  useEffect(() => {
    if (!chartReady) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Chart = require('chart.js/auto').default || require('chart.js/auto');

    const charts: InstanceType<typeof Chart>[] = [];

    function make(id: string, cfg: object) {
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      if (!el) return;
      const existing = Chart.getChart(el);
      if (existing) existing.destroy();
      const c = new Chart(el, cfg);
      charts.push(c);
      return c;
    }

    /* ── 1. Historical arc ── */
    make('histChart', {
      type: 'line',
      data: {
        labels: histLabels,
        datasets: [
          { label: 'Imports', data: histImports, borderColor: BLUE2, backgroundColor: 'rgba(45,90,139,0.08)', tension: 0.35, pointRadius: 3, borderWidth: 2, fill: true },
          { label: 'Exports', data: histExports, borderColor: GREEN, backgroundColor: 'rgba(26,92,46,0.08)', tension: 0.35, pointRadius: 3, borderWidth: 2, fill: true },
          { label: 'Production', data: histProduction, borderColor: ORANGE, tension: 0.35, pointRadius: 3, borderWidth: 2, borderDash: [5, 3], fill: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + 'M' }, title: { display: true, text: 'Million b/d', color: tc } },
        },
      },
    });

    /* ── 2. Supplier switch ── */
    make('supplierSwitch', {
      type: 'line',
      data: {
        labels: supplierLabels,
        datasets: [
          { label: 'OPEC', data: supplierOPEC, borderColor: ORANGE, backgroundColor: 'rgba(201,74,0,0.1)', tension: 0.3, fill: true, pointRadius: 4, borderWidth: 2 },
          { label: 'Canada', data: supplierCanada, borderColor: BLUE, backgroundColor: 'rgba(26,58,92,0.1)', tension: 0.3, fill: true, pointRadius: 4, borderWidth: 2 },
          { label: 'Others', data: supplierOthers, borderColor: '#888', backgroundColor: 'rgba(136,136,136,0.08)', tension: 0.3, fill: true, pointRadius: 3, borderWidth: 1.5 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + 'M' }, title: { display: true, text: 'M b/d', color: tc }, min: 0, max: 6 },
        },
      },
    });

    /* ── 3. Import pie ── */
    make('importPie', {
      type: 'doughnut',
      data: {
        labels: importPieLabels,
        datasets: [{ data: importPieData, backgroundColor: importPieColors, borderWidth: 2, borderColor: '#fff' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'right', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } } },
      },
    });

    /* ── 4. Export pie ── */
    make('exportPie', {
      type: 'doughnut',
      data: {
        labels: exportPieLabels,
        datasets: [{ data: exportPieData, backgroundColor: exportPieColors, borderWidth: 2, borderColor: '#fff' }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'right', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } } },
      },
    });

    /* ── 5. Export destinations ── */
    make('exportDest', {
      type: 'bar',
      data: {
        labels: exportDestLabels,
        datasets: [
          { label: '2024 (000 b/d)', data: exportDest2024, backgroundColor: 'rgba(45,90,139,0.8)', borderRadius: 3 },
          { label: '2025 (000 b/d)', data: exportDest2025, backgroundColor: 'rgba(201,74,0,0.8)', borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + 'k' } },
        },
      },
    });

    /* ── 6. Net trade ── */
    make('netTradeChart', {
      type: 'bar',
      data: {
        labels: netTradeLabels,
        datasets: [
          { label: 'Exports (M b/d)', data: netTradeExports, backgroundColor: 'rgba(26,92,46,0.8)', borderRadius: 3 },
          { label: 'Imports (M b/d)', data: netTradeImports, backgroundColor: 'rgba(139,26,26,0.8)', borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } },
          tooltip: {
            mode: 'index', intersect: false,
            callbacks: {
              afterBody: (items: { parsed: { y: number } }[]) => {
                const e = (items[0]?.parsed?.y ?? 0);
                const imp = (items[1]?.parsed?.y ?? 0);
                const net = (e - imp).toFixed(1);
                return `Net: ${Number(net) > 0 ? '+' : ''}${net}M b/d (${Number(net) > 0 ? 'exporter' : 'importer'})`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + 'M' } },
        },
      },
    });

    /* ── 7. VLCC cost ── */
    make('vlccCost', {
      type: 'bar',
      data: {
        labels: vlccLabels,
        datasets: [{ label: 'Transport cost ($/barrel)', data: vlccCosts, backgroundColor: vlccColors, borderRadius: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { parsed: { x: number } }) => '$' + ((c.parsed.x ?? 0)).toFixed(1) + '/barrel transport cost' } },
        },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => '$' + (v ?? 0) }, title: { display: true, text: '$/barrel', color: tc } },
          y: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
        },
      },
    });

    /* ── 8. Gulf dependence ── */
    make('gulfDepChart', {
      type: 'bar',
      data: {
        labels: gulfDepLabels,
        datasets: [{ label: '% crude from Persian Gulf', data: gulfDepData, backgroundColor: gulfDepColors, borderRadius: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { parsed: { x: number } }) => (c.parsed.x ?? 0) + '% of crude imports from Gulf' } },
        },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + '%' }, max: 100 },
          y: { grid: { display: false }, ticks: { color: tc } },
        },
      },
    });

    /* ── 9. Transmission chain ── */
    make('transmissionChart', {
      type: 'bar',
      data: {
        labels: transmissionLabels,
        datasets: [{ label: 'Effect', data: transmissionData, backgroundColor: transmissionColors, borderRadius: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { dataIndex: number }) => transmissionTooltips[c.dataIndex] || '' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { display: false },
        },
      },
    });

    /* ── 10. Sector chart ── */
    make('sectorChart', {
      type: 'bar',
      data: {
        labels: sectorLabels,
        datasets: [{
          label: 'Estimated earnings/performance impact (%)',
          data: sectorData,
          backgroundColor: sectorData.map(v => v > 0 ? 'rgba(26,92,46,0.8)' : 'rgba(139,26,26,0.8)'),
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { parsed: { y: number } }) => ((c.parsed.y ?? 0) > 0 ? '+' : '') + (c.parsed.y ?? 0) + '% estimated impact' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => ((v ?? 0) > 0 ? '+' : '') + (v ?? 0) + '%' } },
        },
      },
    });

    /* ── 11. Bond chart ── */
    make('bondChart', {
      type: 'bar',
      data: {
        labels: bondLabels,
        datasets: [
          { label: 'Pre crisis', data: bondPreCrisis, backgroundColor: 'rgba(26,58,92,0.7)', borderRadius: 3 },
          { label: 'Current/Expected', data: bondCurrent, backgroundColor: 'rgba(201,74,0,0.8)', borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc } },
        },
      },
    });

    /* ── 12. Crypto BTC chart ── */
    make('cryptoChart', {
      type: 'line',
      data: {
        labels: btcStrikes.map(s => '$' + s + 'k'),
        datasets: [{
          label: 'BTC above price (Polymarket %)',
          data: btcProbs,
          borderColor: '#f7931a',
          backgroundColor: 'rgba(247,147,26,0.12)',
          tension: 0.3, pointRadius: 5, borderWidth: 2.5, fill: true, pointBackgroundColor: '#f7931a',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { parsed: { y: number }; dataIndex: number }) => (c.parsed.y ?? 0) + '% probability BTC is above $' + btcStrikes[c.dataIndex] + 'k' } },
        },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + '%' }, min: 0, max: 100, title: { display: true, text: 'Implied probability', color: tc } },
        },
      },
    });

    /* ── 13. Poly WTI distribution ── */
    make('polyWtiChart', {
      type: 'bar',
      data: {
        labels: wtiDistLabels,
        datasets: [{
          label: 'Implied probability (%)',
          data: wtiDistData,
          backgroundColor: wtiDistColors,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: { parsed: { y: number } }) => (c.parsed.y ?? 0) + '% probability' } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => (v ?? 0) + '%' }, max: 105 },
        },
      },
    });

    /* ── 14. Oil price journey ── */
    make('oilPriceChart', {
      type: 'line',
      data: {
        labels: oilPriceLabels,
        datasets: [
          { label: 'WTI ($/b)', data: oilPrices, borderColor: ORANGE, backgroundColor: 'rgba(201,74,0,0.1)', tension: 0.35, pointRadius: 4, borderWidth: 2.5, fill: true },
          { label: '$100 level', data: new Array(oilPriceLabels.length).fill(100), borderColor: 'rgba(139,26,26,0.4)', borderWidth: 1.5, borderDash: [6, 3], pointRadius: 0, fill: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false, callbacks: { label: (c: { dataset: { label: string }; parsed: { y: number } }) => c.dataset.label + ': $' + (c.parsed.y ?? 0) + '/b' } },
        },
        scales: {
          x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc, callback: (v: number) => '$' + (v ?? 0) }, min: 50, max: 135 },
        },
      },
    });

    /* ── 15. Scenario matrix ── */
    make('scenMatrix', {
      type: 'bar',
      data: {
        labels: scenMatrixLabels,
        datasets: [
          { label: 'Fast reopening (35%)', data: scenFast, backgroundColor: 'rgba(26,92,46,0.8)', borderRadius: 3 },
          { label: 'Moderate 1–3mo (45%)', data: scenModerate, backgroundColor: 'rgba(107,66,0,0.8)', borderRadius: 3 },
          { label: 'Prolonged 3mo+ (20%)', data: scenProlonged, backgroundColor: 'rgba(139,26,26,0.8)', borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
          y: { grid: { color: gc }, ticks: { color: tc } },
        },
      },
    });

    return () => {
      charts.forEach(c => c.destroy());
    };
  }, [chartReady, activeTab]);

  /* ── Scenario builder radar chart ── */
  useEffect(() => {
    if (!chartReady) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Chart = require('chart.js/auto').default || require('chart.js/auto');

    const el = document.getElementById('scenRadar') as HTMLCanvasElement | null;
    if (!el) return;
    const existing = Chart.getChart(el);
    if (existing) existing.destroy();

    const dur = duration;
    const price = peakPrice;
    const spImpact = Math.round(-2 - (dur * 0.6) - (price > 130 ? (price - 130) * 0.15 : 0));
    const bondYield = (4.2 + dur * 0.04 + Math.max(0, (price - 90) * 0.01)).toFixed(1);
    const btcLow = Math.round(66 - dur * 1.5 - Math.max(0, (price - 100) * 0.3));
    const recProb = Math.round(32 + dur * 2.5 + Math.max(0, (price - 110) * 0.3));

    const radarData = [
      Math.max(0, Math.min(100, 50 + spImpact * 2)),
      Math.round((price - 60) / 1.4),
      Math.max(0, 100 - Math.min(100, btcLow)),
      Math.round((parseFloat(bondYield) - 3.5) * 25),
      Math.min(100, recProb),
      Math.round(30 + dur * 3 + Math.max(0, (price - 90) * 0.5)),
    ];

    new Chart(el, {
      type: 'radar',
      data: {
        labels: radarLabels,
        datasets: [{ label: 'Current scenario', data: radarData, backgroundColor: 'rgba(45,90,139,0.2)', borderColor: BLUE2, borderWidth: 2, pointRadius: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.1)' }, pointLabels: { font: { size: 10 }, color: tc }, min: 0, max: 100 } },
      },
    });
  }, [chartReady, duration, peakPrice]);

  /* ── Scenario builder computed values ── */
  const scenarioOutputs = useCallback(() => {
    const dur = duration;
    const price = peakPrice;
    const spImpact = Math.round(-2 - (dur * 0.6) - (price > 130 ? (price - 130) * 0.15 : 0));
    const bondYield = (4.2 + dur * 0.04 + Math.max(0, (price - 90) * 0.01)).toFixed(1);
    const btcLow = Math.max(20, Math.round(66 - dur * 1.5 - Math.max(0, (price - 100) * 0.3)));
    const btcHigh = Math.round(72 - dur * 0.8);
    const recProb = Math.min(85, Math.round(32 + dur * 2.5 + Math.max(0, (price - 110) * 0.3)));
    const durText = dur === 1 ? '1 week' : dur < 4 ? dur + ' weeks' : dur < 8 ? Math.round(dur / 4) + ' month' + (dur > 4 ? 's' : '') : Math.round(dur / 4) + ' months';
    return { spImpact, bondYield, btcLow, btcHigh, recProb, durText };
  }, [duration, peakPrice]);

  const scen = scenarioOutputs();

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <BlogLayout meta={meta}>
      {/* ── Hero / Overview ── */}
      <Prose>
        <StatGrid cells={heroStats} />

        <p>
          On February 28, 2026, the United States and Israel launched coordinated strikes against Iranian military infrastructure. Within 72 hours, Iran closed the Strait of Hormuz. Brent crude surged past $100 per barrel within six days and peaked at $126 per barrel. The IEA called it the largest supply disruption in the history of the global oil market. The world asked immediately: can America fill the gap?
        </p>
        <p>
          The answer requires engaging with data rather than rhetoric. The United States produced a record 13.6 million barrels per day in 2025, leading Russia (9.87M) and Saudi Arabia (9.51M) by a country mile. It exported 11 million barrels per day of total petroleum and imported 8.4 million, yielding a net export position of 2.6 million barrels per day and a $59 billion trade surplus. And yet — its maximum crude oil export capacity is approximately 4 to 5 million barrels per day, constrained by pipeline saturation, absent deepwater terminals, quality mismatches with Asian refineries, and competing domestic demand. Asia's Hormuz displaced need is 10 to 16 million barrels per day. The gap between what America can deliver and what Asia needs tells the real story of energy dominance in 2026.
        </p>
      </Prose>

      {/* ══════════════════════════════════════════════════════════
         SECTION I — Historical Arc
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="I" title="A Transformation Written in Barrels Per Day" sourceTag="EIA" />
      <Prose>
        <p>
          Few structural economic shifts in modern history are as dramatic and data rich as what happened to American petroleum between 2008 and 2025. Crude oil imports that peaked at roughly 14 million barrels per day in 2005 have fallen by nearly 40 percent. Exports that were essentially zero under a 1973 export ban have risen to over 4 million barrels per day of crude and 7 million barrels per day of refined products.
        </p>
      </Prose>

      <ChartBlock
        title="US Petroleum Production, Exports and Imports — 2000 to 2025"
        sub="Million barrels per day. Click any annotation below to highlight that period."
        note="Source: EIA Petroleum Supply Annual and Monthly. Net exporter crossover occurred in 2020 when exports rose above imports."
      >
        <div style={{ position: 'relative', height: 320 }}><canvas id="histChart" /></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {histAnnotations.map((ann, i) => (
            <button
              key={i}
              onClick={() => setActiveAnnotation(activeAnnotation === i ? null : i)}
              style={{
                ...sans, fontSize: 11, padding: '4px 10px', borderRadius: 3,
                background: activeAnnotation === i ? BLUE : SUBTLE,
                color: activeAnnotation === i ? '#fff' : INK,
                border: `1px solid ${activeAnnotation === i ? BLUE : BORDER}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {ann.label}
            </button>
          ))}
        </div>
        <ChartLegend items={[
          { color: BLUE2, label: 'Total petroleum imports' },
          { color: GREEN, label: 'Total petroleum exports' },
          { color: ORANGE, label: 'Crude oil production' },
        ]} />
      </ChartBlock>

      <Prose>
        <p>
          The shale revolution, deployed at commercial scale from 2007 and accelerating sharply after 2012, drove production up 165 percent from 5.0 million barrels per day in 2008 to 13.6 million barrels per day in 2025. In 2018 the United States overtook Russia and Saudi Arabia to become the world's largest crude oil producer. In 2015 Congress lifted the 1973 crude export ban. In 2020, for the first time since at least 1949, the United States became a net exporter of total petroleum on an annual basis.
        </p>
        <blockquote style={{ borderLeft: `3px solid ${BLUE2}`, padding: '6px 0 6px 24px', margin: '32px 0', fontSize: 20, fontStyle: 'italic', color: BLUE, lineHeight: 1.45 }}>
          The United States exported 55 percent of its domestic crude oil and natural gas plant liquids production in 2024. — US EIA, Annual Energy Outlook 2025
        </blockquote>
        <p>
          The OPEC story is one of collapse as a US supply source. In 1977, OPEC supplied 70 percent of US petroleum imports. By 2024, that share had collapsed to approximately 15 percent. Saudi Arabia's exports to the US fell from 1.5 million barrels per day pre fracking to just 340,000 barrels per day in 2024, the lowest since 1986 — a reduction of 77 percent.
        </p>
      </Prose>

      <ChartBlock
        title="OPEC vs Canada: The Great Supplier Switch (US crude imports by source, 2006–2024)"
        sub="Million barrels per day. Canada surpassed OPEC as the largest single source of US crude oil imports in 2014 and has led every year since."
        note="Source: EIA Petroleum Supply Annual. Russia imports dropped to zero in mid 2022 and stayed there."
      >
        <div style={{ position: 'relative', height: 260 }}><canvas id="supplierSwitch" /></div>
        <ChartLegend items={[
          { color: ORANGE, label: 'OPEC nations' },
          { color: BLUE, label: 'Canada' },
          { color: '#888', label: 'All others' },
        ]} />
      </ChartBlock>

      {/* ══════════════════════════════════════════════════════════
         SECTION II — Trade Data
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="II" title="The Complete Trade Picture: Who Buys and Who Sells" sourceTag="EIA" />
      <Prose>
        <p>
          In 2023, the most recently complete year by bilateral trade data, the US imported 8.51 million barrels per day of petroleum from 86 countries and exported 10.15 million barrels per day to 173 countries. The distribution on both sides is highly concentrated — and the composition of exports reveals something counterintuitive: refined products and hydrocarbon gas liquids, not crude oil, dominate what America sends abroad.
        </p>
      </Prose>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '24px 0' }}>
        <ChartBlock title="Import Sources — Where US crude oil comes from" sub="2024, % of total crude imports">
          <div style={{ position: 'relative', height: 240 }}><canvas id="importPie" /></div>
        </ChartBlock>
        <ChartBlock title="Export Product Mix — What America exports" sub="2025, total petroleum exports by type">
          <div style={{ position: 'relative', height: 240 }}><canvas id="exportPie" /></div>
        </ChartBlock>
      </div>
      <p style={{ ...sans, fontSize: 11, color: INK3, fontStyle: 'italic', marginTop: 4 }}>
        Source: EIA Petroleum Supply Annual. Products = refined fuels; HGL = hydrocarbon gas liquids including propane and ethane.
      </p>

      <Prose>
        <p>
          Canada dominates the import picture at 61.7 percent of all US crude oil imports in 2024, delivering 4.1 million barrels per day. This is not a relationship of convenience — it is structural. Canadian crude from Alberta is heavy sour oil, precisely what over 70 percent of US refineries are configured to process. The Trans Mountain Expansion pipeline, which entered service and contributed to a 5 percent increase in Canadian crude exports to the US in 2024, deepened this integration further.
        </p>
      </Prose>

      <ChartBlock
        title="US Crude Oil Exports by Destination — 2024 vs 2025"
        sub="Key country level shifts driven by Ukraine war, China pullback, and OPEC+ competition."
        note="Source: EIA Petroleum Supply Monthly, March 2026 release. Annual US crude oil exports: 4.1M b/d in 2024, 4.0M b/d in 2025 (first decline since 2021)."
      >
        <div style={{ position: 'relative', height: 300 }}><canvas id="exportDest" /></div>
        <ChartLegend items={[
          { color: BLUE2, label: '2024 volume' },
          { color: ORANGE, label: '2025 volume' },
        ]} />
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {countryShiftsDown.map((s, i) => <CountryShiftCard key={i} name={s.name} detail={s.detail} variant="dn" />)}
        </div>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {countryShiftsUp.map((s, i) => <CountryShiftCard key={i} name={s.name} detail={s.detail} variant="up" />)}
        </div>
      </ChartBlock>

      {/* ══════════════════════════════════════════════════════════
         SECTION III — The Paradox
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="III" title="Why America Both Exports and Imports: The Structural Paradox" sourceTag="EIA / CRS" />
      <Prose>
        <p>
          The question most commonly asked about US petroleum trade is: if the United States produces 13.6 million barrels per day, why does it still import 6.2 million barrels per day of crude oil? The answer has three interlocking structural causes.
        </p>
      </Prose>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '24px 0' }}>
        <CalloutBox variant="red">
          <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>The Refinery Configuration Problem</h4>
          <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Over <strong>70 percent</strong> of US refinery capacity is optimized for heavy sour crude oil from Canada and Mexico, not for the light sweet shale crude that the Permian Basin produces. Retooling is expensive and slow — ExxonMobil spent <strong>$2 billion and 4 years</strong> to process Permian shale at its Beaumont refinery. Most refiners have not made equivalent investments.
          </p>
        </CalloutBox>
        <CalloutBox variant="amber">
          <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>The Pipeline Geography Problem</h4>
          <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            There is no coast to coast crude pipeline in the United States. The infrastructure was built to move oil inward from ports to refineries. Gulf Coast refiners find it more economic to <strong>export gasoline to Mexico</strong> than ship it by pipeline to the US Northeast, which then imports European gasoline. Absurd from a map perspective. Rational from a cost perspective.
          </p>
        </CalloutBox>
      </div>

      <CalloutBox variant="blue">
        <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>The Refining Arbitrage Business Model</h4>
        <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
          Gulf Coast refiners import cheap heavy crude, refine it into value added petroleum products, and sell those products globally. This is a profitable industrial model, not a policy failure. It explains why petroleum products (diesel, gasoline, jet fuel, LPG) account for <strong>62 percent of total US petroleum exports by volume</strong>, while crude oil accounts for only 38 percent. America is, in substantial part, running a global petroleum refining service.
        </p>
      </CalloutBox>

      <ChartBlock
        title="The Net Trade Reality — Gross flows tell a different story than net positions"
        sub="The US is net positive in total petroleum and products, but still net negative in crude oil alone."
        note="Source: EIA 2024 data. Crude oil: US still net importer by 2.2M b/d. Total petroleum: net exporter by 2.6M b/d. The surplus is driven entirely by refined products and HGLs."
      >
        <div style={{ position: 'relative', height: 260 }}><canvas id="netTradeChart" /></div>
        <ChartLegend items={[
          { color: GREEN, label: 'Exports (M b/d)' },
          { color: RED, label: 'Imports (M b/d)' },
        ]} />
      </ChartBlock>

      {/* ══════════════════════════════════════════════════════════
         SECTION IV — Infrastructure Ceiling
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="IV" title="The Infrastructure Ceiling: Why 4–5 Million Barrels Per Day Is the Hard Limit" sourceTag="MMCG / MARAD" />
      <Prose>
        <p>
          The binding constraint on American crude oil exports is not production. It is the physical ability to load Very Large Crude Carriers — the 2 million barrel VLCC tankers that make transoceanic routes to Asia economically viable. Almost no US Gulf Coast port can fully load a VLCC.
        </p>
      </Prose>

      <ChartBlock
        title="US Export Infrastructure Utilization — Q1 2026"
        sub="Pipelines, terminals, and planned capacity. Red = at ceiling. Amber = near capacity. Grey = not yet built."
        note="Source: MMCG Investment Research Q1 2026; MARAD licensing records; Enterprise Products Partners SEC filings; EIA export data."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {infraCards.map((card, i) => <InfraCard key={i} item={card} />)}
        </div>
      </ChartBlock>

      <Prose>
        <p>
          The VLCC cost penalty is not trivial. Using four Aframax tankers or two Suezmax tankers instead of one VLCC adds approximately $1 to $2 per barrel in transport cost on routes to Asia. For a cargo of 2 million barrels, that is $2 to $4 million in extra cost per shipment — enough to make US crude uncompetitive against Middle Eastern alternatives in most normal market conditions. At $94 to $126 per barrel with Gulf supply disrupted, the economics shift. But the infrastructure physics do not change: you still need the lightering zone, the weather cooperates only 88 to 92 percent of the time, and each transfer adds scheduling complexity and port congestion.
        </p>
      </Prose>

      <ChartBlock
        title="The VLCC Cost Premium — Why US crude is expensive to ship to Asia"
        sub="Cost per barrel by vessel type and route, US Gulf Coast to Northeast Asia (Japan/South Korea)"
        note="Source: RBN Energy; Baltic Exchange freight assessments; EIA Gulf Coast port data. Reverse lightering is the current method used at most US Gulf terminals."
      >
        <div style={{ position: 'relative', height: 220 }}><canvas id="vlccCost" /></div>
      </ChartBlock>

      {/* ══════════════════════════════════════════════════════════
         SECTION V — Asia Gap
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="V" title="Can America Fill the Gulf's Shoes for Asia? The Arithmetic" sourceTag="IEA / Dallas Fed" />
      <Prose>
        <p>
          The Hormuz closure displaces approximately 20 million barrels per day of oil transit, of which roughly 80 percent was destined for Asian markets. That is a potential supply gap of 10 to 16 million barrels per day for Asia. Against this, the United States currently delivers approximately 1.6 million barrels per day to Asia in normal market conditions, and at maximum capacity stretch — redirecting all available barrels from other destinations — could deliver perhaps 2.0 to 2.5 million barrels per day.
        </p>
      </Prose>

      <ChartBlock
        title="The Supply Gap — Asia's displaced Hormuz demand vs US capacity to fill it"
        sub="Million barrels per day."
        note="Source: IEA Oil Market Report Feb 2026; EIA export data; Dallas Fed Hormuz analysis. The US fills ~13% of Asia's supply gap at maximum capacity stretch."
      >
        <div style={{ margin: '24px 0' }}>
          {supplyGapRows.map((row, i) => (
            <SupplyGapBar key={i} label={row.label} total={row.total} segments={row.segments} />
          ))}
        </div>
      </ChartBlock>

      <ChartBlock
        title="Gulf Dependence by Country — Who is most exposed to the Hormuz crisis"
        sub="Percentage of total crude imports sourced from Persian Gulf countries, 2025"
      >
        <div style={{ position: 'relative', height: 260 }}><canvas id="gulfDepChart" /></div>
      </ChartBlock>

      <CalloutBox variant="green">
        <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Why the US is Paradoxically Positioned</h4>
        <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
          The United States imports only ~8% of its crude oil from Persian Gulf countries (~490,000 b/d in 2025), versus 70–85% for Japan and South Korea. This means the Hormuz crisis hits the US indirectly — through global price increases — while Asian economies face actual physical supply shortfalls. This is what President Trump means when he suggests the crisis does not really affect the US the way it does other countries. He is partially correct on supply exposure, while omitting the price channel, which affects all consumers globally regardless of import source.
        </p>
      </CalloutBox>

      {/* ══════════════════════════════════════════════════════════
         SECTION VI — Financial Markets
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="VI" title="Financial Market Transmission: Stocks, Bonds, and Crypto" sourceTag="Dallas Fed" />
      <Prose>
        <p>
          Every sustained oil price shock reaches financial markets through three channels: inflation (energy costs cascade through every production input), growth (higher energy costs reduce real income and spending), and financial conditions (the Federal Reserve's response to the combination of higher inflation and slowing growth). The current episode triggers all three simultaneously, creating the classic stagflation configuration — higher inflation, lower growth, policy paralysis at the Fed.
        </p>
      </Prose>

      <ChartBlock
        title="The Transmission Chain — From Hormuz to your portfolio"
        sub="Every $10/barrel sustained oil price increase adds ~0.35% to US CPI and removes ~0.2% from GDP growth"
        note="Estimated using Dallas Fed macroeconomic model and historical oil inflation pass through coefficients. Current WTI at ~$94, up from ~$62 pre crisis (+$32/b)."
      >
        <div style={{ position: 'relative', height: 200 }}><canvas id="transmissionChart" /></div>
      </ChartBlock>

      {/* ── Tabbed market content ── */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden', margin: '28px 0' }}>
        <div style={{ display: 'flex', background: SUBTLE, borderBottom: `1px solid ${BORDER}` }}>
          {(['stocks', 'bonds', 'crypto'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...sans, fontSize: 12, fontWeight: 600,
                padding: '12px 20px', border: 'none',
                background: activeTab === tab ? CARD : 'transparent',
                color: activeTab === tab ? INK : INK3,
                cursor: 'pointer',
                borderRight: `1px solid ${BORDER}`,
                transition: 'all 0.2s',
              }}
            >
              {tab === 'stocks' ? 'Equities' : tab === 'bonds' ? 'Fixed Income' : 'Crypto'}
            </button>
          ))}
        </div>

        {/* Stocks tab */}
        <div style={{ display: activeTab === 'stocks' ? 'block' : 'none', padding: 24 }}>
          <div style={{ position: 'relative', height: 260, marginBottom: 20 }}><canvas id="sectorChart" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {equityCards.map((card, i) => <AssetCard key={i} card={card} />)}
          </div>
        </div>

        {/* Bonds tab */}
        <div style={{ display: activeTab === 'bonds' ? 'block' : 'none', padding: 24 }}>
          <div style={{ position: 'relative', height: 260, marginBottom: 20 }}><canvas id="bondChart" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {bondCards.map((card, i) => <AssetCard key={i} card={card} />)}
          </div>
        </div>

        {/* Crypto tab */}
        <div style={{ display: activeTab === 'crypto' ? 'block' : 'none', padding: 24 }}>
          <div style={{ position: 'relative', height: 260, marginBottom: 20 }}><canvas id="cryptoChart" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {cryptoCards.map((card, i) => <AssetCard key={i} card={card} />)}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
         SECTION VII — Polymarket Live
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="VII" title="What Polymarket Is Pricing Right Now" sourceTag="Polymarket" live />
      <Prose>
        <p>
          Polymarket is a decentralized prediction market platform where participants stake real money on outcomes. The price of a Yes share equals the implied probability that the market assigns to that outcome. With millions of dollars in liquidity across macro and energy markets, these prices aggregate information from participants who have genuine financial skin in the game.
        </p>
      </Prose>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, margin: '24px 0' }}>
        {polyCards.map((card, i) => (
          <PolyCard key={i} label={card.label} value={card.value} valueColor={card.valueColor} desc={card.desc} source={card.source} />
        ))}
      </div>

      <ChartBlock
        title="Polymarket WTI Price Distribution for April 2026 — Live implied probabilities"
        sub="Probability that WTI crude oil will touch each price level (high or low) at any point in April 2026. Data from $2.78M volume market as of April 2, 2026."
        note="Source: Polymarket event ID 305510. $2.78M in total volume as of April 2, 2026. Prices represent market implied probabilities, not point forecasts."
      >
        <div style={{ position: 'relative', height: 280 }}><canvas id="polyWtiChart" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
          <div style={{ background: '#f5e6e6', padding: 12, borderRadius: 6, ...sans, fontSize: 13 }}>
            <strong style={{ color: RED }}>UPSIDE SCENARIO (Hormuz stays closed)</strong><br />
            <span style={{ color: INK3 }}>51.5% chance WTI touches $120 · 17.5% chance of $140 · 5.25% chance of $160+</span>
          </div>
          <div style={{ background: '#e6f5eb', padding: 12, borderRadius: 6, ...sans, fontSize: 13 }}>
            <strong style={{ color: GREEN }}>DOWNSIDE SCENARIO (Hormuz reopens)</strong><br />
            <span style={{ color: INK3 }}>19.5% chance WTI drops to $80 · 5.5% chance of $70 · 1.6% chance of $60</span>
          </div>
        </div>
      </ChartBlock>

      <ChartBlock
        title="WTI Crude Oil — Annotated 2025 to 2026 Price Journey with Key Events"
        sub="Monthly average prices. The Hormuz crisis marks the most dramatic price spike since the 2022 Ukraine invasion."
        note="Source: EIA Petroleum Supply Monthly; current price from market data. STEO March 2026 projected Brent at ~$94/b for Q2 2026 before Hormuz closure accelerated the move."
      >
        <div style={{ position: 'relative', height: 280 }}><canvas id="oilPriceChart" /></div>
      </ChartBlock>

      {/* ══════════════════════════════════════════════════════════
         SECTION VIII — Scenario Builder
         ══════════════════════════════════════════════════════════ */}
      <SectionHeader number="VIII" title="Interactive Scenario Builder — What Happens to Markets" sourceTag="Model" />
      <Prose>
        <p>
          All asset price outcomes in this environment flow through a single primary variable: how long the Strait of Hormuz stays disrupted. Use the controls below to explore how different disruption durations translate into market outcomes across equities, bonds, and crypto.
        </p>
      </Prose>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 24, margin: '28px 0' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...sans, fontSize: 14, fontWeight: 700, color: INK, marginBottom: 4 }}>Scenario Explorer</div>
          <div style={{ ...sans, fontSize: 12, color: INK3 }}>Adjust the sliders to model different disruption scenarios. Outputs update in real time.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 8 }}>
              Hormuz disruption duration: <span style={{ ...sans, fontSize: 18, fontWeight: 700, color: BLUE }}>{scen.durText}</span>
            </label>
            <input
              type="range" min={1} max={26} value={duration} step={1}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ ...sans, fontSize: 11, color: INK3, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span>1 wk</span><span>3 months</span><span>6 months</span>
            </div>
          </div>
          <div>
            <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: INK, display: 'block', marginBottom: 8 }}>
              WTI peak price during disruption: <span style={{ ...sans, fontSize: 18, fontWeight: 700, color: BLUE }}>${peakPrice}/barrel</span>
            </label>
            <input
              type="range" min={70} max={200} value={peakPrice} step={5}
              onChange={(e) => setPeakPrice(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ ...sans, fontSize: 11, color: INK3, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span>$70</span><span>$130</span><span>$200</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div style={{ background: SUBTLE, borderRadius: 6, padding: 12, textAlign: 'center' }}>
            <div style={{ ...sans, fontSize: 10, color: INK3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>S&P 500 impact</div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: scen.spImpact < -15 ? RED : scen.spImpact < -5 ? AMBER : GREEN }}>{scen.spImpact}%</div>
          </div>
          <div style={{ background: SUBTLE, borderRadius: 6, padding: 12, textAlign: 'center' }}>
            <div style={{ ...sans, fontSize: 10, color: INK3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>10Y yield target</div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: INK }}>{scen.bondYield}%</div>
          </div>
          <div style={{ background: SUBTLE, borderRadius: 6, padding: 12, textAlign: 'center' }}>
            <div style={{ ...sans, fontSize: 10, color: INK3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Bitcoin range</div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: INK }}>${scen.btcLow}–{scen.btcHigh}k</div>
          </div>
          <div style={{ background: SUBTLE, borderRadius: 6, padding: 12, textAlign: 'center' }}>
            <div style={{ ...sans, fontSize: 10, color: INK3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Recession probability</div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: scen.recProb > 60 ? RED : scen.recProb > 40 ? AMBER : GREEN }}>{scen.recProb}%</div>
          </div>
        </div>

        <div style={{ position: 'relative', height: 220, marginTop: 20 }}><canvas id="scenRadar" /></div>
      </div>

      <ChartBlock
        title="Scenario Probability Matrix — Three paths and their market implications"
        sub="Based on historical oil shock episodes and current Polymarket pricing"
      >
        <div style={{ position: 'relative', height: 240 }}><canvas id="scenMatrix" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {scenarioCards.map((card, i) => {
            const bg: Record<string, string> = { green: '#e6f5eb', amber: '#f5eed6', red: '#f5e6e6' };
            const fg: Record<string, string> = { green: GREEN, amber: AMBER, red: RED };
            return (
              <div key={i} style={{ background: bg[card.variant], padding: 12, borderRadius: 6, ...sans, fontSize: 12 }}>
                <strong style={{ color: fg[card.variant] }}>{card.title}</strong><br />
                {card.body}
              </div>
            );
          })}
        </div>
      </ChartBlock>

      {/* ── Data sources footer ── */}
      <div style={{ marginTop: 48, padding: '24px 0', borderTop: `1px solid ${BORDER}` }}>
        <h4 style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK3, marginBottom: 12 }}>Data Sources</h4>
        <p style={{ ...sans, fontSize: 12, color: INK3, lineHeight: 1.7 }}>
          US Energy Information Administration: Petroleum Supply Monthly (PSM), Petroleum Supply Annual (PSA), Short Term Energy Outlook (STEO March 2026), Annual Energy Outlook 2025. Congressional Research Service: US Petroleum Trade Tariffs Analysis IN12488; Hormuz Impacts R45281.6. Federal Reserve Bank of Dallas: Hormuz economic impact model, March 2026. Wood Mackenzie: North American crude tariff analysis, February 2025. MMCG Investment Research: US Oil Infrastructure Q1 2026. Polymarket: Recession market ID 48802 ($1.02M volume); Bitcoin multi strike ID 310581 ($3.67M weekly); WTI April 2026 ID 305510 ($2.78M total). Columbia CGEP: Why Restricting US Oil Exports Would Backfire, April 2026.
        </p>
        <p style={{ ...sans, fontSize: 11, color: '#aaa', marginTop: 12 }}>
          For informational purposes only. Not investment advice. All Polymarket probabilities reflect live market prices as of April 2, 2026.
        </p>
      </div>
    </BlogLayout>
  );
}
