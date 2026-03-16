# Oculus — Jlabs Crypto Research Blog Platform

**PRD Version:** 1.0
**Date:** 2026-03-16
**Domain:** oculus.jlabsdigital.com
**Status:** Design Review

---

## 1. Product Overview

### 1.1 What Is Oculus?

Oculus is a production-grade, LLM-authored crypto market research blog. Every blog post is a custom React page with interactive charts, live data fetching, and quantitative analysis — not a traditional text-based CMS blog.

### 1.2 Core Thesis

- **No CMS. No admin panel. No login.** Content is code. Each blog is a React component with its own data pipeline, charts, and visualizations.
- **LLM-native authoring.** New posts are created by Claude Code (or similar), pushed to git, and auto-deployed via Railway.
- **Quant-first branding.** Jlabs is positioned as the top crypto quant research and reporting brand. Every design, SEO, and content decision serves this positioning.

### 1.3 This Is a New Project From Scratch

Oculus is NOT a migration or fork of `btc-options-next`. It is a greenfield project with its own repo, domain, and architecture. Content from external sources (e.g., existing HTML reports like the Axe Capital Market Color series) will be converted into Oculus blog pages as new posts.

---

## 2. Architecture

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHORING PIPELINE                        │
│                                                             │
│  Claude Code / LLM                                          │
│       │                                                     │
│       ▼                                                     │
│  Creates: app/blog/[slug]/                                  │
│    ├── page.tsx        (custom React page)                  │
│    ├── meta.ts         (title, date, tags, description)     │
│    ├── data.ts         (static data, configs)               │
│    └── components/     (page-specific charts/viz)           │
│       │                                                     │
│       ▼                                                     │
│  git push → main                                            │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUILD & DEPLOY (Railway)                  │
│                                                             │
│  1. Docker build triggered on push                          │
│  2. Prebuild: scan app/blog/*/meta.ts                       │
│     → sync metadata INTO Postgres (upsert by slug)          │
│     → generate static sitemap.xml, rss.xml                  │
│  3. Next.js build (SSR + static where possible)             │
│  4. Deploy standalone server                                │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME                                   │
│                                                             │
│  Next.js Standalone Server (Docker on Railway)              │
│    ├── SSR pages (blog posts with live data fetching)       │
│    ├── API Routes                                           │
│    │    ├── /api/posts      (paginated list, search, filter)│
│    │    ├── /api/reactions   (like/react per post)          │
│    │    ├── /api/views       (increment + read view count)  │
│    │    └── /api/derive/*    (proxy to Derive/Lyra API)     │
│    └── Static assets (CDN via Railway edge)                 │
│                                                             │
│  Railway Postgres                                           │
│    ├── posts (synced from meta.ts at build time)            │
│    ├── reactions (post_slug, emoji, count)                  │
│    ├── views (post_slug, count, unique fingerprints)        │
│    └── search index (tsvector on title + description + tags)│
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 15+ (App Router)** | File-based routing = blog index. SSR for SEO. API routes for backend. |
| Language | **TypeScript** | Type safety for shared components and data contracts. |
| Styling | **CSS Modules + CSS Variables** | Matches existing design system. No runtime CSS-in-JS overhead. |
| Charts | **Recharts** | Already used in btc-options-next. Lightweight, composable. |
| Database | **Railway Postgres** | Reactions, views, search. Single managed service. |
| DB Client | **Drizzle ORM** | Type-safe, lightweight, SQL-first. No heavy abstraction. |
| Deployment | **Docker → Railway** | Auto-deploy on git push. Premium tier. |
| Fonts | **Geist Sans + Geist Mono** (via next/font) | Design system spec. Fallback: Inter + JetBrains Mono. |

### 2.3 Project Structure

```
oculus/
├── app/
│   ├── layout.tsx                 # Root layout (theme provider, header, footer)
│   ├── page.tsx                   # Homepage (blog list, search, pagination)
│   ├── globals.css                # Design system tokens + global styles
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx           # Dynamic route → loads blog component
│   │   ├── march-7-2026-btc-options/
│   │   │   ├── page.tsx           # Custom React page (the actual blog)
│   │   │   ├── meta.ts            # Metadata export
│   │   │   ├── data.ts            # Static data for charts
│   │   │   └── components/        # Page-specific components
│   │   ├── march-16-2026-eth-funding/
│   │   │   ├── page.tsx
│   │   │   ├── meta.ts
│   │   │   └── ...
│   │   └── ... (each blog is a folder)
│   ├── api/
│   │   ├── posts/route.ts         # GET: paginated list, search, filter
│   │   ├── reactions/route.ts     # POST: react, GET: counts
│   │   ├── views/route.ts         # POST: increment, GET: count
│   │   ├── rss/route.ts           # RSS feed generation
│   │   └── derive/[...path]/route.ts  # Proxy to Derive API
│   ├── sitemap.ts                 # Next.js sitemap generation
│   └── robots.ts                  # robots.txt generation
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Global header (logo, search, theme toggle)
│   │   ├── Footer.tsx             # Global footer
│   │   ├── TableOfContents.tsx    # Auto-generated ToC (left sidebar / header)
│   │   └── ThemeToggle.tsx        # Dark/Light mode switch
│   ├── blog/
│   │   ├── BlogCard.tsx           # Card for homepage grid
│   │   ├── BlogMeta.tsx           # Reading time, date, tags display
│   │   ├── ShareButtons.tsx       # Social share (X, Telegram, LinkedIn, copy)
│   │   ├── ReactionBar.tsx        # Like/React widget
│   │   ├── RelatedPosts.tsx       # Content recommendations
│   │   ├── Pagination.tsx         # Numbered page navigation
│   │   └── SearchBar.tsx          # Full-text search with filters
│   └── charts/                    # Shared chart components (ported from btc-options-next)
│       ├── PayoffChart.tsx
│       ├── OIHeatmap.tsx
│       ├── AllocationPie.tsx
│       ├── ScenarioMatrix.tsx
│       └── ... (migrated shared components)
├── lib/
│   ├── db/
│   │   ├── schema.ts              # Drizzle schema (posts, reactions, views)
│   │   ├── client.ts              # Postgres connection
│   │   └── migrate.ts             # Migration runner
│   ├── sync-manifest.ts           # Prebuild: scan meta.ts → upsert Postgres
│   ├── reading-time.ts            # Estimate reading time from component tree
│   ├── toc-extract.ts             # Extract headings for ToC
│   └── seo.ts                     # Shared SEO helpers (schema.org, meta generators)
├── public/
│   ├── og-image.png               # Default OG image
│   ├── jlabs-logo.svg             # Brand assets
│   └── icons/                     # Favicons, apple-touch, etc.
├── scripts/
│   ├── sync-posts.ts              # Scan app/blog/*/meta.ts → Postgres upsert
│   ├── generate-rss.ts            # Build RSS/Atom XML
│   └── new-post.ts                # Scaffold template for LLM to fill
├── drizzle/
│   └── migrations/                # SQL migration files
├── Dockerfile
├── docker-compose.yml             # Local dev (app + postgres)
├── .env.example
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 3. Database Schema

### 3.1 Tables

```sql
-- Synced from file-system meta.ts at build time
CREATE TABLE posts (
    slug            TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT NOT NULL,
    date            DATE NOT NULL,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    thumbnail       TEXT,
    reading_time    INTEGER,           -- minutes
    word_count      INTEGER,
    category        TEXT,              -- 'options', 'funding', 'onchain', 'macro'
    search_vector   TSVECTOR,          -- auto-generated for full-text search
    synced_at       TIMESTAMPTZ DEFAULT NOW(),

    -- Denormalized counters (updated async)
    view_count      INTEGER DEFAULT 0,
    reaction_count  INTEGER DEFAULT 0
);

CREATE INDEX idx_posts_date ON posts (date DESC);
CREATE INDEX idx_posts_search ON posts USING GIN (search_vector);
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX idx_posts_category ON posts (category);

-- Trigger to auto-update search_vector
CREATE OR REPLACE FUNCTION posts_search_trigger() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, '{}'), ' ')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_search
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION posts_search_trigger();

-- Anonymous reactions (no login required)
CREATE TABLE reactions (
    id              SERIAL PRIMARY KEY,
    post_slug       TEXT NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
    emoji           TEXT NOT NULL,       -- '🔥', '🧠', '💎', '📉', '🚀'
    fingerprint     TEXT,                -- browser fingerprint (rate limiting)
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reactions_slug ON reactions (post_slug);
CREATE UNIQUE INDEX idx_reactions_unique ON reactions (post_slug, emoji, fingerprint);

-- Page views
CREATE TABLE views (
    id              SERIAL PRIMARY KEY,
    post_slug       TEXT NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
    fingerprint     TEXT,
    referrer        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_views_slug ON views (post_slug);
CREATE INDEX idx_views_created ON views (created_at DESC);
```

### 3.2 Key Queries

```sql
-- Homepage: paginated, sorted by date
SELECT slug, title, description, date, tags, thumbnail, reading_time,
       view_count, reaction_count
FROM posts ORDER BY date DESC LIMIT 12 OFFSET 0;

-- Search
SELECT slug, title, description, date, tags,
       ts_rank(search_vector, query) AS rank
FROM posts, plainto_tsquery('english', 'btc funding rate') AS query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- Related posts (same tags, different slug)
SELECT slug, title, date, tags FROM posts
WHERE tags && (SELECT tags FROM posts WHERE slug = $1)
  AND slug != $1
ORDER BY date DESC LIMIT 3;

-- Reaction counts per post
SELECT emoji, COUNT(*) FROM reactions
WHERE post_slug = $1 GROUP BY emoji;

-- Trending posts (most views in last 7 days)
SELECT post_slug, COUNT(*) as views_7d
FROM views WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY post_slug ORDER BY views_7d DESC LIMIT 5;
```

---

## 4. Blog Post Contract (meta.ts)

Every blog folder MUST export a `meta.ts` with this shape:

```typescript
// app/blog/march-16-2026-eth-funding/meta.ts

import { BlogMeta } from '@/lib/types';

const meta: BlogMeta = {
    slug: 'march-16-2026-eth-funding',
    title: 'ETH Funding Rate Divergence: A Contrarian Signal',
    date: '2026-03-16',
    description: 'Funding rates on ETH perps have decoupled from spot momentum. '
               + 'We analyze 90 days of funding history across Derive, Binance, and dYdX '
               + 'to identify the inflection pattern.',
    tags: ['ETH', 'funding-rates', 'derivatives', 'contrarian'],
    category: 'funding',
    thumbnail: '/blog/march-16-2026-eth-funding/og.png',
    authors: ['Jlabs Research'],
    readingTime: 8,  // minutes (can be auto-calculated)
};

export default meta;
```

```typescript
// lib/types.ts
export interface BlogMeta {
    slug: string;
    title: string;
    date: string;            // YYYY-MM-DD
    description: string;     // 1-3 sentences, used for SEO + cards
    tags: string[];
    category: 'options' | 'funding' | 'onchain' | 'macro' | 'derivatives' | 'signals';
    thumbnail?: string;
    authors?: string[];
    readingTime?: number;
}
```

---

## 5. Page-by-Page Specification

### 5.1 Homepage (`/`)

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  HEADER: Logo | Search Bar | Theme Toggle        │
├──────────────────────────────────────────────────┤
│  HERO SECTION                                    │
│  "Oculus — Crypto Market Intelligence"           │
│  Stats: XX reports · Updated daily · N categories│
├──────────────────────────────────────────────────┤
│  FILTER BAR: [All] [Options] [Funding] [Onchain] │
│              [Macro] [Derivatives] [Signals]      │
├──────────────────────────────────────────────────┤
│  BLOG GRID (2 cols desktop, 1 col mobile)        │
│  ┌────────────┐ ┌────────────┐                   │
│  │ Blog Card  │ │ Blog Card  │                   │
│  │ Thumb      │ │ Thumb      │                   │
│  │ Title      │ │ Title      │                   │
│  │ Desc       │ │ Desc       │                   │
│  │ Tags · 8m  │ │ Tags · 5m  │                   │
│  │ Views · 🔥 │ │ Views · 🧠 │                   │
│  └────────────┘ └────────────┘                   │
│  ... (12 per page)                               │
├──────────────────────────────────────────────────┤
│  PAGINATION: ← 1 [2] 3 4 ... 12 →               │
├──────────────────────────────────────────────────┤
│  FOOTER                                          │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Server-side rendered. Initial page load fetches from Postgres.
- Category filter pills update URL params (`/?category=options&page=2`).
- Search bar does real-time search via `/api/posts?q=...` with debounce.
- 12 posts per page. Numbered pagination (not infinite scroll — better for SEO).
- Each card shows: thumbnail, title, description (truncated), tags, reading time, view count, top reaction emoji.

### 5.2 Blog Post Page (`/blog/[slug]`)

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  HEADER: Logo | ← Back to Research | Theme Toggle│
├──────────┬───────────────────────────────────────┤
│  TABLE   │  BLOG CONTENT                         │
│  OF      │  ┌─────────────────────────────────┐  │
│  CONTENTS│  │ Title (H1)                      │  │
│          │  │ Date · 8 min read · Category    │  │
│  • Intro │  │ Share: [X] [TG] [LI] [Copy]    │  │
│  • Data  │  ├─────────────────────────────────┤  │
│  • Chart │  │                                 │  │
│  • Trade │  │  (Custom React content:         │  │
│  • Risk  │  │   charts, tables, simulators,   │  │
│          │  │   live data, interactive viz)    │  │
│  (sticky │  │                                 │  │
│   on     │  ├─────────────────────────────────┤  │
│   scroll)│  │ REACTION BAR                    │  │
│          │  │ 🔥 42  🧠 28  💎 15  🚀 7      │  │
├──────────┴──┴─────────────────────────────────┤  │
│  SHARE BUTTONS (sticky bottom bar on mobile)     │
├──────────────────────────────────────────────────┤
│  RELATED POSTS (3 cards, same tags)              │
├──────────────────────────────────────────────────┤
│  FOOTER                                          │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Each blog is a custom React page. NOT markdown rendered — full JSX with interactive components.
- Table of Contents: auto-extracted from heading elements. Sticky left sidebar on desktop (>1024px), collapsible dropdown in header on mobile.
- Share buttons: X (Twitter), Telegram, LinkedIn, Copy Link. Uses `navigator.share` on mobile where available. Each generates proper share URL with UTM params.
- Reactions: 5 emojis (🔥 🧠 💎 📉 🚀). Click to react. Rate-limited by browser fingerprint (1 reaction per emoji per visitor). No login required. Animated on click.
- View count: incremented via `/api/views` on page load (debounced, fingerprinted to avoid refresh spam).
- Reading time: displayed in header, calculated from meta.ts or estimated from content length.

### 5.3 Blog Post Wrapper (BlogLayout)

Every blog page is wrapped in a shared layout that provides:

```typescript
// app/blog/[slug]/layout.tsx — shared wrapper
// Provides: Header, ToC, Share, Reactions, Related Posts, Footer, SEO meta
// The page.tsx inside each blog folder provides ONLY the custom content.
```

This means the LLM authoring a new blog ONLY needs to write:
1. `meta.ts` — metadata
2. `page.tsx` — the actual content (charts, text, interactive elements)
3. `data.ts` — any static data for charts (optional)
4. `components/` — page-specific components (optional)

Everything else (header, footer, ToC, share, reactions, related posts, SEO) is automatic.

---

## 6. SEO & LLM Discoverability

### 6.1 Per-Page SEO (Auto-generated from meta.ts)

```typescript
// Auto-generated in blog layout from meta.ts:
export async function generateMetadata({ params }): Promise<Metadata> {
    const meta = await import(`../blog/${params.slug}/meta`);
    return {
        title: `${meta.title} | Oculus by Jlabs`,
        description: meta.description,
        keywords: meta.tags,
        authors: [{ name: 'Jlabs Digital' }],
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'article',
            publishedTime: meta.date,
            tags: meta.tags,
            images: [meta.thumbnail || '/og-image.png'],
            siteName: 'Oculus by Jlabs Digital',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
            creator: '@jlabsdigital',
        },
        alternates: {
            canonical: `https://oculus.jlabsdigital.com/blog/${meta.slug}`,
        },
    };
}
```

### 6.2 Structured Data (JSON-LD per blog)

```json
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "ETH Funding Rate Divergence: A Contrarian Signal",
    "description": "...",
    "datePublished": "2026-03-16",
    "author": { "@type": "Organization", "name": "Jlabs Digital" },
    "publisher": {
        "@type": "Organization",
        "name": "Jlabs Digital",
        "url": "https://jlabsdigital.com"
    },
    "mainEntityOfPage": "https://oculus.jlabsdigital.com/blog/march-16-2026-eth-funding",
    "keywords": ["ETH", "funding-rates", "derivatives"],
    "articleSection": "Crypto Market Research"
}
```

### 6.3 LLM-Friendly Content

Every blog page includes a hidden `<script type="application/ld+json">` block AND a semantic HTML structure that any AI crawler can parse:

- `<article>` wrapper with `itemscope itemtype="https://schema.org/Article"`
- All chart data available as `<table>` elements with `aria-label` (screen-reader AND LLM friendly)
- `<meta name="ai-content-summary">` tag with a 2-sentence summary
- A `/llms.txt` file at root listing all blog URLs with summaries (emerging LLM SEO standard)

### 6.4 Global SEO Assets

| Asset | Route | Generation |
|-------|-------|-----------|
| Sitemap | `/sitemap.xml` | Next.js `sitemap.ts` — reads from Postgres |
| RSS Feed | `/api/rss` (also `/feed.xml` redirect) | Generated from Postgres post list |
| Atom Feed | `/api/rss?format=atom` | Same endpoint, different format |
| robots.txt | `/robots.txt` | Next.js `robots.ts` |
| llms.txt | `/llms.txt` | Generated at build time from manifest |
| Canonical URLs | Per-page | `https://oculus.jlabsdigital.com/blog/[slug]` |

---

## 7. Design System Implementation

### 7.1 Theme Tokens (Dark/Light)

Extending the existing "Technical Blueprint" design system with dark mode:

```css
:root, [data-theme="light"] {
    /* Existing design system tokens (unchanged) */
    --surface-canvas: #E8E9ED;
    --surface-card: #FFFFFF;
    --surface-subtle: #F5F6F8;
    --ink-primary: #0F1115;
    --ink-secondary: #585C65;
    --ink-tertiary: #9AA0A6;
    --ink-on-accent: #FFFFFF;
    --color-accent-main: #3A2E6F;
    --color-accent-hover: #4D4085;
    --color-accent-subtle: #EBE9F5;
    --signal-error: #B3261E;
    --signal-warning: #E6B000;
    --signal-success: #006E50;
    --border-grid: #C4C6CD;
    --border-element: #E0E2E6;
}

[data-theme="dark"] {
    --surface-canvas: #0C0D10;
    --surface-card: #16171C;
    --surface-subtle: #1E1F26;
    --ink-primary: #E8E9ED;
    --ink-secondary: #9AA0A6;
    --ink-tertiary: #585C65;
    --ink-on-accent: #FFFFFF;
    --color-accent-main: #7B6FBF;
    --color-accent-hover: #9589D4;
    --color-accent-subtle: #1E1A33;
    --signal-error: #F2726A;
    --signal-warning: #F5CE5C;
    --signal-success: #4FD1A5;
    --border-grid: #2A2B33;
    --border-element: #22232A;
}
```

### 7.2 Design Principles Preserved

- **Rule of Edge:** Containers sharp (0px radius), controls organic (999px radius pill)
- **Rule of Ink:** No decorative elements. Data and structure only.
- **Typography:** Geist Sans (headings/body), Geist Mono (data/numbers). No bold, no italics. Hierarchy via size + casing.
- **Charts:** 1px stroke, accent color for active data, hatching instead of fills.
- **Grid:** Bento grid with 1px borders, no gaps, no shadows.

### 7.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, ToC in header dropdown, sticky share bar |
| Tablet | 640–1024px | Single column, wider cards |
| Desktop | > 1024px | Two-column (ToC sidebar + content), grid blog cards |

---

## 8. Feature Specifications

### 8.1 Search

- **Input:** Search bar in header. Debounced (300ms).
- **Backend:** Postgres `tsvector` full-text search with ranking.
- **Filters:** Category pills, tag filter, date range (optional future).
- **Results:** Instant results dropdown on type (top 5), full results page on Enter.
- **URL:** `/search?q=funding+rates&category=derivatives` (shareable, bookmarkable).

### 8.2 Pagination

- **Style:** Numbered pages with prev/next arrows: `← 1 2 [3] 4 ... 12 →`
- **Page size:** 12 posts per page.
- **URL:** `/?page=3&category=options` (SSR-friendly, SEO-crawlable).
- **Edge cases:** Page 1 = no `?page` param. Last page shows remaining items. Invalid page → redirect to page 1.

### 8.3 Reactions (No Login)

- **Emojis:** 🔥 (fire/hot take), 🧠 (insightful), 💎 (diamond/alpha), 📉 (bearish signal), 🚀 (bullish)
- **Rate limiting:** Browser fingerprint (canvas + timezone + UA hash). 1 click per emoji per visitor.
- **Storage:** `reactions` table in Postgres. Denormalized count on `posts` table updated async.
- **UX:** Click → emoji bounces + count increments. Already-reacted emojis show filled state (persisted in localStorage).

### 8.4 Share Buttons

- **Platforms:** X (Twitter), Telegram, LinkedIn, Copy Link
- **Share URL:** `https://oculus.jlabsdigital.com/blog/[slug]?utm_source=[platform]&utm_medium=social`
- **Mobile:** Uses `navigator.share()` Web Share API where available.
- **Copy:** Copies URL to clipboard with "Copied!" toast confirmation.
- **Placement:** Below title (desktop), sticky bottom bar (mobile).

### 8.5 Table of Contents

- **Generation:** Extract all `<h2>` and `<h3>` elements from blog content at runtime.
- **Desktop (>1024px):** Sticky left sidebar. Highlights active section on scroll (Intersection Observer).
- **Mobile:** Collapsible dropdown accessible from header. Tapping a heading scrolls to it and closes dropdown.
- **Smooth scroll:** `scroll-behavior: smooth` with offset for fixed header.

### 8.6 Related Posts

- **Algorithm:** Same-tag overlap, excluding current post, ordered by date DESC. Limit 3.
- **Query:** `WHERE tags && current_post.tags AND slug != current_slug ORDER BY date DESC LIMIT 3`
- **Fallback:** If < 3 matches, fill with most recent posts from any category.
- **Placement:** Below reactions, above footer.

### 8.7 Dark/Light Mode

- **Default:** Respects `prefers-color-scheme` system setting.
- **Toggle:** Pill button in header. Stores preference in `localStorage`.
- **Implementation:** `data-theme` attribute on `<html>`. All colors via CSS variables. No flash of wrong theme (inline script in `<head>`).
- **Charts:** Recharts components read CSS variables for stroke/fill colors.

### 8.8 Reading Time

- **Calculation:** `Math.ceil(wordCount / 200)` minutes (200 WPM for technical content).
- **Source:** Can be set manually in `meta.ts` or auto-calculated from content.
- **Display:** "8 MIN READ" label in blog header and on homepage cards.

---

## 9. API Routes

### 9.1 `GET /api/posts`

```
Query params:
  ?page=1          (default: 1)
  &limit=12        (default: 12, max: 50)
  &q=search+term   (full-text search)
  &category=options (filter by category)
  &tag=BTC         (filter by tag)
  &sort=date|views|reactions (default: date)

Response: {
  posts: BlogMeta[],
  total: number,
  page: number,
  totalPages: number
}
```

### 9.2 `POST /api/reactions`

```
Body: { slug: string, emoji: string, fingerprint: string }
Response: { success: boolean, counts: Record<string, number> }
Rate limit: 1 per emoji per fingerprint per slug
```

### 9.3 `POST /api/views`

```
Body: { slug: string, fingerprint: string, referrer?: string }
Response: { count: number }
Dedup: Same fingerprint only counted once per 24h per slug
```

### 9.4 `GET /api/rss`

```
Query: ?format=rss|atom (default: rss)
Response: XML (application/rss+xml or application/atom+xml)
Content: Latest 50 posts with title, description, date, link
```

---

## 10. Content Authoring Pipeline (LLM Workflow)

### 10.1 New Post Scaffold

A scaffold script generates the folder structure:

```bash
npx tsx scripts/new-post.ts --slug "march-16-2026-eth-funding" --title "ETH Funding Rate Divergence"
```

Creates:
```
app/blog/march-16-2026-eth-funding/
├── page.tsx        # Template with BlogLayout wrapper
├── meta.ts         # Pre-filled with slug, title, today's date
├── data.ts         # Empty data export
└── components/     # Empty directory
```

### 10.2 LLM Authoring Flow

1. LLM receives research brief / data
2. LLM runs scaffold script
3. LLM writes custom `page.tsx` with charts, analysis, interactive elements
4. LLM fills `meta.ts` with accurate metadata
5. LLM fills `data.ts` with chart data (or page fetches live)
6. `git add . && git commit && git push`
7. Railway detects push → Docker build → prebuild syncs meta to Postgres → deploy
8. Blog is live at `oculus.jlabsdigital.com/blog/[slug]`

### 10.3 Blog Page Template

```tsx
// app/blog/[slug-here]/page.tsx
'use client';

import { BlogLayout } from '@/components/layout/BlogLayout';
import meta from './meta';
// import custom components, data, etc.

export default function BlogPost() {
    return (
        <BlogLayout meta={meta}>
            {/* All custom content goes here */}
            <section id="overview">
                <h2>Market Overview</h2>
                <p>...</p>
            </section>
            <section id="data">
                <h2>Data Analysis</h2>
                {/* Custom charts, tables, interactive elements */}
            </section>
        </BlogLayout>
    );
}
```

The `<BlogLayout>` wrapper automatically provides:
- SEO meta tags (from meta.ts)
- Header with back navigation
- Table of contents (extracted from children's h2/h3 elements)
- Share buttons
- Reaction bar
- View counter
- Related posts
- Footer

---

## 11. Performance Requirements

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | SSR for initial HTML, lazy-load charts below fold |
| FID | < 100ms | Minimal client JS, code-split per blog |
| CLS | < 0.1 | Fixed dimensions for images, skeleton loaders |
| TTI | < 3.5s | Standalone build, tree-shaking, dynamic imports |
| Bundle | < 150KB initial JS | Code-split each blog page, shared chunk for common components |

**Strategies:**
- `next/dynamic` for heavy chart components (lazy loaded)
- `next/image` with WebP/AVIF auto-format
- Skeleton screens while charts hydrate
- CSS Modules (zero runtime CSS overhead)
- Postgres connection pooling (prevent cold-start DB lag)

---

## 12. Monitoring & Analytics

### 12.1 Google Analytics 4

- **Integration:** GA4 via `@next/third-parties/google` (official Next.js package). Zero-config, loads async.
- **Environment variable:** `NEXT_PUBLIC_GA_ID` (e.g., `G-XXXXXXXXXX`)
- **Events tracked:** Page views (automatic), reactions (custom event), share clicks (custom event), search queries (custom event).
- **No custom analytics dashboard.** All traffic analysis, referrers, popular posts, and engagement metrics handled in GA4 console.

### 12.2 Internal Engagement Data (Postgres)

The `views` and `reactions` tables still exist for:
- Displaying view counts and reaction counts on blog cards and post pages
- Powering the "trending posts" and "related posts" algorithms
- These are **display counters**, not analytics. GA4 handles the analytics.

---

## 13. Docker & Deployment

### 13.1 Dockerfile

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Sync blog metadata to Postgres at build time
RUN npx tsx scripts/sync-posts.ts
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 8080
CMD ["node", "server.js"]
```

### 13.2 Railway Configuration

- **Service:** Web service from Dockerfile
- **Attached service:** Postgres (Railway managed)
- **Environment variables:**
  - `DATABASE_URL` — auto-injected by Railway Postgres
  - `NEXT_PUBLIC_SITE_URL=https://oculus.jlabsdigital.com`
  - `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- **Custom domain:** `oculus.jlabsdigital.com`
- **Auto-deploy:** On push to `main`
- **Health check:** `GET /api/health` → 200

---

## 14. Sample Content Reference

The Axe Capital "Market Color" HTML report (Mar 15, 2026) serves as the content archetype. Key patterns to support in blog components:

- **Stat grids** — macro data cells with label/value/sub (up/down/neutral coloring)
- **Data tables** — perp markets, prediction markets with funding chips and probability bars
- **Volume bars** — horizontal bar charts with labels and values
- **Callout boxes** — color-coded (red/green/amber/blue) with border-left accent
- **Watchlist items** — event + detail + severity tag
- **Two-column prose** — side-by-side analysis sections
- **Section numbering** — 00, 01, 02... with source tags (LIVE, Web Sources)
- **Status bar** — live ticker strip with key prices

These patterns will be built as reusable shared components that any LLM-authored blog can import.

---

## 15. Security Considerations

- **No authentication required** (internal research blog, public-facing)
- **Reaction rate limiting:** Fingerprint-based dedup prevents spam
- **View count dedup:** Same fingerprint counted once per 24h
- **SQL injection:** Drizzle ORM parameterized queries (no raw SQL from user input)
- **XSS:** Next.js auto-escapes JSX. No `dangerouslySetInnerHTML` except for JSON-LD scripts.
- **CORS:** API routes same-origin only (default Next.js behavior)
- **Environment variables:** Never committed. `.env.example` with placeholders only.

---

## 16. Success Criteria

| Criteria | Measurement |
|----------|------------|
| New blog post deployed in < 5 min | Time from git push to live URL |
| LLM can author a post with no manual intervention | Only needs to create files + push |
| Homepage loads in < 2s | Lighthouse LCP |
| Search returns results in < 200ms | API response time |
| All blog posts indexable by Google within 48h | Search Console coverage |
| Reactions work without any login | Manual test |
| Dark/Light mode preserves preference | localStorage persistence |
| RSS feed validates | W3C Feed Validation Service |

---

## 17. Out of Scope (v1)

- User authentication / login
- Comments system
- Email newsletter integration
- A/B testing
- Multi-language support
- Affiliate link management (manual for v1)
- Real-time collaborative editing
- Scheduled/draft post states (all posts are published on push)
