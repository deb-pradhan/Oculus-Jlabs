import {
  pgTable,
  text,
  date,
  integer,
  serial,
  timestamp,
  uniqueIndex,
  index,
  customType,
} from "drizzle-orm/pg-core";

/** Custom tsvector type for Postgres full-text search */
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

// ─── POSTS ───────────────────────────────────────────────────
// Synced from file-system meta.ts at build/startup time

export const posts = pgTable(
  "posts",
  {
    slug: text("slug").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    date: date("date").notNull(),
    tags: text("tags").array().notNull().default([]),
    thumbnail: text("thumbnail"),
    readingTime: integer("reading_time"),
    wordCount: integer("word_count"),
    category: text("category"),
    searchVector: tsvector("search_vector"),
    syncedAt: timestamp("synced_at", { withTimezone: true }).defaultNow(),

    // Denormalized counters
    viewCount: integer("view_count").notNull().default(0),
    reactionCount: integer("reaction_count").notNull().default(0),
  },
  (table) => [
    index("idx_posts_date").on(table.date),
    index("idx_posts_category").on(table.category),
  ]
);

// ─── REACTIONS ───────────────────────────────────────────────
// Anonymous reactions (no login required)

export const reactions = pgTable(
  "reactions",
  {
    id: serial("id").primaryKey(),
    postSlug: text("post_slug")
      .notNull()
      .references(() => posts.slug, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    fingerprint: text("fingerprint"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_reactions_slug").on(table.postSlug),
    uniqueIndex("idx_reactions_unique").on(
      table.postSlug,
      table.emoji,
      table.fingerprint
    ),
  ]
);

// ─── VIEWS ───────────────────────────────────────────────────
// Page view tracking

export const views = pgTable(
  "views",
  {
    id: serial("id").primaryKey(),
    postSlug: text("post_slug")
      .notNull()
      .references(() => posts.slug, { onDelete: "cascade" }),
    fingerprint: text("fingerprint"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_views_slug").on(table.postSlug),
    index("idx_views_created").on(table.createdAt),
  ]
);
