import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oculus.jlabs.digital";
const CHANNEL_TITLE = "Oculus by Jlabs Digital";
const CHANNEL_DESCRIPTION = "Crypto derivatives research, options analysis, and on-chain insights.";

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format");

    const rows = await db
      .select({
        slug: posts.slug,
        title: posts.title,
        description: posts.description,
        date: posts.date,
        category: posts.category,
        tags: posts.tags,
      })
      .from(posts)
      .orderBy(desc(posts.date))
      .limit(50);

    if (format === "atom") {
      return buildAtomFeed(rows);
    }

    return buildRssFeed(rows);
  } catch (error) {
    console.error("GET /api/rss error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface FeedRow {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string | null;
  tags: string[];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRssFeed(rows: FeedRow[]): NextResponse {
  const items = rows
    .map((row) => {
      const link = `${SITE_URL}/blog/${row.slug}`;
      const pubDate = new Date(row.date).toUTCString();
      const categories = row.category
        ? `<category>${escapeXml(row.category)}</category>`
        : "";

      return `    <item>
      <title>${escapeXml(row.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(row.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CHANNEL_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function buildAtomFeed(rows: FeedRow[]): NextResponse {
  const entries = rows
    .map((row) => {
      const link = `${SITE_URL}/blog/${row.slug}`;
      const updated = new Date(row.date).toISOString();

      return `  <entry>
    <title>${escapeXml(row.title)}</title>
    <link href="${link}" rel="alternate"/>
    <id>${link}</id>
    <updated>${updated}</updated>
    <summary>${escapeXml(row.description)}</summary>
    ${row.category ? `<category term="${escapeXml(row.category)}"/>` : ""}
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(CHANNEL_TITLE)}</title>
  <link href="${SITE_URL}" rel="alternate"/>
  <link href="${SITE_URL}/api/rss?format=atom" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>${escapeXml(CHANNEL_DESCRIPTION)}</subtitle>
${entries}
</feed>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
