'use client';

import React from 'react';
import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import CalloutBox from '@/components/content/CalloutBox';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';

import meta from './meta';
import { heroStats, platformStats } from './data';

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
          co-develop edge AI silicon for security cameras, robotics, industrial automation, and life sciences.
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

      <Prose>
        <p>
          The most valuable chip company in your basket might be the one you&apos;ve never heard of. That&apos;s
          usually how it works. By the time it&apos;s obvious, the trade is over.
        </p>

        <p style={{ fontSize: 12, color: INK3, fontStyle: 'italic' }}>
          Opinion — Jan Cortenbach. Not investment advice. Verify all numbers against primary filings.
        </p>
      </Prose>
    </BlogLayout>
  );
}
