import Link from "next/link";
import type { PostWithCounts } from "@/lib/types";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  post: PostWithCounts;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.category}>{post.category}</span>
        <span className={styles.dot}>&middot;</span>
        <span className={styles.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <h3 className={styles.title}>{post.title}</h3>

      <p className={styles.description}>{post.description}</p>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.stats}>
          {post.readingTime && (
            <span className={styles.stat}>{post.readingTime}m read</span>
          )}
          {post.viewCount > 0 && (
            <span className={styles.stat}>
              {post.viewCount.toLocaleString()} views
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
