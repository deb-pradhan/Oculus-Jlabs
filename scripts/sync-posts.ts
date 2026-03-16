// sync-posts.ts
// Scans app/blog/{slug}/meta.ts, upserts into the posts table,
// removes orphans, and sets up the search-vector trigger.
//
// Usage:  tsx scripts/sync-posts.ts

import fs from "node:fs";
import path from "node:path";
import { db, pool } from "../lib/db/client";
import { posts } from "../lib/db/schema";
import { sql } from "drizzle-orm";
import type { BlogMeta } from "../lib/types";

const BLOG_DIR = path.resolve(__dirname, "../app/blog");

/** Discover every meta.ts sitting one level under app/blog/ */
function discoverMetaFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(BLOG_DIR, d.name, "meta.ts"))
    .filter((p) => fs.existsSync(p));
}

/** Dynamic-import a meta.ts and return its default export (BlogMeta) */
async function loadMeta(filePath: string): Promise<BlogMeta> {
  const mod = await import(filePath);
  // Support both `export default` and `export const meta`
  const meta: BlogMeta = mod.default ?? mod.meta;
  if (!meta?.slug) {
    throw new Error(`Invalid meta at ${filePath}: missing slug`);
  }
  return meta;
}

/** Search-vector trigger SQL — keeps search_vector in sync automatically */
const SEARCH_TRIGGER_SQL = `
-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop if exists then re-create trigger
DROP TRIGGER IF EXISTS trg_posts_search_vector ON posts;
CREATE TRIGGER trg_posts_search_vector
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION posts_search_vector_update();

-- Create GIN index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN (search_vector);
`;

async function main() {
  console.log("🔍 Discovering blog meta files…");
  const metaFiles = discoverMetaFiles();
  console.log(`   Found ${metaFiles.length} meta file(s)`);

  // ── Set up search trigger ──────────────────────────────────
  console.log("⚙️  Setting up search vector trigger…");
  await pool.query(SEARCH_TRIGGER_SQL);

  // ── Load all metas ─────────────────────────────────────────
  const metas: BlogMeta[] = [];
  for (const file of metaFiles) {
    try {
      const meta = await loadMeta(file);
      metas.push(meta);
      console.log(`   ✓ ${meta.slug}`);
    } catch (err) {
      console.error(`   ✗ Failed to load ${file}:`, err);
    }
  }

  // ── Upsert each post ──────────────────────────────────────
  console.log("📝 Upserting posts…");
  for (const meta of metas) {
    await db
      .insert(posts)
      .values({
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        date: meta.date,
        tags: meta.tags,
        category: meta.category,
        thumbnail: meta.thumbnail ?? null,
        readingTime: meta.readingTime ?? null,
        syncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          title: sql`excluded.title`,
          description: sql`excluded.description`,
          date: sql`excluded.date`,
          tags: sql`excluded.tags`,
          category: sql`excluded.category`,
          thumbnail: sql`excluded.thumbnail`,
          readingTime: sql`excluded.reading_time`,
          syncedAt: sql`excluded.synced_at`,
        },
      });
  }

  // ── Delete orphans ────────────────────────────────────────
  const liveSlugs = metas.map((m) => m.slug);

  if (liveSlugs.length > 0) {
    const result = await db
      .delete(posts)
      .where(sql`${posts.slug} NOT IN (${sql.join(liveSlugs.map((s) => sql`${s}`), sql`, `)})`)
      .returning({ slug: posts.slug });

    if (result.length > 0) {
      console.log(`🗑️  Removed ${result.length} orphan(s): ${result.map((r) => r.slug).join(", ")}`);
    }
  } else {
    // No live posts — delete everything
    const result = await db.delete(posts).returning({ slug: posts.slug });
    if (result.length > 0) {
      console.log(`🗑️  Removed ${result.length} orphan(s): ${result.map((r) => r.slug).join(", ")}`);
    }
  }

  console.log("✅ Sync complete");
  await pool.end();
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
