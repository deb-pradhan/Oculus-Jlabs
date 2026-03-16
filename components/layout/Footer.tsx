import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>Oculus</span>
          <span className={styles.sep}>&middot;</span>
          <span className={styles.org}>Jlabs Digital</span>
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
