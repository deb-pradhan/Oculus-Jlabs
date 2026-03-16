"use client";

import { useEffect, useState } from "react";
import type { PostWithCounts } from "@/lib/types";
import styles from "./RelatedPosts.module.css";

interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RelatedPosts({ currentSlug, tags }: RelatedPostsProps) {
  const [posts, setPosts] = useState<PostWithCounts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const tag = tags[0] ?? "";
        const res = await fetch(
          `/api/posts?tag=${encodeURIComponent(tag)}&limit=4`
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const json = (await res.json()) as { data: PostWithCounts[] };
        const filtered = (json.data ?? [])
          .filter((p) => p.slug !== currentSlug)
          .slice(0, 3);

        setPosts(filtered);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentSlug, tags]);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>Related Posts</h2>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Related Posts</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={styles.card}
          >
            <span className={styles.category}>{post.category}</span>
            <h3 className={styles.title}>{post.title}</h3>
            <div className={styles.meta}>
              <span>{formatDate(post.date)}</span>
              {post.readingTime && (
                <>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
