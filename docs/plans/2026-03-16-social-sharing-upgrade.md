# Social Sharing Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every blog post shareable with rich previews on X, Telegram, Reddit, and LinkedIn.

**Architecture:** Three layers — (1) dynamic OG image generation via Next.js ImageResponse, (2) per-post `generateMetadata` for rich social cards, (3) upgraded ShareButtons with all platforms + footer placement.

**Tech Stack:** Next.js ImageResponse (Satori), CSS Modules, Next.js Metadata API

---

### Task 1: Dynamic OG Image API Route

**Files:**
- Create: `app/api/og/route.tsx`

Generates branded 1200×630 OG images on-the-fly using `ImageResponse` from `next/og`. Accepts query params: `title`, `category`, `date`, `readingTime`. Dark themed card with OCULUS branding.

### Task 2: Per-Post Server Wrapper + generateMetadata

**Files:**
- Rename: `app/blog/march-15-2026-market-color/page.tsx` → `content.tsx`
- Create: `app/blog/march-15-2026-market-color/page.tsx` (server component)
- Rename: `app/blog/march-16-2026-market-color/page.tsx` → `content.tsx`
- Create: `app/blog/march-16-2026-market-color/page.tsx` (server component)

Each new `page.tsx` is a server component that imports `meta.ts`, exports `generateMetadata()` with full OG/Twitter card tags pointing to the OG image route, and renders the client `content.tsx`.

### Task 3: Upgraded ShareButtons Component

**Files:**
- Modify: `components/blog/ShareButtons.tsx`
- Modify: `components/blog/ShareButtons.module.css`

Replace LinkedIn-only with full set: X, Telegram, Reddit, LinkedIn, Copy. Add description to share text for X/Telegram. Platform-colored hover states. Better visual design.

### Task 4: Add Share Buttons to Blog Footer

**Files:**
- Modify: `components/layout/BlogLayout.tsx`
- Modify: `components/layout/BlogLayout.module.css`

Add `<ShareButtons>` in the footer section so readers finishing an article can share immediately.

### Task 5: Pass Description to ShareButtons

**Files:**
- Modify: `components/blog/ShareButtons.tsx` (add `description` prop)
- Modify: `components/layout/BlogLayout.tsx` (pass `meta.description`)
