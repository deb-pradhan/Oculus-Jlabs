import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { sql, desc, asc, eq, ilike, arrayContains } from "drizzle-orm";
import type { PaginatedResponse, PostWithCounts, BlogCategory } from "@/lib/types";
import { BLOG_CATEGORIES } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse & validate params
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10) || 12));
    const q = searchParams.get("q")?.trim() || null;
    const category = searchParams.get("category")?.trim() || null;
    const tag = searchParams.get("tag")?.trim() || null;
    const sort = searchParams.get("sort") ?? "date";

    if (category && !BLOG_CATEGORIES.includes(category as BlogCategory)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${BLOG_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!["date", "views", "reactions"].includes(sort)) {
      return NextResponse.json(
        { error: "Invalid sort. Must be one of: date, views, reactions" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Full-text search path — use raw SQL for tsquery
    if (q) {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let paramIdx = 1;

      // Full-text search condition
      conditions.push(`search_vector @@ plainto_tsquery('english', $${paramIdx})`);
      params.push(q);
      paramIdx++;

      if (category) {
        conditions.push(`category = $${paramIdx}`);
        params.push(category);
        paramIdx++;
      }

      if (tag) {
        conditions.push(`$${paramIdx} = ANY(tags)`);
        params.push(tag);
        paramIdx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      let orderClause: string;
      switch (sort) {
        case "views":
          orderClause = "ORDER BY view_count DESC, date DESC";
          break;
        case "reactions":
          orderClause = "ORDER BY reaction_count DESC, date DESC";
          break;
        default:
          // For search with date sort, use ts_rank as primary sort
          orderClause = `ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC, date DESC`;
          break;
      }

      const countQuery = `SELECT COUNT(*) as count FROM posts ${whereClause}`;
      const dataQuery = `SELECT slug, title, description, date, tags, category, thumbnail, reading_time, word_count, view_count, reaction_count FROM posts ${whereClause} ${orderClause} LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;

      const allParams = [...params, limit, offset];

      const countRes = await db.execute(
        buildParameterizedSql(countQuery, params)
      );
      const dataRes = await db.execute(
        buildParameterizedSql(dataQuery, allParams)
      );

      const total = parseInt(String((countRes.rows[0] as Record<string, unknown>)?.count ?? "0"), 10);
      const rows = dataRes.rows as Record<string, unknown>[];

      const data: PostWithCounts[] = rows.map(mapRowToPostWithCounts);

      return NextResponse.json({
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      } satisfies PaginatedResponse<PostWithCounts>);
    }

    // Non-search path — use Drizzle query builder
    const conditions = [];

    if (category) {
      conditions.push(eq(posts.category, category));
    }

    if (tag) {
      conditions.push(arrayContains(posts.tags, [tag]));
    }

    const where = conditions.length > 0
      ? conditions.length === 1
        ? conditions[0]
        : sql`${sql.join(conditions, sql` AND `)}`
      : undefined;

    // Count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(where);

    const total = Number(countResult[0].count);

    // Determine ordering
    let orderBy;
    switch (sort) {
      case "views":
        orderBy = [desc(posts.viewCount), desc(posts.date)];
        break;
      case "reactions":
        orderBy = [desc(posts.reactionCount), desc(posts.date)];
        break;
      default:
        orderBy = [desc(posts.date)];
    }

    const rows = await db
      .select({
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        date: posts.date,
        tags: posts.tags,
        category: posts.category,
        thumbnail: posts.thumbnail,
        readingTime: posts.readingTime,
        viewCount: posts.viewCount,
        reactionCount: posts.reactionCount,
      })
      .from(posts)
      .where(where)
      .orderBy(...orderBy)
      .limit(limit)
      .offset(offset);

    const data: PostWithCounts[] = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description,
      date: row.date,
      tags: row.tags,
      category: (row.category ?? "macro") as PostWithCounts["category"],
      thumbnail: row.thumbnail ?? undefined,
      readingTime: row.readingTime ?? undefined,
      viewCount: row.viewCount,
      reactionCount: row.reactionCount,
    }));

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    } satisfies PaginatedResponse<PostWithCounts>);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Map a raw SQL row to PostWithCounts */
function mapRowToPostWithCounts(row: Record<string, unknown>): PostWithCounts {
  return {
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    date: String(row.date),
    tags: (row.tags as string[]) ?? [],
    category: (String(row.category) || "macro") as PostWithCounts["category"],
    thumbnail: row.thumbnail ? String(row.thumbnail) : undefined,
    readingTime: row.reading_time ? Number(row.reading_time) : undefined,
    viewCount: Number(row.view_count ?? 0),
    reactionCount: Number(row.reaction_count ?? 0),
  };
}

/** Build a parameterized SQL query using drizzle's sql template */
function buildParameterizedSql(query: string, params: unknown[]) {
  // Replace $1, $2, ... with drizzle sql placeholders
  const parts = query.split(/\$\d+/);
  const chunks: ReturnType<typeof sql>[] = [];

  // Build using sql template tag
  if (params.length === 0) {
    return sql.raw(query);
  }

  // Use sql.join approach: interleave raw SQL parts with param values
  const sqlParts: (ReturnType<typeof sql>)[] = [];
  for (let i = 0; i < parts.length; i++) {
    sqlParts.push(sql.raw(parts[i]));
    if (i < params.length) {
      sqlParts.push(sql`${params[i]}`);
    }
  }

  return sql.join(sqlParts, sql.raw(""));
}
