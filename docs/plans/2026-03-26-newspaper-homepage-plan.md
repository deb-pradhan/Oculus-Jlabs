# Newspaper Homepage Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Oculus homepage into a newspaper-style editorial layout with live crypto ticker, Pexels images with grainy monochrome filters, and a 2-column hero.

**Architecture:** Hybrid layout — price ticker bar at top, 2-column hero (featured post with large image on left, stacked headlines on right), then search/filters/feed below. Pexels images fetched server-side via API route, live prices fetched client-side from CoinGecko.

**Tech Stack:** Next.js App Router, CSS Modules, CoinGecko API (client), Pexels API (server), Next.js Image

---

### Task 1: Config — Add Pexels image domain and env var

**Files:**
- Modify: `next.config.ts:7-12`
- Modify: `.env.local` (add PEXELS_API_KEY)

**Step 1: Add images.pexels.com to next.config.ts remotePatterns**

```ts
// next.config.ts — add to remotePatterns array
remotePatterns: [
  {
    protocol: "https",
    hostname: "oculus.jlabsdigital.com",
  },
  {
    protocol: "https",
    hostname: "images.pexels.com",
  },
],
```

**Step 2: Add PEXELS_API_KEY to .env.local**

```
PEXELS_API_KEY=un0k7MZ990Dvd87UyF1LXtdWZZEDSGktFEDNfyliA2QbyDszMUKdaK74
```

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "config: add Pexels image domain to Next.js remote patterns"
```

---

### Task 2: API route — `/api/pexels`

**Files:**
- Create: `app/api/pexels/route.ts`

**Step 1: Create the Pexels proxy API route**

```ts
import { NextRequest, NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const CATEGORY_KEYWORDS: Record<string, string> = {
  options: "stock options trading finance",
  funding: "financial charts data analysis",
  onchain: "blockchain network technology",
  macro: "global economy finance markets",
  derivatives: "trading floor wall street",
  signals: "data analytics technology abstract",
};

export async function GET(request: NextRequest) {
  if (!PEXELS_API_KEY) {
    return NextResponse.json({ error: "Pexels API key not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "macro";
  const perPage = searchParams.get("per_page") || "1";
  const query = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.macro;

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&size=medium`,
    {
      headers: { Authorization: PEXELS_API_KEY },
      next: { revalidate: 3600 }, // cache 1 hour
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Pexels API error" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
```

**Step 2: Test locally**

```bash
curl http://localhost:3000/api/pexels?category=macro&per_page=1
```

Expected: JSON with photos array containing src.landscape URL.

**Step 3: Commit**

```bash
git add app/api/pexels/route.ts
git commit -m "feat: add Pexels image proxy API route"
```

---

### Task 3: Pexels image helper — server-side fetch function

**Files:**
- Create: `lib/pexels.ts`

**Step 1: Create the helper**

```ts
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const CATEGORY_KEYWORDS: Record<string, string> = {
  options: "stock options trading finance",
  funding: "financial charts data analysis",
  onchain: "blockchain network technology",
  macro: "global economy finance markets",
  derivatives: "trading floor wall street",
  signals: "data analytics technology abstract",
};

export interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    landscape: string;
    tiny: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
}

export async function fetchPexelsImage(category: string): Promise<PexelsPhoto | null> {
  if (!PEXELS_API_KEY) return null;

  const query = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.macro;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&size=medium`,
      {
        headers: { Authorization: PEXELS_API_KEY },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    // Pick a deterministic-ish photo based on category hash
    const photos = data.photos || [];
    if (photos.length === 0) return null;
    const idx = category.length % photos.length;
    return photos[idx];
  } catch {
    return null;
  }
}

export async function fetchPexelsImages(categories: string[]): Promise<Map<string, PexelsPhoto>> {
  const unique = [...new Set(categories)];
  const results = await Promise.all(unique.map((cat) => fetchPexelsImage(cat)));
  const map = new Map<string, PexelsPhoto>();
  unique.forEach((cat, i) => {
    if (results[i]) map.set(cat, results[i]!);
  });
  return map;
}
```

**Step 2: Commit**

```bash
git add lib/pexels.ts
git commit -m "feat: add Pexels image fetch helper"
```

---

### Task 4: PriceTicker client component

**Files:**
- Create: `components/home/PriceTicker.tsx`
- Create: `components/home/PriceTicker.module.css`

**Step 1: Create the component**

PriceTicker.tsx — client component that fetches CoinGecko prices on mount and every 60s. Displays horizontal bar with coin name, price, and 24h % change (green positive, red negative). Monospace font, dots between coins.

**Step 2: Create the CSS module**

Styles: horizontal flex, gap, monospace font, colors for positive/negative, border-bottom separator, responsive horizontal scroll on mobile.

**Step 3: Commit**

```bash
git add components/home/PriceTicker.tsx components/home/PriceTicker.module.css
git commit -m "feat: add live crypto PriceTicker component"
```

---

### Task 5: PexelsImage component with grain filter

**Files:**
- Create: `components/home/PexelsImage.tsx`
- Create: `components/home/PexelsImage.module.css`

**Step 1: Create PexelsImage component**

Server component wrapping Next.js `<Image>` with:
- Grayscale + contrast CSS filter
- Accent-colored overlay div with mix-blend-mode
- SVG noise grain pseudo-element
- Photographer attribution text on hover

**Step 2: Create CSS module**

```css
.imageContainer {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.image {
  filter: grayscale(100%) contrast(1.1) brightness(0.95);
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: var(--color-accent-main);
  mix-blend-mode: color;
  opacity: 0.15;
  pointer-events: none;
}

.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
}

.attribution {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 8px;
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
  opacity: 0;
  transition: opacity 0.2s ease;
}

.imageContainer:hover .attribution {
  opacity: 1;
}
```

**Step 3: Commit**

```bash
git add components/home/PexelsImage.tsx components/home/PexelsImage.module.css
git commit -m "feat: add PexelsImage with grain + monochrome filter"
```

---

### Task 6: Rewrite homepage — page.tsx + home.module.css

**Files:**
- Modify: `app/page.tsx` (full rewrite)
- Modify: `app/home.module.css` (full rewrite)

This is the main task. The new layout:

```
Header
PriceTicker
main (max-width: 960px)
  ├── Hero 2-column grid
  │   ├── Left (60%): Featured image + category + bold title + desc + meta
  │   └── Right (40%): 4 stacked headline links with category/date/dividers
  ├── SearchBar (full-width)
  ├── Filter pills
  ├── Post feed (single column, with small thumbnails)
  ├── Empty state
  └── Pagination
Footer
```

**Step 1: Rewrite page.tsx**

Key changes from current:
- Import and render `PriceTicker` above `<main>`
- Import `fetchPexelsImage` from `lib/pexels`
- Fetch Pexels image for featured post's category server-side
- Hero section: 2-column grid with featured post (left) + 4 headlines (right)
- Featured post includes `PexelsImage` component
- Increase `max-width` to 960px for wider newspaper feel
- `heroHeadlines` = posts 1-4 (right column), `feedPosts` = posts 5+ (below)
- Feed posts get small 80x80 thumbnail placeholders

**Step 2: Rewrite home.module.css**

Key new sections:
- `.main` max-width to 960px
- `.ticker` — horizontal price bar styles
- `.heroGrid` — CSS Grid `3fr 2fr` on desktop, single column mobile
- `.heroLeft` — featured post with image
- `.heroRight` — stacked headlines with dividers
- `.heroImage` — large image container (aspect-ratio 16/10)
- `.heroTitle` — 52px desktop, 36px mobile, weight 900, tight tracking
- `.headline` — right column headline items with border-bottom
- `.headlineTitle` — 18-20px, weight 700
- `.headlineCategory` — accent color, uppercase mono
- Existing search, filter, feed, empty styles adapted to wider layout

**Step 3: Test locally**

Open http://localhost:3000 and verify:
- Price ticker shows BTC/ETH/SOL/XRP/BNB with prices
- Hero shows 2-column layout on desktop
- Featured post has grainy monochrome image
- Right column has 4 headlines
- Search bar and filters work
- Feed below shows remaining posts
- Mobile (375px) stacks to single column

**Step 4: Commit**

```bash
git add app/page.tsx app/home.module.css
git commit -m "feat: redesign homepage with newspaper editorial layout"
```

---

### Task 7: Verify and push

**Step 1: Build check**

```bash
npm run build
```

Expected: Zero errors, homepage listed in build output.

**Step 2: Visual check in preview**

- Light mode screenshot
- Dark mode screenshot
- Mobile (375px) screenshot

**Step 3: Push to GitHub**

```bash
git push origin main
```

---

## File Summary

| File | Action |
|------|--------|
| `next.config.ts` | Modify — add images.pexels.com |
| `.env.local` | Modify — add PEXELS_API_KEY |
| `app/api/pexels/route.ts` | Create — Pexels proxy route |
| `lib/pexels.ts` | Create — server-side fetch helper |
| `components/home/PriceTicker.tsx` | Create — live price ticker |
| `components/home/PriceTicker.module.css` | Create — ticker styles |
| `components/home/PexelsImage.tsx` | Create — grainy image component |
| `components/home/PexelsImage.module.css` | Create — grain filter styles |
| `app/page.tsx` | Rewrite — newspaper layout |
| `app/home.module.css` | Rewrite — newspaper styles |
