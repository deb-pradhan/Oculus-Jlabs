"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>&#9678;</span>
          <span className={styles.logoText}>OCULUS</span>
          <span className={styles.logoDivider} />
          <span className={styles.logoSub}>JLABS</span>
        </Link>

        <div className={styles.actions}>
          <Link href="/search" className={styles.searchTrigger} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
