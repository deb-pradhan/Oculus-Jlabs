# Newspaper-Style Homepage Redesign

**Date**: 2026-03-26
**Status**: Approved
**Inspiration**: Off Crypto editorial newspaper aesthetic

---

## Overview

Redesign the Oculus homepage from a clean single-column blog feed to a hybrid editorial newspaper layout with live crypto prices, Pexels-sourced images with grainy monochrome filters, and bold typography.

## Architecture

### New Components

1. **`PriceTicker`** (client component)
   - Horizontal ticker bar with live BTC, ETH, SOL, XRP, BNB prices
   - CoinGecko free API (`/api/v3/simple/price`), no key required
   - 60-second refresh interval
   - Green/red 24h change percentages
   - Monospace font, subtle separator dots

2. **`HeroSection`** (server component)
   - 2-column layout on desktop (≥768px): featured post left (60%), headline stack right (40%)
   - Single column on mobile
   - Featured post: large Pexels image with grain+monochrome filter, bold headline, description, meta
   - Right column: 4 stacked headline links with category, date, dividers

3. **`PexelsImage`** (server component)
   - Wraps Next.js `<Image>` with grainy monochrome CSS treatment
   - CSS: `grayscale(100%) contrast(1.1)` + accent color overlay + SVG noise grain
   - Photographer attribution on hover

4. **`/api/pexels`** (API route)
   - Proxies Pexels search requests, hides API key server-side
   - Category-to-keyword mapping:
     - options → "stock options trading"
     - funding → "financial charts data"
     - onchain → "blockchain network"
     - macro → "global economy finance"
     - derivatives → "trading floor wall street"
     - signals → "data analytics technology"
   - 1-hour cache headers

### Modified Files

- `app/page.tsx` — Rewrite with new layout structure
- `app/home.module.css` — New styles for newspaper grid, ticker, grain effects
- `next.config.ts` — Add `images.pexels.com` to remote patterns
- `.env.local` — Add `PEXELS_API_KEY`

### Layout Structure

```
Header
├── PriceTicker (BTC · ETH · SOL · XRP · BNB)
├── Hero 2-Column
│   ├── Left: Featured post + large grainy image
│   └── Right: 4 headline links stacked
├── SearchBar (full-width, same as current)
├── Filter Pills (same as current)
├── Post Feed (single column, with small thumbnails)
└── Pagination
Footer
```

### Typography

- Hero headline: 52px desktop / 36px mobile, weight 900, letter-spacing -0.04em
- Category labels: all-caps monospace, accent color, weight 600
- Headline links: 20px, weight 700
- Body: 16px (unchanged)

### Image Treatment (CSS)

```css
/* Grayscale + contrast */
filter: grayscale(100%) contrast(1.1);

/* Accent color tint via overlay */
background: var(--color-accent-main);
mix-blend-mode: color;
opacity: 0.15;

/* SVG noise grain */
background-image: url("data:image/svg+xml,...");
opacity: 0.4;
```

### Data Sources

- **Live prices**: CoinGecko free API (client-side, no key)
- **Post images**: Pexels API (server-side, key: `PEXELS_API_KEY`)
- **Posts**: Existing Drizzle/Postgres query (unchanged)

### Env Variables

- `PEXELS_API_KEY` — Server-side only, added to Railway

### Config Changes

- `next.config.ts`: Add `images.pexels.com` to `remotePatterns`
- Pexels attribution: photographer name shown on image hover
