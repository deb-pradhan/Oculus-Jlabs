import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { posts, reactions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { REACTION_EMOJIS } from "@/lib/types";
import type { ReactionEmoji } from "@/lib/types";

const VALID_EMOJIS = new Set<string>(REACTION_EMOJIS.map((r) => r.emoji));

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required query param: slug" },
        { status: 400 }
      );
    }

    const counts = await getReactionCounts(slug);
    return NextResponse.json(counts);
  } catch (error) {
    console.error("GET /api/reactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, emoji, fingerprint } = body as {
      slug?: string;
      emoji?: string;
      fingerprint?: string;
    };

    if (!slug || !emoji || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields: slug, emoji, fingerprint" },
        { status: 400 }
      );
    }

    if (!VALID_EMOJIS.has(emoji)) {
      return NextResponse.json(
        { error: `Invalid emoji. Must be one of: ${[...VALID_EMOJIS].join(", ")}` },
        { status: 400 }
      );
    }

    // Insert reaction — unique constraint handles dedup
    try {
      await db.insert(reactions).values({
        postSlug: slug,
        emoji,
        fingerprint,
      });

      // Update denormalized count
      await db
        .update(posts)
        .set({
          reactionCount: sql`(SELECT COUNT(*) FROM reactions WHERE post_slug = ${slug})`,
        })
        .where(eq(posts.slug, slug));
    } catch (err: unknown) {
      // Unique constraint violation — user already reacted with this emoji
      const pgErr = err as { code?: string };
      if (pgErr.code === "23505") {
        // Already reacted, just return current counts
      } else {
        throw err;
      }
    }

    const counts = await getReactionCounts(slug);
    return NextResponse.json(counts);
  } catch (error) {
    console.error("POST /api/reactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getReactionCounts(slug: string): Promise<Record<string, number>> {
  const rows = await db
    .select({
      emoji: reactions.emoji,
      count: sql<number>`count(*)`,
    })
    .from(reactions)
    .where(eq(reactions.postSlug, slug))
    .groupBy(reactions.emoji);

  const counts: Record<string, number> = {};
  for (const r of REACTION_EMOJIS) {
    counts[r.emoji] = 0;
  }
  for (const row of rows) {
    counts[row.emoji] = Number(row.count);
  }
  return counts;
}
