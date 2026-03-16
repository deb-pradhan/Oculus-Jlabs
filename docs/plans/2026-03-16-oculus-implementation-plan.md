# Oculus — Implementation Plan

**Source:** `docs/plans/2026-03-16-oculus-blog-platform-design.md`
**Project Root:** `/Users/deb/Projects/Oculus`
**Date:** 2026-03-16

---

## Phase 1: Project Bootstrap & Core Infrastructure

### Step 1.1 — Initialize Next.js + TypeScript Project
**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.example`
**Actions:**
- `npx create-next-app@latest . --typescript --app --eslint --tailwind=no --src-dir=no --import-alias="@/*"`
- Remove any default boilerplate (default page, globals, etc.)
- Configure `next.config.ts`: `output: 'standalone'`, image domains, experimental features
- Create `.env.example` with: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`
- Install core deps: `drizzle-orm pg @neondatabase/serverless recharts geist @next/third-parties`
- Install dev deps: `drizzle-kit tsx typescript @types/node @types/react`
**Verify:** `npm run dev` starts without errors, TypeScript compiles clean

### Step 1.2 — Design System: globals.css + Theme Tokens
**Files:** `app/globals.css`, `lib/theme.ts`
**Actions:**
- Write `globals.css` with full CSS variable token system (light + dark mode) per PRD Section 7.1
- Include: surface colors, ink colors, accent, signal, border tokens for both `[data-theme="light"]` and `[data-theme="dark"]`
- Base typography rules: Geist Sans headings, Geist Mono data, hierarchy via size + casing
- Utility classes: `.up`, `.dn`, `.nt` for green/red/neutral
- Reset + box-sizing + base body styles
- Responsive breakpoint media queries (640px, 1024px)
**Verify:** Tokens render correctly in both themes when `data-theme` is toggled manually

### Step 1.3 — Root Layout + Theme Provider
**Files:** `app/layout.tsx`, `components/layout/ThemeToggle.tsx`, `components/layout/ThemeProvider.tsx`
**Actions:**
- `app/layout.tsx`: import Geist fonts via `next/font/local`, wrap children in ThemeProvider, inject GA4 script
- `ThemeProvider`: reads `localStorage` for saved theme, falls back to `prefers-color-scheme`, sets `data-theme` on `<html>`, inline script in `<head>` to prevent FOUC (flash of unstyled content)
- `ThemeToggle`: pill-shaped button (999px radius per design system), toggles `data-theme`, persists to `localStorage`
**Verify:** Toggle works, no flash on reload, system preference respected on first visit

### Step 1.4 — Shared Types + Blog Meta Contract
**Files:** `lib/types.ts`
**Actions:**
- Define `BlogMeta` interface per PRD Section 4
- Define `PostWithCounts` (BlogMeta + view_count + reaction_count for API responses)
- Define `ReactionEmoji` type: `'🔥' | '🧠' | '💎' | '📉' | '🚀'`
- Define `PaginatedResponse<T>` generic: `{ data: T[], total, page, totalPages }`
**Verify:** Types compile, no `any` types

---

## Phase 2: Database Layer

### Step 2.1 — Drizzle Schema + Postgres Connection
**Files:** `lib/db/schema.ts`, `lib/db/client.ts`, `drizzle.config.ts`
**Actions:**
- `lib/db/schema.ts`: Define Drizzle tables matching PRD Section 3.1 — `posts`, `reactions`, `views`
- `posts` table: slug (PK), title, description, date, tags (text array), thumbnail, reading_time, word_count, category, view_count, reaction_count, search_vector (custom SQL type), synced_at
- `reactions` table: id (serial PK), post_slug (FK), emoji, fingerprint, created_at. Unique constraint on (post_slug, emoji, fingerprint)
- `views` table: id (serial PK), post_slug (FK), fingerprint, referrer, created_at
- `lib/db/client.ts`: Create pooled Postgres client using `pg` Pool with `DATABASE_URL`
- `drizzle.config.ts`: Point to schema, Postgres connection, migrations output dir
**Verify:** `npx drizzle-kit generate` produces migration SQL, `npx drizzle-kit push` succeeds against local Postgres

### Step 2.2 — Local Docker Postgres
**Files:** `docker-compose.yml`
**Actions:**
- Postgres 16 service on port 5432
- Volume for data persistence
- Environment: `POSTGRES_DB=oculus`, `POSTGRES_USER=oculus`, `POSTGRES_PASSWORD=oculus`
- Add to `.env.example`: `DATABASE_URL=postgresql://oculus:oculus@localhost:5432/oculus`
**Verify:** `docker compose up -d` starts Postgres, Drizzle can connect and push schema

### Step 2.3 — Search Vector Trigger (Raw SQL Migration)
**Files:** `drizzle/migrations/0001_search_trigger.sql`
**Actions:**
- Create `posts_search_trigger()` function per PRD Section 3.1
- Weighted tsvector: title (A), description (B), tags (C)
- Create trigger on INSERT or UPDATE
- Create GIN index on search_vector
**Verify:** Insert a test row into posts → search_vector auto-populated, `to_tsquery` returns results

---

## Phase 3: Blog Infrastructure

### Step 3.1 — Post Sync Script (File System → Postgres)
**Files:** `scripts/sync-posts.ts`
**Actions:**
- Scan `app/blog/*/meta.ts` using glob pattern
- Dynamic import each `meta.ts` → extract BlogMeta
- Upsert into `posts` table (ON CONFLICT slug DO UPDATE)
- Delete posts from DB that no longer exist on filesystem (cleanup orphans)
- Log summary: X posts synced, Y new, Z updated, W deleted
- Add npm script: `"sync-posts": "tsx scripts/sync-posts.ts"`
**Verify:** Create a dummy blog folder with meta.ts → run sync → verify row appears in Postgres. Delete folder → re-sync → verify row removed

### Step 3.2 — New Post Scaffold Script
**Files:** `scripts/new-post.ts`
**Actions:**
- CLI args: `--slug`, `--title`, `--category` (optional, defaults to 'macro')
- Creates folder: `app/blog/{slug}/`
- Generates: `meta.ts` (pre-filled with slug, title, today's date, empty tags)
- Generates: `page.tsx` (template with BlogLayout wrapper and placeholder sections)
- Generates: `data.ts` (empty export)
- Creates: `components/` empty directory
**Verify:** Run script → folder created with all files → `meta.ts` has correct slug and date

### Step 3.3 — Blog Layout Wrapper (BlogLayout)
**Files:** `components/layout/BlogLayout.tsx`, `components/layout/BlogLayout.module.css`
**Actions:**
- Accepts `meta: BlogMeta` + `children: React.ReactNode`
- Renders: article wrapper with semantic HTML (`<article itemscope>`)
- Renders: blog header (title, date, reading time, category badge, share buttons)
- Renders: two-column layout on desktop (ToC sidebar + content)
- Renders: children (the custom blog content)
- Renders: ReactionBar below content
- Renders: RelatedPosts section
- Renders: JSON-LD structured data script
- Tracks page view on mount (calls /api/views)
**Verify:** Wrap a placeholder page in BlogLayout → renders correctly with all sections

### Step 3.4 — Dynamic Blog Route
**Files:** `app/blog/[slug]/page.tsx`, `app/blog/[slug]/layout.tsx`
**Actions:**
- `layout.tsx`: shared blog layout that provides header with back button, metadata generation from slug
- `page.tsx`: dynamic import of the actual blog page component based on slug
- `generateMetadata()`: imports meta.ts from the blog folder, generates full SEO metadata per PRD Section 6.1
- `generateStaticParams()`: scans blog folders at build time for static generation
- Handle 404: if slug doesn't match a blog folder → `notFound()`
**Critical decision:** Each blog folder contains its OWN `page.tsx` that Next.js routes to directly via file-system routing. The `[slug]` dynamic route is NOT needed if we rely on file-system routing. However, `app/blog/layout.tsx` provides the shared wrapper for ALL blog pages.
**Verify:** Navigate to `/blog/test-post` → renders the blog page with layout wrapper, correct meta tags in HTML source

---

## Phase 4: Homepage & Navigation

### Step 4.1 — Header Component
**Files:** `components/layout/Header.tsx`, `components/layout/Header.module.css`
**Actions:**
- Jlabs Oculus logo/wordmark (left)
- SearchBar component (center, expandable on mobile)
- ThemeToggle (right)
- Sticky on scroll with subtle border-bottom
- Responsive: collapses search to icon on mobile
**Verify:** Header renders, sticky behavior works, responsive layout correct at all breakpoints

### Step 4.2 — Footer Component
**Files:** `components/layout/Footer.tsx`, `components/layout/Footer.module.css`
**Actions:**
- Brand: "Oculus by Jlabs Digital"
- Links: RSS Feed, GitHub (if public), jlabsdigital.com
- Disclaimer text
- Copyright with current year
- Design: 1px top border, mono font, muted colors per design system
**Verify:** Footer renders at bottom of all pages

### Step 4.3 — Homepage: Blog List + Grid
**Files:** `app/page.tsx`, `components/blog/BlogCard.tsx`, `components/blog/BlogCard.module.css`
**Actions:**
- `app/page.tsx`: Server component. Reads `?page`, `?category`, `?q` from searchParams. Queries Postgres for paginated posts.
- Hero section: "Oculus" title + subtitle + stats (total posts, categories)
- Category filter pills: All | Options | Funding | Onchain | Macro | Derivatives | Signals
- Blog grid: 2 columns desktop, 1 column mobile
- `BlogCard`: thumbnail, title, description (3 lines truncated), tags (pills), reading time, view count, top reaction
- Cards follow bento grid design: 1px borders, no shadows, sharp corners
**Verify:** Homepage renders with mock data, filter pills update URL, grid is responsive

### Step 4.4 — Pagination Component
**Files:** `components/blog/Pagination.tsx`, `components/blog/Pagination.module.css`
**Actions:**
- Numbered pages: `← 1 2 [3] 4 ... 12 →`
- Current page highlighted with accent color
- Ellipsis for large page counts (show first, last, and ±2 around current)
- Updates URL params (preserves existing category/search filters)
- SSR-friendly: works with links, not just JS state
**Verify:** Pagination renders with correct page numbers, navigation works, URL updates correctly

### Step 4.5 — Search Bar + Results
**Files:** `components/blog/SearchBar.tsx`, `app/search/page.tsx`
**Actions:**
- `SearchBar`: input with search icon, debounced (300ms), dropdown with top 5 results on type
- Dropdown results: title + category + date for each match
- On Enter: navigates to `/search?q=...`
- `/search/page.tsx`: full results page with same blog grid layout + pagination
- Search calls `GET /api/posts?q=...` which uses Postgres tsvector
**Verify:** Type in search → dropdown appears with results → Enter navigates to results page

---

## Phase 5: API Routes

### Step 5.1 — Posts API
**Files:** `app/api/posts/route.ts`
**Actions:**
- `GET`: accepts `page`, `limit`, `q`, `category`, `tag`, `sort` query params
- Builds Drizzle query with conditions and pagination
- If `q` provided: uses `to_tsquery` with `ts_rank` ordering
- Returns `PaginatedResponse<PostWithCounts>`
- Proper error handling, input validation, max limit guard (50)
**Verify:** Hit API with curl → returns paginated JSON. Search returns ranked results.

### Step 5.2 — Reactions API
**Files:** `app/api/reactions/route.ts`
**Actions:**
- `GET ?slug=xxx`: returns reaction counts per emoji for a post
- `POST`: accepts `{ slug, emoji, fingerprint }`. Inserts reaction (unique constraint handles dedup). Updates denormalized `reaction_count` on posts table.
- Returns updated counts after insert
- Validate emoji is in allowed set
**Verify:** POST a reaction → count increments. POST same fingerprint+emoji again → rejected by unique constraint. GET returns correct counts.

### Step 5.3 — Views API
**Files:** `app/api/views/route.ts`
**Actions:**
- `POST`: accepts `{ slug, fingerprint, referrer }`. Checks if same fingerprint viewed this slug in last 24h. If not, inserts view and increments denormalized `view_count`.
- `GET ?slug=xxx`: returns current view count
- Lightweight: no heavy computation, just insert + increment
**Verify:** POST a view → count increments. POST again within 24h → count stays same.

### Step 5.4 — RSS Feed API
**Files:** `app/api/rss/route.ts`
**Actions:**
- `GET`: queries latest 50 posts from Postgres
- Generates RSS 2.0 XML (or Atom if `?format=atom`)
- Sets `Content-Type: application/rss+xml`
- Each item: title, link, description, pubDate, categories (tags)
- Channel: title "Oculus by Jlabs Digital", description, link, lastBuildDate
**Verify:** Hit `/api/rss` → valid RSS XML. Paste into W3C Feed Validator → passes.

### Step 5.5 — Health Check + SEO Routes
**Files:** `app/api/health/route.ts`, `app/sitemap.ts`, `app/robots.ts`
**Actions:**
- `/api/health`: returns `{ status: 'ok', timestamp }`. Tests DB connection.
- `sitemap.ts`: Next.js MetadataRoute.Sitemap. Queries all posts from Postgres, generates URLs with lastmod.
- `robots.ts`: Allow all crawlers, point to sitemap URL.
**Verify:** `/api/health` returns 200. `/sitemap.xml` lists all blog URLs. `/robots.txt` correct.

---

## Phase 6: Blog Page Features

### Step 6.1 — Table of Contents
**Files:** `components/layout/TableOfContents.tsx`, `components/layout/TableOfContents.module.css`
**Actions:**
- Uses `useEffect` + `querySelectorAll('h2, h3')` to extract headings from blog content
- Builds nested list: h2 = top level, h3 = indented children
- Intersection Observer tracks which section is visible → highlights active item
- Desktop (>1024px): sticky left sidebar, 220px wide
- Mobile (<1024px): collapsible dropdown in blog header area
- Smooth scroll on click with offset for fixed header (80px)
- Auto-generates IDs for headings if not present
**Verify:** Blog with multiple h2/h3 headings → ToC renders, active highlighting works on scroll, clicking scrolls to section

### Step 6.2 — Share Buttons
**Files:** `components/blog/ShareButtons.tsx`, `components/blog/ShareButtons.module.css`
**Actions:**
- Four buttons: X (Twitter), Telegram, LinkedIn, Copy Link
- Each generates share URL with UTM params: `?utm_source={platform}&utm_medium=social`
- X: `https://twitter.com/intent/tweet?url=...&text=...`
- Telegram: `https://t.me/share/url?url=...&text=...`
- LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=...`
- Copy: `navigator.clipboard.writeText(url)` with "Copied!" toast (2s)
- Mobile: detect `navigator.share` → use native share sheet
- Desktop placement: row below blog title
- Mobile placement: sticky bottom bar (56px height, above safe area)
**Verify:** Each button opens correct share intent. Copy shows toast. Mobile uses native share API.

### Step 6.3 — Reaction Bar
**Files:** `components/blog/ReactionBar.tsx`, `components/blog/ReactionBar.module.css`, `lib/fingerprint.ts`
**Actions:**
- `lib/fingerprint.ts`: generate browser fingerprint from canvas + timezone + UA + screen resolution. Hash to string.
- Five emoji buttons: 🔥 🧠 💎 📉 🚀 with count labels
- Fetches current counts on mount (`GET /api/reactions?slug=...`)
- On click: optimistic UI update → POST to `/api/reactions` → rollback on error
- Already-reacted state: persisted in `localStorage` per slug. Shown as "filled" style.
- Animation: emoji bounces on click (CSS keyframe, 300ms)
- Rate limit UX: if already reacted on that emoji, disable button (no visual feedback needed beyond filled state)
**Verify:** Click emoji → count increments, emoji fills. Reload → filled state persists. Different emoji → can still react.

### Step 6.4 — Related Posts
**Files:** `components/blog/RelatedPosts.tsx`, `components/blog/RelatedPosts.module.css`
**Actions:**
- Accepts current post slug and tags
- Fetches 3 related posts from `/api/posts?tag=...&limit=3` (excluding current slug)
- Fallback: if < 3 results, fills with most recent posts
- Each card: compact version of BlogCard (title, date, category, reading time)
- Horizontal row on desktop, vertical stack on mobile
- Placement: between ReactionBar and Footer
**Verify:** Blog with tags → shows related posts with same tags. Blog with unique tags → shows recent posts fallback.

---

## Phase 7: Shared Blog Content Components

### Step 7.1 — StatGrid Component
**Files:** `components/content/StatGrid.tsx`, `components/content/StatGrid.module.css`
**Actions:**
- Reusable bento-grid stat cells (per Axe Capital pattern)
- Props: `cells: { label, value, sub, direction: 'up' | 'dn' | 'nt' }[]`
- Auto-fit grid: `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`
- 1px borders between cells, no gaps (design system "bento grid")
- Color-coded values based on direction
**Verify:** Render StatGrid with mixed up/dn/nt cells → correct colors, responsive grid

### Step 7.2 — DataTable Component
**Files:** `components/content/DataTable.tsx`, `components/content/DataTable.module.css`
**Actions:**
- Generic sortable data table with header row + data rows
- Props: `columns: { key, label, align }[]`, `rows: Record<string, any>[]`
- Supports custom cell renderers (for funding chips, probability bars, etc.)
- Hover highlight per row
- Monospace font for numeric data
- Responsive: horizontal scroll on mobile with sticky first column
- Accessible: `<table>` with `aria-label`, `<thead>`, `<tbody>`
**Verify:** Render perp market table from Axe Capital data → matches design

### Step 7.3 — CalloutBox Component
**Files:** `components/content/CalloutBox.tsx`, `components/content/CalloutBox.module.css`
**Actions:**
- Color variants: `default` | `red` | `green` | `amber` | `blue`
- 3px left border in variant color, tinted background
- Renders children (rich text with bold/emphasis support)
- Props: `variant`, `children`
**Verify:** All 5 variants render with correct colors

### Step 7.4 — VolumeBar Component
**Files:** `components/content/VolumeBar.tsx`, `components/content/VolumeBar.module.css`
**Actions:**
- Horizontal bar chart for volume comparisons
- Props: `bars: { label, value, displayValue, highlight?: boolean }[]`
- Auto-scales: largest value = 100% width
- Highlight flag: red color + star indicator (for outliers like HYPE)
- Mono font for values
**Verify:** Render Derive volume data → bars scale correctly, HYPE highlighted

### Step 7.5 — SectionHeader + Prose Components
**Files:** `components/content/SectionHeader.tsx`, `components/content/Prose.tsx`
**Actions:**
- `SectionHeader`: numbered section (00, 01, 02...) + title + optional source tag
- Source tag variants: plain border (Web Sources) vs filled (LIVE)
- `Prose`: styled paragraph component with max-width, proper line-height, bold/em handling
- Both follow Axe Capital typography patterns
**Verify:** Render numbered sections with source tags → matches Axe Capital design

### Step 7.6 — WatchlistItem + StatusBar Components
**Files:** `components/content/WatchlistItem.tsx`, `components/content/StatusBar.tsx`
**Actions:**
- `WatchlistItem`: event name + detail text + severity tag (red/amber/green)
- Container with 1px borders, hover highlight
- `StatusBar`: horizontal ticker strip with key=value pairs, dark background, yellow highlights
- Responsive: wraps on mobile
**Verify:** Render watchlist from Axe Capital data → correct layout and colors

---

## Phase 8: First Blog Post (Content)

### Step 8.1 — Convert Axe Capital Market Color to First Blog Post
**Files:** `app/blog/march-15-2026-market-color/page.tsx`, `app/blog/march-15-2026-market-color/meta.ts`, `app/blog/march-15-2026-market-color/data.ts`
**Actions:**
- Run scaffold: `npx tsx scripts/new-post.ts --slug march-15-2026-market-color --title "Market Color — Mar 15, 2026"`
- Convert Axe Capital HTML into React components using all shared components from Phase 7
- `meta.ts`: title, date (2026-03-15), description, tags (BTC, ETH, HYPE, macro, derivatives, funding-rates), category 'macro'
- `data.ts`: static data for perp table, stat grids, volume bars, polymarket table, watchlist
- `page.tsx`: full blog content using StatGrid, DataTable, CalloutBox, VolumeBar, SectionHeader, Prose, WatchlistItem, StatusBar
- This is the proof-of-concept blog post that validates the entire system
**Verify:** Navigate to `/blog/march-15-2026-market-color` → full blog renders with all components, ToC works, reactions work, share works, SEO meta tags present in source

---

## Phase 9: LLM SEO & Discovery

### Step 9.1 — llms.txt + ai-content-summary
**Files:** `app/llms.txt/route.ts`, modifications to BlogLayout
**Actions:**
- `/llms.txt`: API route that generates a text file listing all blog URLs with title + 1-line summary
- Add `<meta name="ai-content-summary" content="...">` to each blog page's metadata (from meta.description)
- Ensure all chart data has `<table>` fallback with `aria-label` for LLM parsing
**Verify:** `/llms.txt` returns valid text file with all blog entries. View source of blog page → meta tag present.

### Step 9.2 — JSON-LD Structured Data
**Files:** `components/layout/JsonLd.tsx` (used inside BlogLayout)
**Actions:**
- Generates Article schema per PRD Section 6.2
- Includes: headline, description, datePublished, author, publisher, mainEntityOfPage, keywords
- Injected as `<script type="application/ld+json">` in blog head
- Also add WebSite schema on homepage with SearchAction
**Verify:** Google Rich Results Test tool validates JSON-LD. No errors.

### Step 9.3 — Google Analytics 4 Integration
**Files:** modifications to `app/layout.tsx`
**Actions:**
- Add `GoogleAnalytics` component from `@next/third-parties/google`
- Custom events: reaction click, share click, search query
- Fire events from ReactionBar, ShareButtons, SearchBar components
**Verify:** Open GA4 DebugView → page views and custom events appear

---

## Phase 10: Docker & Production Readiness

### Step 10.1 — Dockerfile
**Files:** `Dockerfile`, `.dockerignore`
**Actions:**
- Multi-stage build per PRD Section 13.1
- Stage 1 (deps): `node:20-alpine`, install dependencies
- Stage 2 (builder): copy source, run `npm run build`
- Stage 3 (runner): copy standalone output, static assets, public folder
- `.dockerignore`: node_modules, .next, .git, docs, .env
- Note: sync-posts.ts runs at app startup (not build time) since DB may not be available during Docker build
**Verify:** `docker build -t oculus .` succeeds. `docker run -p 8080:8080 -e DATABASE_URL=... oculus` starts and serves pages.

### Step 10.2 — Startup Sync + Health Check
**Files:** `scripts/startup.sh` or modification to server entry
**Actions:**
- On container start: run `sync-posts.ts` to ensure Postgres is in sync with filesystem
- Then start Next.js server
- `/api/health` endpoint: checks DB connection, returns `{ status: 'ok' }`
- Custom `CMD` in Dockerfile: `node scripts/startup.js && node server.js` or a simple shell script
**Verify:** Container starts → sync runs → server available → health check passes

### Step 10.3 — Environment + Railway Config
**Files:** `.env.example`, `railway.toml` (if needed)
**Actions:**
- Document all required env vars in `.env.example`
- Railway settings: custom domain, Postgres attachment, auto-deploy on main
- Add `NEXT_PUBLIC_SITE_URL` for canonical URLs and OG tags
**Verify:** Checklist: all env vars documented, Railway deploy config ready

---

## Phase 11: Polish & Edge Cases

### Step 11.1 — 404 Page
**Files:** `app/not-found.tsx`
**Actions:**
- Custom 404 page matching design system
- "Post not found" with link back to homepage
- Styled consistently with the rest of the site

### Step 11.2 — Loading States & Skeletons
**Files:** `app/loading.tsx`, `app/blog/[slug]/loading.tsx`, `components/ui/Skeleton.tsx`
**Actions:**
- Homepage loading: skeleton grid of blog cards
- Blog page loading: skeleton layout matching two-column structure
- Skeleton component: pulsing animation, matches card/content dimensions

### Step 11.3 — Error Boundaries
**Files:** `app/error.tsx`, `app/blog/[slug]/error.tsx`
**Actions:**
- Graceful error display for failed data fetches
- "Something went wrong" with retry button
- Errors in individual blog charts shouldn't crash the whole page

### Step 11.4 — Favicon + OG Defaults
**Files:** `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`
**Actions:**
- Jlabs Oculus branding for favicon (all sizes)
- Default OG image for posts without thumbnails
- Apple touch icon

---

## Execution Order & Dependencies

```
Phase 1 (Bootstrap) ─────────────────────────────────────────▶ Phase 2 (Database)
                                                                     │
                                                                     ▼
Phase 3 (Blog Infra) ◀──────────────────────────────────────── Phase 2
     │
     ├──▶ Phase 4 (Homepage)     [depends on Phase 3]
     ├──▶ Phase 5 (API Routes)   [depends on Phase 2]
     └──▶ Phase 6 (Blog Features)[depends on Phase 3]

Phase 7 (Content Components) ───── can start after Phase 1
     │
     ▼
Phase 8 (First Blog Post) ─── depends on Phase 3 + 6 + 7

Phase 9 (SEO) ─── depends on Phase 3 + 5
Phase 10 (Docker) ─── depends on all above
Phase 11 (Polish) ─── parallel with Phase 10
```

## Parallelizable Work

These phases can be worked on simultaneously by independent agents:
- **Phase 4 + Phase 5 + Phase 6** (after Phase 3 is done)
- **Phase 7** (after Phase 1, before Phase 8)
- **Phase 9 + Phase 10 + Phase 11** (after core is working)

---

## Review Checkpoints

| After Phase | Review Focus |
|-------------|-------------|
| Phase 2 | DB schema correct, migrations run, search trigger works |
| Phase 4 | Homepage renders, pagination works, responsive layout correct |
| Phase 6 | All blog features work: ToC, share, reactions, related posts |
| Phase 8 | First blog post fully functional — the "demo moment" |
| Phase 10 | Docker builds, container runs, ready for Railway deploy |
