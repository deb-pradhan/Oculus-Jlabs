import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { posts, views } from "@/lib/db/schema";
import { eq, and, sql, gt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Missing required query param: slug" },
        { status: 400 }
      );
    }

    const result = await db
      .select({ viewCount: posts.viewCount })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ slug, viewCount: result[0].viewCount });
  } catch (error) {
    console.error("GET /api/views error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, fingerprint, referrer } = body as {
      slug?: string;
      fingerprint?: string;
      referrer?: string;
    };

    if (!slug || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields: slug, fingerprint" },
        { status: 400 }
      );
    }

    // Check if same fingerprint viewed this slug in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existing = await db
      .select({ id: views.id })
      .from(views)
      .where(
        and(
          eq(views.postSlug, slug),
          eq(views.fingerprint, fingerprint),
          gt(views.createdAt, twentyFourHoursAgo)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      // Insert new view
      await db.insert(views).values({
        postSlug: slug,
        fingerprint,
        referrer: referrer ?? null,
      });

      // Increment denormalized view count
      await db
        .update(posts)
        .set({
          viewCount: sql`${posts.viewCount} + 1`,
        })
        .where(eq(posts.slug, slug));
    }

    // Return current count
    const result = await db
      .select({ viewCount: posts.viewCount })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    const viewCount = result.length > 0 ? result[0].viewCount : 0;

    return NextResponse.json({ slug, viewCount });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
