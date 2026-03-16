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
  perpTableColumns,
  perpTableData,
  spotStats,
  volumeBars,
  polymarketColumns,
  polymarketData,
  watchlistItems,
} from './data';

export default function MarketColorMar152026() {
  return (
    <BlogLayout meta={meta}>
        {/* ── 00 The Setup ──────────────────────────────────────────── */}
        <SectionHeader number="00" title="The Setup" />
        <Prose>
          <p>
            Bitcoin is holding $70K like a floor while the S&amp;P 500 just printed its 2026 low.
            Funding rates across the board are near zero. The options skew is flat. Prediction markets
            are pricing a 68% chance of a Fed cut by June. Everything points to a market that has
            de-risked and is waiting for a catalyst.
          </p>
          <p>
            The FOMC meeting on March 17-18 is that catalyst. Not because anyone expects a cut this
            week — Polymarket gives it just 12% — but because the dot-plot update will tell us whether
            the committee has shifted from &quot;higher for longer&quot; to &quot;ready to ease.&quot; If even one dot
            moves, the compressed spring uncoils.
          </p>
          <p>
            Meanwhile, the HYPE perp is showing -13% annualised funding with $620M in open interest.
            That is textbook squeeze setup: aggressive shorts stacking into a token unlock on Mar 22,
            with any positive catalyst capable of triggering a violent unwind. We are watching this
            closely.
          </p>
        </Prose>

        {/* ── 01 Macro Snapshot ─────────────────────────────────────── */}
        <SectionHeader number="01" title="Macro Snapshot" sourceTag="TradingView" />
        <StatGrid cells={macroStats} />
        <CalloutBox variant="red">
          <strong>Key risk:</strong> VIX at 22.5 and MOVE at 98 — both elevated. The dollar is weakening
          (DXY -0.8%) which is historically bullish for crypto, but the equity sell-off is dominating
          sentiment. Fear &amp; Greed at 28 = opportunity zone if you have conviction.
        </CalloutBox>

        {/* ── 02 Live Perps & Funding ───────────────────────────────── */}
        <SectionHeader number="02" title="Live Perps & Funding" sourceTag="Derive MCP" live />
        <DataTable
          columns={perpTableColumns}
          data={perpTableData}
          ariaLabel="Perpetual futures funding rates and open interest"
        />
        <CalloutBox variant="blue">
          <strong>Derive signal:</strong> BTC and ETH funding is near-zero — the leverage flush from
          last week is complete. SOL and XRP show mild short bias. The outlier is HYPE at -13.1%
          annualised — that level of negative funding with $620M OI is a coiled spring. If spot bids
          show up, the squeeze could add 15-20% in hours.
        </CalloutBox>

        {/* ── 03 Spot Snapshot ──────────────────────────────────────── */}
        <SectionHeader number="03" title="Spot Snapshot" sourceTag="CoinGlass" />
        <StatGrid cells={spotStats} />

        {/* ── 04 Volume Heat ────────────────────────────────────────── */}
        <SectionHeader number="04" title="Volume Heat" sourceTag="CoinGlass" />
        <VolumeBar bars={volumeBars} />
        <CalloutBox variant="amber">
          <strong>Notable:</strong> HYPE 24h volume hit $4.1B — disproportionately high vs. its market
          cap. This confirms heavy positioning ahead of the Mar 22 token unlock. The volume/OI ratio
          suggests active hedging, not organic spot demand. Watch for the flip.
        </CalloutBox>

        {/* ── 05 Polymarket Reads ───────────────────────────────────── */}
        <SectionHeader number="05" title="Polymarket Reads" sourceTag="Polymarket" live />
        <DataTable
          columns={polymarketColumns}
          data={polymarketData}
          ariaLabel="Polymarket prediction market prices"
        />
        <CalloutBox>
          <strong>Crowd wisdom:</strong> The 68% chance of a June cut (up 5% WoW) is the most important
          number on this page. It tells us the market is pricing a dovish pivot even as the Fed holds
          this week. Trump tariff escalation at 55% (up 8% WoW) is the wildcard — if reciprocal
          tariffs go live Mar 20 as expected, risk assets get another leg down before the cut trade
          can play out.
        </CalloutBox>

        {/* ── 06 Synthesis ──────────────────────────────────────────── */}
        <SectionHeader number="06" title="Synthesis" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Prose>
            <p><strong>Bull case:</strong></p>
            <p>
              BTC held $70K through a 2% S&amp;P drawdown — that is relative strength. Funding is
              reset. Stablecoin supply grew $1.2B this week. The fear index is at 28 — historically,
              buying crypto fear below 30 has been positive EV over 30/60/90 day windows. A dovish
              dot-plot on Mar 18 sends BTC to $78-82K within two weeks.
            </p>
          </Prose>
          <Prose>
            <p><strong>Bear case:</strong></p>
            <p>
              Equity markets are in a confirmed downtrend — Nasdaq -2.1% WoW. Tariff escalation on
              Mar 20 could trigger another leg down. MVRV at 1.85 is not capitulation-level cheap.
              The HYPE squeeze everyone is watching could just as easily resolve with a dump into the
              unlock. BTC loses $68K and the next support is $62K.
            </p>
          </Prose>
        </div>
        <CalloutBox variant="green">
          <strong>Our lean:</strong> Cautiously bullish. The risk/reward for BTC longs above $69K with
          a stop at $67.5K is attractive (2:1 to $74K). We are not chasing HYPE — the squeeze setup
          is obvious, which means it is crowded. Wait for FOMC clarity before adding risk.
        </CalloutBox>

        {/* ── 07 Triggers & Watchlist ───────────────────────────────── */}
        <SectionHeader number="07" title="Triggers & Watchlist" />
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
            The market is a compressed spring. Leverage is flushed, funding is flat, and the crowd is
            positioned for pain. The FOMC meeting is 48 hours away. If the dot-plot shifts dovish,
            BTC breaks $74K and alts follow. If Powell stays hawkish and tariffs land on Mar 20, we
            re-test $62K.
          </p>
          <p>
            Either way, the current state of near-zero funding and low positioning is not stable — it
            resolves violently in one direction. Size accordingly. This is not a week to be leveraged
            and away from screens.
          </p>
          <p>
            <em>
              This report uses live data from Derive protocol via MCP and prediction market pricing
              from Polymarket. All data as of Mar 15, 2026 18:00 UTC.
            </em>
          </p>
        </Prose>
      </BlogLayout>
  );
}
