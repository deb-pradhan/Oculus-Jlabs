"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";
import type { PostWithCounts, PaginatedResponse } from "@/lib/types";
import styles from "./search.module.css";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<PostWithCounts[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (searchQuery: string, p: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?q=${encodeURIComponent(searchQuery)}&page=${p}&limit=12`
      );
      if (res.ok) {
        const data: PaginatedResponse<PostWithCounts> = await res.json();
        setResults(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(q, page);
  }, [q, page, fetchResults]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>

        {q && (
          <p className={styles.resultCount}>
            {loading
              ? "Searching..."
              : `${total} result${total !== 1 ? "s" : ""} for "${q}"`}
          </p>
        )}

        {results.length > 0 && (
          <div className={styles.grid}>
            {results.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/search"
            searchParams={{ q }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
