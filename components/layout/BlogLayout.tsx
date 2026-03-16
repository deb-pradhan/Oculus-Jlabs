"use client";

import { useEffect } from "react";
import type { BlogMeta } from "@/lib/types";
import { TableOfContents } from "./TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ReactionBar } from "@/components/blog/ReactionBar";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { JsonLd } from "./JsonLd";
import { generateFingerprint } from "@/lib/fingerprint";
import styles from "./BlogLayout.module.css";

interface BlogLayoutProps {
  meta: BlogMeta;
  children: React.ReactNode;
}

export default function BlogLayout({ meta, children }: BlogLayoutProps) {
  const formattedDate = new Date(meta.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Track page view
  useEffect(() => {
    async function trackView() {
      try {
        const fingerprint = generateFingerprint();
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: meta.slug,
            fingerprint,
            referrer: document.referrer || undefined,
          }),
        });
      } catch {
        // silently fail
      }
    }
    trackView();
  }, [meta.slug]);

  return (
    <article
      className={styles.article}
      itemScope
      itemType="https://schema.org/Article"
    >
      <JsonLd meta={meta} />
      {/* Blog Header */}
      <header className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.categoryBadge}>{meta.category}</span>
          {meta.readingTime && (
            <span className={styles.readingTime}>
              {meta.readingTime} min read
            </span>
          )}
        </div>

        <h1 className={styles.title} itemProp="headline">
          {meta.title}
        </h1>

        <time className={styles.date} dateTime={meta.date} itemProp="datePublished">
          {formattedDate}
        </time>

        {meta.tags.length > 0 && (
          <div className={styles.tags}>
            {meta.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <ShareButtons title={meta.title} slug={meta.slug} />
      </header>

      {/* Two-Column Body */}
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <TableOfContents />
        </aside>

        <div className={styles.content} itemProp="articleBody">
          {children}
        </div>
      </div>

      {/* Footer: Reactions + Related */}
      <footer className={styles.footer}>
        <ReactionBar slug={meta.slug} />
        <RelatedPosts currentSlug={meta.slug} tags={meta.tags} />
      </footer>
    </article>
  );
}
