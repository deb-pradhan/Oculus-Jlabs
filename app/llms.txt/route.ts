import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oculus.jlabs.digital";

export async function GET() {
  const allPosts = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
    })
    .from(posts)
    .orderBy(desc(posts.date));

  const lines = [
    `# Oculus by Jlabs Digital`,
    `> Quantitative crypto market research, derivatives analysis, and on-chain intelligence.`,
    ``,
    ...allPosts.map(
      (p) => `${SITE_URL}/blog/${p.slug} | ${p.title} | ${p.description}`
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
