'use client';

import BlogLayout from '@/components/layout/BlogLayout';
import StatGrid from '@/components/content/StatGrid';
import DataTable from '@/components/content/DataTable';
import CalloutBox from '@/components/content/CalloutBox';
import VolumeBar from '@/components/content/VolumeBar';
import SectionHeader from '@/components/content/SectionHeader';
import Prose from '@/components/content/Prose';
import { Watchlist, WatchlistItem } from '@/components/content/WatchlistItem';

import meta from './meta';
import {
  macroStats,
  fomcColumns,
  fomcData,
  perpTableColumns,
  perpTableData,
  spotStats,
  volumeBars,
  watchlistItems,
} from './data';

export default function MarketColorMar162026() {
  return (
    <BlogLayout meta={meta}>
      {/* ── 00 The Lede ──────────────────────────────────────────── */}
      <SectionHeader number="00" title="The Setup" />
      <Prose>
        <p>
          The market woke up this morning pricing a regime shift — not in rates, but in
          politics. BTC cleared $73k on zero leverage. ETH put on nearly 6% in a single
          session. And a prediction market is sitting at 99% probability that a
          Trump-appointed Fed governor dissents at tomorrow&apos;s FOMC. That last number
          is the one that matters most.
        </p>
        <p>
          The rate decision tomorrow is not a debate — it&apos;s a hold, full stop. But the{' '}
          <strong>dissent count in the statement</strong> tells you everything about the
          political temperature inside the Fed. Stephen Miran at 99%, Christopher Waller
          at 70.5%. If both dissent, it goes on record that two governors — one a Trump
          appointee, one reappointed under Trump — voted to cut while Powell held. That&apos;s
          not a monetary story. That&apos;s a political story with direct implications for how
          fast cuts arrive in H2 2026. Markets read it as dovish. Crypto loves dovish.
        </p>
      </Prose>
      <CalloutBox variant="green">
        <strong>Key signal:</strong> BTC is breaking out on FOMC eve with funding rates
        near-zero — a spot-driven move, not a leveraged one. That&apos;s the healthiest kind.
      </CalloutBox>

      {/* ── 01 Macro Snapshot ─────────────────────────────────────── */}
      <SectionHeader number="01" title="Macro — Last Friday's Close" sourceTag="TradingView" />
      <StatGrid cells={macroStats} />
      <CalloutBox variant="red">
        <strong>The macro environment remains stagflationary.</strong> Slowing growth (GDP
        +0.7%, payrolls -92k) colliding with re-accelerating inflation (PCE 3.1%) and an
        energy shock threatening $100 oil from the Iran/Hormuz disruption. The Fed cannot
        cut — inflation won&apos;t allow it. They cannot hike — the labor market won&apos;t survive
        it. They are structurally frozen. The only variable left is{' '}
        <em>how many governors publicly say they want to cut anyway.</em>
      </CalloutBox>

      {/* ── 02 FOMC Signal — Prediction Markets ───────────────────── */}
      <SectionHeader number="02" title="The FOMC Signal — Prediction Markets" sourceTag="Polymarket" live />
      <Prose>
        <p>
          The most important live market data right now is not a crypto price — it&apos;s two
          prediction markets on tomorrow&apos;s FOMC dissent vote. Both are live, both have
          been confirmed through direct market pulls.
        </p>
      </Prose>
      <CalloutBox variant="red">
        <strong>Critical:</strong> Prediction markets put Miran dissent at{' '}
        <strong>99%</strong> with $11,369 traded in the past 24 hours alone. Waller dissent
        is at <strong>70.5%</strong>. These are not directional price bets — they are binary
        event contracts. The market has made its call.
      </CalloutBox>
      <DataTable
        columns={fomcColumns}
        data={fomcData}
        ariaLabel="FOMC prediction market probabilities"
      />
      <Prose>
        <p>
          <strong>Reading the full picture:</strong> Warsh nomination at 100% (confirmed),
          Warsh confirmation at 95%, Miran dissent at 99%, Waller at 70.5%. This is a
          complete arc. The White House has already replaced Powell&apos;s successor. A
          Trump-aligned governor is almost certainly dissenting tomorrow. A second governor
          likely joins him. The market is pricing an accelerated dovish pivot — not this
          week, but within the next 1–2 FOMC cycles.{' '}
          <em>
            That is structurally bullish for risk assets and particularly for crypto as a
            debasement hedge.
          </em>
        </p>
      </Prose>

      {/* ── 03 Live Perps ─────────────────────────────────────────── */}
      <SectionHeader number="03" title="Live Perpetual Market Snapshot" sourceTag="Derive MCP" live />
      <Prose>
        <p>
          BTC cleared $73k overnight. ETH surged to $2,242, its largest single-day move in
          weeks. SOL runs +5.9%. Notice what&apos;s missing: leverage. BTC funding at +0.00125%
          with a $1,400 move is remarkably restrained — this is spot buyers walking the
          price up, not levered traders piling in.
        </p>
      </Prose>
      <DataTable
        columns={perpTableColumns}
        data={perpTableData}
        ariaLabel="Perpetual futures funding rates and open interest"
      />
      <CalloutBox variant="green">
        <strong>ETH outperforming BTC by nearly 4 percentage points in a single session is
        the rotation signal.</strong> When ETH leads, the market is moving from BTC (store
        of value / safety) toward ETH (smart contract infrastructure / risk-on). ETH funding
        is slightly negative even with a 5.8% move — meaning shorts are still present. SOL
        at +6.3% confirms the altcoin bid is real, not just a BTC-adjacent echo.
      </CalloutBox>

      {/* ── 04 Spot & OI ──────────────────────────────────────────── */}
      <SectionHeader number="04" title="Spot Prices & Open Interest" sourceTag="Derive MCP" />
      <StatGrid cells={spotStats} />
      <Prose>
        <p>
          <strong>The most important number in this table is BTC OI remaining flat at ~612
          BTC despite a $1,400 price move.</strong> In a leverage-driven pump, OI would
          expand dramatically. Flat OI with rising price means existing holders are not
          adding, and new buyers are purchasing spot — not opening leveraged futures. This
          is structurally sustainable.
        </p>
      </Prose>

      {/* ── 05 Volume Heat ────────────────────────────────────────── */}
      <SectionHeader number="05" title="24h Notional Volume — Perp Markets" sourceTag="Derive MCP" />
      <VolumeBar bars={volumeBars} />
      <CalloutBox variant="amber">
        <strong>HYPE leading volume for a third consecutive session — and the funding rate
        is now deepening, not recovering.</strong> Yesterday it was -0.00251%. Today it&apos;s
        -0.00560%. That is not a squeeze that&apos;s exhausting itself — it is accelerating.
        OI grew by another 3,000 contracts overnight. Shorts are not covering; they appear
        to be adding. Every session this continues is another coil in the spring.
      </CalloutBox>

      {/* ── 06 Synthesis ──────────────────────────────────────────── */}
      <SectionHeader number="06" title="Synthesis — The Full Picture" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Prose>
          <p><strong>Why this move has legs:</strong></p>
          <p>
            BTC at $73,136 represents a clean technical break above the $72,800 resistance
            that was the line in the sand through all of last week. The move is spot-driven,
            not leveraged. Funding is barely positive. OI flat. ETH running 5.8% with
            slightly negative funding means there&apos;s residual short positioning that
            hasn&apos;t been washed out. The FOMC dissent setup creates a dovish-read
            catalyst regardless of the rate decision.
          </p>
        </Prose>
        <Prose>
          <p><strong>What kills the move:</strong></p>
          <p>
            Powell&apos;s statement tomorrow uses language that frames the Iran oil shock as
            structurally inflationary rather than transitory. Oil breaks above $100 at the
            close tomorrow. The FOMC statement shows zero dissents — meaning Miran and
            Waller both fell in line at the last moment. Or a sudden Iran escalation
            triggers a full risk-off that overrides everything. Any one of these four events
            resets the setup. <em>None of them are low probability.</em>
          </p>
        </Prose>
      </div>
      <CalloutBox variant="blue">
        <strong>The single most important number to watch tomorrow at 2:00pm ET is not the
        rate — it&apos;s the dissent count.</strong> Zero dissents: mild hold, modest reaction.
        One dissent (Miran alone): dovish signal, crypto extends. Two dissents (Miran +
        Waller): White House pressure on record, full debasement narrative activates,
        strongest crypto tailwind. Three or more: historic.
      </CalloutBox>

      {/* ── 07 Triggers & Watchlist ───────────────────────────────── */}
      <SectionHeader number="07" title="Watchlist — This Week's Triggers" />
      <Watchlist>
        {watchlistItems.map((item, i) => (
          <WatchlistItem
            key={i}
            event={item.event}
            detail={item.detail}
            severity={item.severity}
          />
        ))}
      </Watchlist>

      {/* ── 08 Bottom Line ────────────────────────────────────────── */}
      <SectionHeader number="08" title="Bottom Line" />
      <Prose>
        <p>
          The tape is constructive. BTC above $73k on a spot-driven, low-leverage move is
          the cleanest breakout structure we&apos;ve seen in months. ETH&apos;s 5.8% single-session
          move with negative funding tells you the shorts are still there — the squeeze
          hasn&apos;t fully played out. SOL at +6.3% confirms the altcoin bid is real.
        </p>
        <p>
          Underneath the price action, the prediction markets are giving you the FOMC
          playbook 24 hours in advance: Miran dissents at 99%, Waller at 70.5%, Warsh
          confirmed at 95%. The Fed&apos;s political direction of travel is being front-run by
          smart money. <strong>The question isn&apos;t whether the Fed eventually cuts — it&apos;s
          whether tomorrow&apos;s statement makes the timeline feel more certain.</strong>
        </p>
        <p>
          Don&apos;t get married to the move before you see the statement. But the setup is the
          best it&apos;s been in six weeks. <em>Know your levels. Watch the dissent count.
          Stay liquid enough to respond to the wild card.</em>
        </p>
        <p>
          <em>
            This report uses live data from Derive protocol via MCP and prediction market
            pricing from Polymarket. All data as of Mar 16, 2026 morning UTC.
          </em>
        </p>
      </Prose>
    </BlogLayout>
  );
}
