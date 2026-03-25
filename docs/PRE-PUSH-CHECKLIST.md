# Oculus Pre-Push Checklist

> Run through this checklist before every push to `main`. Railway auto-deploys on push — there is no staging environment.

---

## 1. Content & Data Accuracy

- [ ] All price data in blog posts is current and sourced correctly
- [ ] Options data is attributed to **Derive** (not Hyblock)
- [ ] Perp / funding / order flow data is attributed to **Hyblock** (not Derive)
- [ ] Prediction market data is attributed to **Polymarket**
- [ ] Macro data is attributed to **TradingView**
- [ ] Calculations (funding rates, % changes, OI deltas) are arithmetically correct
- [ ] Dates in `meta.ts` match the actual report date (YYYY-MM-DD format)
- [ ] Slug in `meta.ts` matches the folder name exactly
- [ ] Category is one of: `options`, `funding`, `onchain`, `macro`, `derivatives`, `signals`
- [ ] Tags array is not empty
- [ ] `readingTime` is set and reasonable for the content length
- [ ] Footer disclaimer lists all data sources used in the report

---

## 2. Build & TypeScript

```bash
npm run build
```

- [ ] Build completes with zero errors
- [ ] No TypeScript type errors
- [ ] No unused imports or variables flagged
- [ ] All new blog pages are listed in the build output as static routes
- [ ] `force-dynamic` routes (`/sitemap.xml`, `/llms.txt`) are marked as `f` (dynamic)

---

## 3. Local Smoke Test

```bash
npm run dev
```

- [ ] Homepage loads — posts appear in feed
- [ ] New blog post is visible in the feed
- [ ] Blog post page renders fully (all sections, tables, charts)
- [ ] Theme toggle works (light <-> dark)
- [ ] Light theme: white background, dark text, visible logo
- [ ] Dark theme: dark background, light text, visible logo
- [ ] Search bar links to `/search` and search works
- [ ] Category filter pills work on homepage

---

## 4. Share & Social

- [ ] Share buttons render on blog pages (X, Telegram, Reddit, LinkedIn, Copy)
- [ ] Click each share button — verify the URL and text are correct
- [ ] Copy button copies the correct URL with UTM params
- [ ] OG image generates: visit `/api/og?title=YOUR_TITLE&category=signals&date=2026-03-26`
- [ ] OG image is 1200x630, title is readable, branding is correct
- [ ] Blog page `<head>` has correct `og:title`, `og:description`, `og:image` meta tags
- [ ] Twitter card meta tags are present (`twitter:card`, `twitter:title`, `twitter:image`)

**Test sharing preview:**
- Paste blog URL into Telegram — preview should show title + OG image
- Paste blog URL into X compose — card should render
- Paste blog URL into Reddit submit — title and thumbnail should appear

---

## 5. API Routes

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/rss
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/llms.txt
```

- [ ] `/api/health` returns `200 OK`
- [ ] `/api/posts` returns JSON with all blog posts
- [ ] `/api/rss` returns valid XML (no empty `<channel>`)
- [ ] `/sitemap.xml` lists all blog post URLs
- [ ] `/llms.txt` lists all posts in plain text
- [ ] `/api/og` returns a PNG image (check `Content-Type: image/png`)
- [ ] No CORS errors in browser console on any route
- [ ] No 500 errors on any API route

---

## 6. Database Sync

- [ ] Run `npx tsx scripts/sync-posts.ts` — all posts discovered and upserted
- [ ] Post count in DB matches number of `app/blog/*/meta.ts` files
- [ ] No orphaned posts in DB (deleted posts are removed)
- [ ] Search vector trigger is active (full-text search returns results)
- [ ] Reactions and views tables are intact (no accidental cascade deletes)

---

## 7. Environment & Secrets

- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] No hardcoded passwords, API keys, or database URLs in code
- [ ] `DATABASE_URL` is set in Railway environment
- [ ] `NEXT_PUBLIC_SITE_URL` is set to the production domain
- [ ] `NEXT_PUBLIC_GA_ID` is set if analytics are desired

---

## 8. Domain Consistency

All URL references must use the same domain. Grep for inconsistencies:

```bash
grep -r "oculus.jlabs" --include="*.ts" --include="*.tsx" .
```

- [ ] `NEXT_PUBLIC_SITE_URL` env var matches production domain
- [ ] `app/layout.tsx` metadataBase matches production domain
- [ ] `next.config.ts` remotePatterns hostname matches production domain
- [ ] OG image footer text matches production domain
- [ ] RSS feed `<link>` tags use production domain
- [ ] Sitemap URLs use production domain

---

## 9. Docker & Deployment

- [ ] `Dockerfile` builds successfully: `docker build -t oculus .`
- [ ] `output: "standalone"` is set in `next.config.ts`
- [ ] `scripts/startup.sh` exists and is executable
- [ ] `startup.sh` runs `sync-posts.ts` before starting the server
- [ ] Railway service is connected to `deb-pradhan/Oculus-Jlabs` repo
- [ ] Railway has the correct environment variables set

---

## 10. Responsiveness & Accessibility

- [ ] Blog header: title, tags, and share buttons don't overlap on mobile
- [ ] Data tables scroll horizontally on small screens
- [ ] Header navbar is usable on mobile (logo + search + toggle fit)
- [ ] Filter pills wrap correctly on narrow screens
- [ ] Font sizes are readable on mobile (minimum 14px for body text)
- [ ] All images have `alt` text
- [ ] Color contrast passes WCAG AA (use browser dev tools audit)

---

## 11. Performance

- [ ] No large unoptimized images in `/public` (use Next.js `<Image>`)
- [ ] Static blog pages are pre-rendered at build time (listed as `o` in build output)
- [ ] No unnecessary `"use client"` directives on pages that could be server components
- [ ] Database queries use indexes (check `idx_posts_date`, `idx_posts_category`, `idx_posts_search`)

---

## 12. Git Hygiene

```bash
git status
git diff --stat
git log --oneline -3
```

- [ ] Only intended files are staged (no `.env.local`, no `node_modules`)
- [ ] Commit message is descriptive (what changed and why)
- [ ] No merge conflicts
- [ ] Branch is up to date with `origin/main` (`git pull` first)

---

## Quick Commands

```bash
# Full pre-push check
npm run build && npm run dev &
sleep 3
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/posts | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{len(d[\"posts\"])} posts')"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/og?title=Test
curl -s http://localhost:3000/sitemap.xml | head -5

# Check domain consistency
grep -rn "oculus.jlabs" --include="*.ts" --include="*.tsx" app/ components/ lib/

# Check data source attribution
grep -rn "sourceTag" --include="*.tsx" app/blog/
```

---

*Last updated: March 26, 2026*
