'use client';

import React from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import { heroStats, figSynthesisSplit, figHowItWorks, figBenchmarkCost } from './data';

/* ── Palette ── */
const BORDER = '#e0ddd8';
const INK3 = '#777';

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK3,
};

/* ── Figure: inlined responsive SVG with eyebrow + caption ── */
function Figure({
  svg,
  eyebrow,
  caption,
}: {
  svg: string;
  eyebrow: string;
  caption: string;
}) {
  return (
    <figure style={{ margin: '32px 0' }}>
      <div style={{ ...mono, fontSize: 10, letterSpacing: '1.5px', marginBottom: 10 }}>{eyebrow}</div>
      <div
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: '#F4F1EA',
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption style={{ fontSize: 12, color: INK3, marginTop: 8, fontStyle: 'italic' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function OpenRouterFusionJune152026() {
  return (
    <BlogLayout meta={meta}>
      <Prose>
        <p>
          OpenRouter launched <strong>Fusion</strong> this week. The headline is that it matches Claude
          Fable 5 on a research benchmark for about half the cost, and they&apos;re calling it the smartest
          compound model on the market.
        </p>
        <p>
          I read the whole thread, and the thing that stuck with me wasn&apos;t the headline. It was a number
          they dropped halfway down. They say roughly <strong>three quarters of Fusion&apos;s improvement comes
          from the synthesis step</strong>, and only about a quarter from using a mix of different models.
        </p>
      </Prose>

      <StatGrid cells={heroStats} />

      <Figure
        svg={figSynthesisSplit}
        eyebrow="Fusion · Figure 1 — Source: OpenRouter, company benchmarks (DRACO)"
        caption="By OpenRouter's own split, synthesis — the judge and synthesizer reconciling answers — does three quarters of the work. The panel of models accounts for the other quarter."
      />

      <Prose>
        <p>
          That&apos;s a strange thing for OpenRouter to admit. Their business is selling access to lots of
          models. And here they are telling you the models are the minor ingredient.
        </p>
      </Prose>

      {/* ── Section 01 ── */}
      <SectionHeader number="01" title="How it actually works" sourceTag="Fusion announcement" />

      <Prose>
        <p>
          You send a prompt. Fusion sends it out to several models at once. A &ldquo;judge&rdquo; model reads
          all the answers and works out where they agree, where they contradict each other, and what each one
          caught that the others missed. Then a &ldquo;synthesizer&rdquo; model writes the final answer off the
          back of that.
        </p>
      </Prose>

      <Figure
        svg={figHowItWorks}
        eyebrow="Fusion · Figure 2 — Source: OpenRouter, Fusion announcement"
        caption="One prompt is fanned out to a panel, judged for agreement and conflict, then rewritten as a single reply."
      />

      <Prose>
        <p>
          So the part that moves the needle, by their own measurement, is the judging and the writing-up at the
          end. Not the panel itself. I find that genuinely interesting, and a little awkward for them.
        </p>
      </Prose>

      {/* ── Section 02 ── */}
      <SectionHeader number="02" title="The cheap-models result" sourceTag="DRACO (Perplexity)" />

      <Prose>
        <p>
          This is the part I keep coming back to. OpenRouter says a panel of budget models (Gemini 3 Flash,
          Kimi K2.6, and DeepSeek V4 Pro) came <strong>within about 1% of Fable 5</strong> once they were fused
          together. That same panel apparently beat solo GPT-5.5 and solo Opus 4.8 outright.
        </p>
      </Prose>

      <Figure
        svg={figBenchmarkCost}
        eyebrow="Fusion · Figure 3 — Source: OpenRouter benchmarks · DRACO (Perplexity)"
        caption="A fused panel of cheap models landed within ~1% of Fable 5 and beat two solo frontier models — at roughly half the cost. Bars are relative; OpenRouter did not publish per-model scores."
      />

      <Prose>
        <p>
          If that holds up, it suggests raw model quality matters less than I&apos;d assumed. You might not need
          the best model in the room. You need a few decent ones and a good way to combine what they say.
        </p>
        <p>
          I&apos;m hedging on &ldquo;if it holds up&rdquo; for a reason. This is one benchmark, run by the company
          selling the thing.
        </p>
      </Prose>

      {/* ── Section 03 ── */}
      <SectionHeader number="03" title="Where I get skeptical" />

      <Prose>
        <p>Two things bug me.</p>
      </Prose>

      <CalloutBox variant="amber">
        <p>
          <strong>The price claim.</strong> &ldquo;Half the cost of Fable&rdquo; reads clean, but you&apos;re
          not running one model anymore. You&apos;re running a whole panel of them, plus a judge, plus a
          synthesizer, on every single query. Cheaper than Fable for comparable quality on this test, maybe.
          It&apos;s still a lot more compute and a lot more waiting than a single model call, and the &ldquo;just
          call one slug&rdquo; framing skips past that.
        </p>
      </CalloutBox>

      <CalloutBox variant="blue">
        <p>
          <strong>The benchmark.</strong> They tested on DRACO, a deep-research benchmark from Perplexity. Deep
          research happens to be close to the best possible case for this approach, because the actual work is
          reconciling a pile of sources. I&apos;d want to see how Fusion does on quick factual questions, on
          coding, on anything creative, before I bought &ldquo;smartest compound model on the market&rdquo; as a
          general statement. On a one-line question, fanning out to five models and running a judge over them is
          probably just slower and pricier for no real gain.
        </p>
      </CalloutBox>

      {/* ── Section 04 ── */}
      <SectionHeader number="04" title="What I take from it" />

      <Prose>
        <p>
          For the last couple of years the conversation has been about the model. Which one scored highest, which
          lab shipped what. Fusion&apos;s own data points somewhere else, up a layer, into how you route a
          question and combine the answers you get back.
        </p>
        <p>
          I don&apos;t think this means models stop mattering. A panel of bad models won&apos;t save you. But
          OpenRouter set out to sell a smarter model and ended up making a fairly good case that the answer
          matters less than what you do with it afterward. I doubt that was the plan.
        </p>
      </Prose>

      <Prose>
        <p style={{ fontSize: 12, color: INK3, fontStyle: 'italic' }}>
          Opinion — Jlabs Research. Sources: OpenRouter Fusion announcement and company benchmarks; DRACO
          deep-research benchmark (Perplexity). Figures are relative illustrations; OpenRouter did not publish
          per-model scores. Not investment advice.
        </p>
      </Prose>
    </BlogLayout>
  );
}
