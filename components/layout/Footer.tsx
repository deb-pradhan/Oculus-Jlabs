"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import styles from "./Footer.module.css";

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/logo-icon.png"
            alt=""
            width={20}
            height={20}
            className={styles.brandIcon}
          />
          <Image
            src={theme === "dark" ? "/logo-light.png" : "/logo-dark.png"}
            alt="Jlabs Digital"
            width={100}
            height={20}
            className={styles.brandWordmark}
          />
        </div>

        <nav className={styles.links}>
          <Link href="/api/rss">RSS</Link>
          <Link href="https://jlabsdigital.com" target="_blank" rel="noopener noreferrer">
            jlabsdigital.com
          </Link>
        </nav>

        <div className={styles.legal}>
          <span>&copy; {new Date().getFullYear()} Jlabs Digital. Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}
