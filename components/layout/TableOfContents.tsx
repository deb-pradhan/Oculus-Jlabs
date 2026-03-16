"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./TableOfContents.module.css";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const extracted: Heading[] = [];

    elements.forEach((el) => {
      const text = el.textContent ?? "";
      if (!text.trim()) return;

      let id = el.id;
      if (!id) {
        id = slugify(text);
        el.id = id;
      }

      extracted.push({
        id,
        text: text.trim(),
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(extracted);

    if (extracted.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => {
      if (el.id) {
        observerRef.current?.observe(el);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;

      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setMobileOpen(false);
    },
    []
  );

  if (headings.length === 0) return null;

  const navContent = (
    <nav aria-label="Table of contents">
      <ul className={styles.list}>
        {headings.map((h) => (
          <li
            key={h.id}
            className={`${styles.item} ${h.level === 3 ? styles.indent : ""} ${
              activeId === h.id ? styles.active : ""
            }`}
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className={styles.link}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={styles.sidebar}>
        <p className={styles.title}>On this page</p>
        {navContent}
      </aside>

      {/* Mobile dropdown */}
      <div className={styles.mobileWrapper}>
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          On this page
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={`${styles.chevron} ${mobileOpen ? styles.chevronOpen : ""}`}
          >
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {mobileOpen && (
          <div className={styles.mobileDropdown}>{navContent}</div>
        )}
      </div>
    </>
  );
}
