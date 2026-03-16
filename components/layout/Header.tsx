"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo-icon.png"
            alt=""
            width={28}
            height={28}
            className={styles.logoIcon}
          />
          <Image
            src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"}
            alt="Jlabs Digital"
            width={140}
            height={28}
            className={styles.logoWordmark}
            priority
          />
          <span className={styles.logoDivider} />
          <span className={styles.logoSub}>OCULUS</span>
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
