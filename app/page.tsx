import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

  const featured = page === 1 && !category ? blogPosts[0] : null;
  const feedPosts = featured ? blogPosts.slice(1) : blogPosts;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroLabel}>
                <span className={styles.heroPulse} />
                Live research
              </div>
              <h1 className={styles.heroTitle}>
                Crypto intelligence<br />for serious traders.
              </h1>
              <p className={styles.heroSub}>
                Derivatives, prediction markets, and on-chain signals —
                synthesized daily by Jlabs Digital.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{total}</span>
                <span className={styles.heroStatLabel}>Reports</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>Daily</span>
                <span className={styles.heroStatLabel}>Frequency</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{BLOG_CATEGORIES.length}</span>
                <span className={styles.heroStatLabel}>Categories</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search ─────────────────────────────────────────── */}
        <Link href="/search" className={styles.searchBar}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10l4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className={styles.searchText}>Search reports...</span>
          <kbd className={styles.searchKbd}>/</kbd>
        </Link>

        {/* ── Filters ────────────────────────────────────────── */}
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

        {/* ── Featured Post ──────────────────────────────────── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredAccent} />
            <div className={styles.featuredBadge}>
              <span className={styles.featuredBadgeDot} />
              Latest report
            </div>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredDesc}>{featured.description}</p>
            <div className={styles.featuredMeta}>
              <span className={styles.featuredCategory}>{featured.category}</span>
              <span className={styles.featuredDot} />
              <span>{formatDate(featured.date)}</span>
              {featured.readingTime && (
                <>
                  <span className={styles.featuredDot} />
                  <span>{featured.readingTime} min read</span>
                </>
              )}
              <span className={styles.featuredArrow}>
                Read
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        )}

        {/* ── Feed ───────────────────────────────────────────── */}
        {feedPosts.length > 0 && (
          <section className={styles.feed}>
            {feedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.post}
              >
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span className={styles.postDot} />
                    <span>{formatDate(post.date)}</span>
                    {post.readingTime && (
                      <>
                        <span className={styles.postDot} />
                        <span>{post.readingTime}m</span>
                      </>
                    )}
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postDesc}>{post.description}</p>
                </div>
                <span className={styles.postArrow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </section>
        )}

        {blogPosts.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No reports found</p>
            <p className={styles.emptySub}>
              {category
                ? `No reports in "${category}" yet. Try another category.`
                : "Research reports are published daily. Check back soon."}
            </p>
          </div>
        )}

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
