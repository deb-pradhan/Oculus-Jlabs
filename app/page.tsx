import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { desc, eq, sql, asc } from "drizzle-orm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";
import type { PostWithCounts, BlogCategory } from "@/lib/types";
import { BLOG_CATEGORIES } from "@/lib/types";
import Link from "next/link";
import styles from "./home.module.css";

const PAGE_SIZE = 12;

interface HomePageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const category = params.category as BlogCategory | undefined;

  // Build query
  const conditions = [];
  if (category && BLOG_CATEGORIES.includes(category)) {
    conditions.push(eq(posts.category, category));
  }

  const where = conditions.length > 0 ? conditions[0] : undefined;

  const [postRows, countResult] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.date))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(where),
  ]);

  const total = countResult[0]?.count || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const blogPosts: PostWithCounts[] = postRows.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags || [],
    category: (p.category || "macro") as BlogCategory,
    thumbnail: p.thumbnail || undefined,
    readingTime: p.readingTime || undefined,
    viewCount: p.viewCount,
    reactionCount: p.reactionCount,
  }));

  const searchParamsObj: Record<string, string> = {};
  if (category) searchParamsObj.category = category;

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Oculus</h1>
          <p className={styles.heroSub}>
            Quantitative crypto market research &amp; derivatives intelligence
          </p>
          <div className={styles.heroStats}>
            <span>{total} reports</span>
            <span className={styles.heroDot}>&middot;</span>
            <span>Updated daily</span>
            <span className={styles.heroDot}>&middot;</span>
            <span>By Jlabs Digital</span>
          </div>
        </section>

        {/* Category Filters */}
        <nav className={styles.filters}>
          <Link
            href="/"
            className={`${styles.pill} ${!category ? styles.pillActive : ""}`}
          >
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className={`${styles.pill} ${category === cat ? styles.pillActive : ""}`}
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* Blog Grid */}
        {blogPosts.length > 0 ? (
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No research reports yet. Check back soon.</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchParams={searchParamsObj}
        />
      </main>
      <Footer />
    </>
  );
}
