import type { MetadataRoute } from "next";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oculus.jlabs.digital";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await db
    .select({
      slug: posts.slug,
      date: posts.date,
    })
    .from(posts)
    .orderBy(desc(posts.date));

  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postEntries,
  ];
}
