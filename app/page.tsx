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

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroAccent} />
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <span className={styles.heroPulse} />
              Jlabs Digital Research
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleAccent}>Oculus</span>
            </h1>
            <p className={styles.heroSub}>
              Quantitative crypto market research, derivatives analysis, and
              on-chain intelligence — generated daily by AI, verified by quants.
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{total}</span>
                <span className={styles.heroStatLabel}>Reports</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>Daily</span>
                <span className={styles.heroStatLabel}>Frequency</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{BLOG_CATEGORIES.length}</span>
                <span className={styles.heroStatLabel}>Categories</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search + Filters ────────────────────────────────── */}
        <section className={styles.toolbar}>
          <Link href="/search" className={styles.searchBar}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 10l4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className={styles.searchText}>Search reports...</span>
            <span className={styles.searchShortcut}>/</span>
          </Link>
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
        </section>

        {/* ── Post Feed ───────────────────────────────────────── */}
        <section className={styles.feed}>
          {blogPosts.length > 0 ? (
            blogPosts.map((post, i) => {
              const isLatest = i === 0 && page === 1 && !category;
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`${styles.post} ${isLatest ? styles.postLatest : ""}`}
                >
                  {isLatest && (
                    <div className={styles.postBadge}>
                      <span className={styles.postBadgeDot} />
                      Latest
                    </div>
                  )}
                  <div className={styles.postHead}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span className={styles.postDate}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {post.readingTime && (
                      <span className={styles.postTime}>
                        {post.readingTime}m read
                      </span>
                    )}
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postDesc}>{post.description}</p>
                  <div className={styles.postFoot}>
                    <div className={styles.postTags}>
                      {post.tags.slice(0, isLatest ? 8 : 4).map((tag) => (
                        <span key={tag} className={styles.postTag}>{tag}</span>
                      ))}
                    </div>
                    <span className={styles.postArrow}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>&#9678;</div>
              <p className={styles.emptyTitle}>No reports found</p>
              <p className={styles.emptySub}>
                {category
                  ? `No reports in "${category}" yet. Try another category.`
                  : "Research reports are published daily. Check back soon."}
              </p>
            </div>
          )}
        </section>

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
