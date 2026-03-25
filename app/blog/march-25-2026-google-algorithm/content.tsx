'use client';

import { useEffect } from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import {
  kvMemoryData,
  longBenchData,
  speedupData,
  costData,
  heroStats,
  marketFactors,
  glossary,
} from './data';

/* Colours matching the editorial palette */
const TEAL = '#1a6b6b';
const GOLD = '#9a6f2e';
const RED = '#c0392b';
const SOFT = '#7a7268';
const GHOST = '#d4cec5';

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-secondary, #888)',
};

const cardBg: React.CSSProperties = {
  background: 'var(--surface-secondary, rgba(0,0,0,0.03))',
  borderRadius: 8,
  padding: '18px 20px',
};

/* Chart wrapper */
function ChartBlock({
  id,
  height = 260,
  label,
  headline,
  sub,
  note,
}: {
  id: string;
  height?: number;
  label: string;
  headline: string;
  sub?: string;
  note?: string;
}) {
  return (
    <div style={{ ...cardBg, margin: '28px 0' }}>
      <div style={{ ...mono, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-primary, #222)', marginBottom: 4 }}>{headline}</div>
      {sub && <div style={{ fontSize: 13, fontStyle: 'italic', color: SOFT, marginBottom: 14 }}>{sub}</div>}
      <div style={{ position: 'relative', width: '100%', height }}>
        <canvas id={id} style={{ maxWidth: '100%' }} />
      </div>
      {note && <div style={{ fontSize: 11, color: GHOST, marginTop: 10, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

/* Pull quote */
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderTop: '3px solid var(--ink-primary, #222)',
        borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
        padding: '18px 0',
        margin: '32px 0',
      }}
    >
      <p style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.4, color: 'var(--ink-primary, #222)', margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

/* Market factor table */
function MarketTable() {
  const signalStyles = {
    bull: { bg: '#e8f5e9', color: '#2e7d32', label: 'Bullish' },
    bear: { bg: '#fdecea', color: '#c62828', label: 'Bearish moat' },
    neutral: { bg: '#eff8f8', color: TEAL, label: 'Watch' },
  };
  return (
    <div style={{ overflowX: 'auto', margin: '24px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Factor', 'Signal', 'Time Horizon'].map((h) => (
              <th
                key={h}
                style={{
                  background: 'var(--ink-primary, #222)',
                  color: 'var(--surface-primary, #fff)',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  fontSize: 12,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {marketFactors.map((row, i) => {
            const s = signalStyles[row.signal];
            return (
              <tr key={i} style={i % 2 === 1 ? { background: 'var(--surface-secondary, rgba(0,0,0,0.02))' } : {}}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))', color: 'var(--ink-secondary, #666)' }}>{row.factor}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))' }}>
                  <span style={{ display: 'inline-block', background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 500 }}>{s.label}</span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))', color: 'var(--ink-secondary, #666)' }}>{row.horizon}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* Glossary sidebar as inline grid for the blog layout */
function GlossarySection() {
  return (
    <div style={{ ...cardBg, margin: '28px 0' }}>
      <div style={{ ...mono, marginBottom: 12, color: GOLD }}>Glossary</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {glossary.map((g, i) => (
          <div key={i}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-primary, #222)', marginBottom: 2 }}>{g.term}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary, #888)', lineHeight: 1.5 }}>{g.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function GoogleAlgorithmMar252026() {
  useEffect(() => {
    let charts: { destroy: () => void }[] = [];

    async function draw() {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
      Chart.defaults.color = SOFT;
      Chart.defaults.borderColor = gridColor;
      Chart.defaults.font.size = 12;

      const el = (id: string) => document.getElementById(id) as HTMLCanvasElement | null;

      /* Chart 1: KV Cache Memory */
      const kv = el('kvMemChart');
      if (kv) {
        charts.push(
          new Chart(kv, {
            type: 'line',
            data: {
              labels: kvMemoryData.labels,
              datasets: [
                { label: 'Full precision (32 bit)', data: kvMemoryData.fullPrecision, borderColor: RED, backgroundColor: 'rgba(192,57,43,0.08)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3 },
                { label: 'TurboQuant (3 bit)', data: kvMemoryData.turboQuant, borderColor: TEAL, backgroundColor: 'rgba(26,107,107,0.08)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3 },
                { label: 'H100 memory ceiling (80GB)', data: kvMemoryData.h100Ceiling, borderColor: GHOST, borderWidth: 1.5, borderDash: [6, 4], fill: false, pointRadius: 0 },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { boxWidth: 14, padding: 12 } }, tooltip: { mode: 'index', intersect: false } },
              scales: {
                x: { grid: { color: gridColor }, title: { display: true, text: 'Context window (tokens)', font: { size: 11 } } },
                y: { grid: { color: gridColor }, title: { display: true, text: 'Memory (GB)', font: { size: 11 } }, min: 0 },
              },
            },
          })
        );
      }

      /* Chart 2: LongBench Scores */
      const lb = el('longbenchChart');
      if (lb) {
        charts.push(
          new Chart(lb, {
            type: 'bar',
            data: {
              labels: longBenchData.labels,
              datasets: [{
                data: longBenchData.scores,
                backgroundColor: longBenchData.colors.map((c, i) => {
                  const op = longBenchData.opacities[i];
                  if (c === '#1a6b6b') return `rgba(26,107,107,${op})`;
                  if (c === '#9a6f2e') return `rgba(154,111,46,${op})`;
                  return `rgba(180,178,169,${op})`;
                }),
                borderColor: longBenchData.colors,
                borderWidth: 1.5,
                borderRadius: 3,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` Score: ${(ctx.parsed.x ?? 0).toFixed(2)}` } } },
              scales: {
                x: { min: 48, max: 50.5, grid: { color: gridColor }, title: { display: true, text: 'LongBench aggregate score', font: { size: 11 } } },
                y: { grid: { display: false } },
              },
            },
          })
        );
      }

      /* Chart 3: Speedup */
      const sp = el('speedupChart');
      if (sp) {
        charts.push(
          new Chart(sp, {
            type: 'line',
            data: {
              labels: speedupData.labels,
              datasets: [
                { label: '4 bit TurboQuant', data: speedupData.fourBit, borderColor: TEAL, backgroundColor: 'rgba(26,107,107,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: TEAL },
                { label: '2 bit TurboQuant', data: speedupData.twoBit, borderColor: GOLD, backgroundColor: 'rgba(154,111,46,0.07)', borderWidth: 2, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: GOLD },
                { label: 'Baseline', data: [1, 1, 1, 1, 1, 1], borderColor: GHOST, borderWidth: 1, borderDash: [5, 4], fill: false, pointRadius: 0 },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { boxWidth: 14, padding: 12 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(1)}x` } } },
              scales: {
                x: { grid: { color: gridColor }, title: { display: true, text: 'Sequence length (tokens)', font: { size: 11 } } },
                y: { grid: { color: gridColor }, title: { display: true, text: 'Speedup over 32 bit baseline', font: { size: 11 } }, min: 0, max: 9 },
              },
            },
          })
        );
      }

      /* Chart 4: Cost */
      const co = el('costChart');
      if (co) {
        charts.push(
          new Chart(co, {
            type: 'bar',
            data: {
              labels: costData.labels,
              datasets: [
                { label: 'KV Cache GPU cost', data: costData.kvCacheCost, backgroundColor: ['rgba(192,57,43,0.75)', 'rgba(26,107,107,0.75)'], borderColor: [RED, TEAL], borderWidth: 1.5, borderRadius: 4 },
                { label: 'Model weights GPU cost', data: costData.modelWeightsCost, backgroundColor: ['rgba(180,178,169,0.6)', 'rgba(180,178,169,0.6)'], borderColor: ['#b4b2a9', '#b4b2a9'], borderWidth: 1.5, borderRadius: 4 },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { boxWidth: 14, padding: 12 } }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toFixed(2)}M/yr` } } },
              scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, grid: { color: gridColor }, title: { display: true, text: 'Estimated annual cost ($M)', font: { size: 11 } }, min: 0 },
              },
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
      {/* Hero stats */}
      <StatGrid
        cells={[
          { label: 'Speed increase on H100 GPUs', value: '8x', sub: 'Attention computation', direction: 'up' },
          { label: 'Memory reduction in KV cache', value: '6x', sub: 'Same accuracy', direction: 'up' },
          { label: 'Compression ratio', value: '3 bits', sub: 'Down from 32 bits, no fine tuning', direction: 'up' },
        ]}
      />

      <CalloutBox variant="amber">
        32 bits compressed to 3. No retraining. No accuracy loss. The entire cost structure of AI inference just shifted and almost no one noticed.
      </CalloutBox>

      {/* ── The Hidden Tax ── */}
      <SectionHeader number="01" title="The Hidden Tax on Every AI Query" />
      <Prose>
        <p>
          On March 24, 2026, a pair of researchers at Google published a paper to an academic blog. The post carried no press release, generated no trending hashtags, and drew the kind of engagement you would expect from a paper about compression algorithms. By the time most people in the technology industry had finished scrolling past it, they had missed what may be the single most consequential AI efficiency breakthrough of the year.
        </p>
        <p>
          The algorithm is called TurboQuant. What it does, in plain terms, is take the memory hungry mathematical machinery inside large AI models and compress it so aggressively and so cleanly that the same hardware can do more than six times the work. Not approximately. Not with caveats. With provable, mathematically guaranteed zero accuracy loss.
        </p>
        <p>
          The conventional story of AI cost focuses on training. That story, while dramatic, is the wrong one to watch. Training happens once. Inference happens billions of times a day, and its cost scales with every user, every query, every hour the product is live.
        </p>
        <p>
          Inside every inference operation lies a structure called the key value cache. Think of it as the model working memory: a constantly growing ledger of every token the model has seen in a conversation, stored at high speed on GPU memory. A single long conversation on a sophisticated model can consume 40 gigabytes of this precious, expensive memory. Multiply that by thousands of users and you begin to understand why the world most valuable companies are spending hundreds of billions on data centers.
        </p>
      </Prose>

      <ChartBlock
        id="kvMemChart"
        label="Chart 1 — The Memory Problem"
        headline="KV Cache Memory: How Context Length Devours GPU RAM"
        sub="Memory consumption per session (GB) as context window grows. Llama 3.1 70B model."
        note="Source: Oculus Research estimates based on published model specs. Dashed line = 80GB H100 memory ceiling."
        height={240}
      />

      <PullQuote>
        Memory bandwidth, not compute, is the real throttle on AI performance. The model is not waiting to think. It is waiting to remember.
      </PullQuote>

      <Prose>
        <p>
          The obvious solution is compression. The problem is that traditional compression carries its own overhead. Every time you compress a block of data, you have to store metadata about how you compressed it: minimum values, maximum values, scaling constants. These quantization constants add one to two extra bits per number back onto the very data you just compressed. You spend effort to save space and give half the savings back.
        </p>
        <p>
          This is the problem TurboQuant eliminates entirely.
        </p>
      </Prose>

      {/* ── What Google Built ── */}
      <SectionHeader number="02" title="What Google Actually Built" />
      <Prose>
        <p>
          TurboQuant is two algorithms working in sequence. The first, called PolarQuant, does something geometrically elegant: it converts the data from standard Cartesian coordinates into polar coordinates, which describe the same data using a radius and an angle. This is the mathematical equivalent of replacing &ldquo;Go three blocks east, four blocks north&rdquo; with &ldquo;Go five blocks at a 37 degree angle.&rdquo; The destination is identical. The description is more compact.
        </p>
        <p>
          In polar space, the distribution of angles follows a predictable, highly concentrated pattern. The model no longer needs to calculate and store the boundaries of each data block. Those boundaries are already known, fixed by the geometry of the polar coordinate system itself. The overhead vanishes. Not reduced. Vanished.
        </p>
        <p>
          The second algorithm, called QJL, handles the residual error left over from the first stage. Using a mathematical technique from theoretical computer science, it reduces each remaining number to a single bit while preserving the essential distances between data points. This acts as a mathematical error corrector, eliminating the bias that would otherwise accumulate and degrade the model outputs.
        </p>
      </Prose>

      {/* ── Benchmarks ── */}
      <SectionHeader number="03" title="The Benchmark Results" />
      <Prose>
        <p>
          Tested across five standard long context evaluation suites, TurboQuant matched or exceeded the performance of full precision models while compressing KV cache data by a factor of more than six. On NVIDIA H100 GPUs in 4 bit mode, the speedup in computing attention reached eight times faster than the unquantized baseline.
        </p>
        <p>
          There is a detail most coverage has missed: TurboQuant applies compression throughout the streaming process, including to generated tokens. Its competitors skip compression for generated tokens to avoid accuracy problems. TurboQuant does not skip. It runs the full pipeline at every step, and still matches the full precision baseline. That is a different category of result.
        </p>
      </Prose>

      <ChartBlock
        id="longbenchChart"
        label="Chart 2 — Benchmark Performance"
        headline="LongBench Scores: TurboQuant vs Competitors"
        sub="Aggregate score across question answering, code generation, and summarization tasks. Higher is better."
        note="Source: TurboQuant paper, ICLR 2026. KV bits shown in brackets. TurboQuant at 3.5 bits matches full precision exactly."
        height={260}
      />

      <ChartBlock
        id="speedupChart"
        label="Chart 3 — Inference Speed"
        headline="Speedup in Attention Computation vs Sequence Length"
        sub="Speedup over unquantized 32 bit baseline on H100 GPUs. 4 bit TurboQuant reaches 8x at long contexts."
        note="Source: TurboQuant paper, ICLR 2026. Speedup grows with sequence length."
        height={240}
      />

      {/* ── Cost Equation ── */}
      <SectionHeader number="04" title="The Cost Equation, Rewritten" />
      <Prose>
        <p>
          A 70 billion parameter model requires 140 gigabytes of memory before you account for the KV cache. An NVIDIA H100 carries 80 gigabytes of high bandwidth memory. A single large model requires at least two H100s just to load, before serving a single user. At cloud rates of roughly three dollars per GPU per hour, the baseline cost of keeping that model available around the clock exceeds fifty thousand dollars per year per model instance, before traffic.
        </p>
        <p>
          A six fold reduction in KV cache memory does not just save money on memory. It changes which hardware configurations become viable. Models that previously required cluster scale deployments begin fitting on single machines. Context windows that were previously limited by memory become tractable on existing infrastructure.
        </p>
      </Prose>

      <ChartBlock
        id="costChart"
        label="Chart 4 — The Cost Impact"
        headline="Estimated Annual Inference Cost: Before vs After TurboQuant"
        sub="Enterprise deployment of 70B model, 1,000 concurrent users, H100 cloud infrastructure at $3/GPU/hr."
        note="Estimates are illustrative. Actual savings depend on workload characteristics, context length, and concurrency patterns."
        height={220}
      />

      {/* ── Gemini Connection ── */}
      <SectionHeader number="05" title="The Gemini Connection" />
      <Prose>
        <p>
          Near the end of the Google Research post, the authors write that a major application is solving the key value cache bottleneck in models like Gemini. Google does not publish research about its own production systems in the speculative tense.
        </p>
        <p>
          If that reading is correct, every Gemini query processed today may already be benefiting from some version of this compression. The cost savings would be immediate, material, and invisible to the outside world until they show up as improved margins in a future earnings call. Google Cloud AI infrastructure advantages over AWS and Microsoft Azure would quietly widen.
        </p>
        <p>
          The paper is public. The mathematics is reproducible. But deployment requires engineering, integration, and testing. Google has a six to twelve month head start. That is the real competitive advantage: not the algorithm itself, but the operational lead time.
        </p>
      </Prose>

      {/* ── Market Angle ── */}
      <SectionHeader number="06" title="The Market Angle: What Traders Should Know" sourceTag="Not Financial Advice" />
      <CalloutBox variant="red">
        The following analysis is for informational and educational purposes only. Nothing in this section constitutes financial advice or a recommendation to buy or sell any security. Options trading involves substantial risk of loss.
      </CalloutBox>

      <Prose>
        <p>
          The market muted response to TurboQuant is itself informative. Institutional investors are not pricing this in. The paper generated no analyst notes, no press coverage from major financial outlets, and no visible options flow on either Alphabet or Nvidia.
        </p>
      </Prose>

      <SectionHeader number="06a" title="Alphabet (GOOGL)" />
      <Prose>
        <p>
          The bullish case rests on three pillars. Google owns the technology and has the infrastructure to deploy it at scale. The cost savings at Gemini query volume are structural improvements to unit economics. And a faster, cheaper Gemini strengthens Google Cloud against AWS and Azure at exactly the moment when enterprise AI contracts are being signed for multi year terms.
        </p>
        <p>
          The bear case is quieter but real. The paper is open source. Nothing stops OpenAI, Meta, or Anthropic from implementing the same techniques within months. The competitive moat from TurboQuant is time limited, not permanent.
        </p>
      </Prose>

      <MarketTable />

      <SectionHeader number="06b" title="Nvidia (NVDA) and the Jevons Argument" />
      <Prose>
        <p>
          The intuitive reaction to a memory efficiency breakthrough is bearish on Nvidia: if models need less GPU memory per query, fewer GPUs get sold. This logic is clean, straightforward, and historically wrong.
        </p>
        <p>
          The relevant economic concept is Jevons Paradox, named after the 19th century British economist who observed that more efficient steam engines did not reduce coal consumption. They made coal cheap enough that demand exploded. The same dynamic has played out in every technology efficiency cycle since.
        </p>
        <p>
          The DeepSeek episode of early 2025 provided the most recent demonstration. When DeepSeek revealed it had built a frontier quality AI model at a fraction of the compute cost, Nvidia stock fell 17% in a single day. Within weeks, Meta announced it was raising its 2025 AI capital expenditure to between $60 and $65 billion. The efficiency gain had not reduced demand. It had validated the investment case for more infrastructure.
        </p>
      </Prose>

      <PullQuote>
        TurboQuant does not threaten Nvidia business. It expands the market. Every query that becomes affordable unlocks ten new use cases that were not viable before.
      </PullQuote>

      <SectionHeader number="06c" title="The Options Framework" />
      <Prose>
        <p>
          <strong>Check implied volatility first.</strong> Before any directional bet, the cost of options must be assessed. IV relative to historical volatility determines whether you are overpaying for optionality. Given that TurboQuant has generated no broad analyst coverage, IV on Alphabet options is likely not elevated from this specific catalyst, which could favor buyers.
        </p>
        <p>
          <strong>The catalyst timeline determines expiration selection.</strong> The natural catalyst is not the paper itself. The natural catalyst is an earnings call where Alphabet explicitly references inference cost improvements or Gemini margin expansion. Any options position needs to expire after that date.
        </p>
        <p>
          <strong>Position sizing should reflect information asymmetry, not conviction strength.</strong> The appropriate size for a trade based on an underappreciated paper is not the same as a trade based on a product launch. The former involves more uncertainty about timing and market recognition.
        </p>
        <p>
          <strong>Leading indicators to watch.</strong> TurboQuant integration in Google Cloud AI APIs. Gemini announcements emphasizing longer context windows or lower pricing. Analyst notes quantifying inference cost improvements. Competitor announcements of similar techniques narrowing Alphabet advantage.
        </p>
      </Prose>

      {/* ── Bigger Picture ── */}
      <SectionHeader number="07" title="The Bigger Picture" />
      <Prose>
        <p>
          TurboQuant does not exist in isolation. It is one of several converging efficiency improvements that are collectively restructuring the economics of the industry. The direction of travel is clear: the cost per AI query will continue to fall, and fall faster than most projections assume.
        </p>
        <p>
          Google answer, for now, is that Google captures it. They built the algorithm, they have the production systems to deploy it, and they have a fleet of data centers running billions of queries a day on which every efficiency point compounds. The academic publication was not an act of corporate generosity. It was a signal: we solved this, it works, and we are running it at scale while everyone else reads the paper.
        </p>
        <p>
          The market, for once, is behind the curve.
        </p>
      </Prose>

      <GlossarySection />

      {/* Footer note */}
      <div style={{ ...mono, fontSize: 10, marginTop: 28, paddingTop: 14, borderTop: '1px solid var(--border, rgba(0,0,0,0.08))' }}>
        This article is for informational purposes only and does not constitute financial or investment advice. All investments carry risk. Past performance is not indicative of future results. Source: TurboQuant and PolarQuant papers, ICLR/AISTATS 2026. Authors: Amir Zandieh and Vahab Mirrokni, Google Research. Built with live MCP data.
      </div>
    </BlogLayout>
  );
}
