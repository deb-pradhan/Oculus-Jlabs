import Link from "next/link";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav className={styles.pagination} aria-label="Page navigation">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className={styles.arrow}>
          &larr;
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p as number)}
            className={`${styles.page} ${p === currentPage ? styles.active : ""}`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className={styles.arrow}>
          &rarr;
        </Link>
      )}
    </nav>
  );
}

function getPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}
