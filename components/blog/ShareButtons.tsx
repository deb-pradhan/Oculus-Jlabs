"use client";

import { useState, useCallback } from "react";
import styles from "./ShareButtons.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oculus.jlabsdigital.com";

interface ShareButtonsProps {
  title: string;
  slug: string;
  description?: string;
}

export function ShareButtons({ title, slug, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const buildUrl = useCallback(
    (platform: string) =>
      `${SITE_URL}/blog/${slug}?utm_source=${platform}&utm_medium=social`,
    [slug]
  );

  const shareText = description ? `${title}\n\n${description}` : title;

  const shareX = () => {
    const url = buildUrl("twitter");
    // X has a 280 char limit; reserve space for the URL (~30 chars via t.co)
    const maxTextLen = 280 - 30;
    const text = shareText.length > maxTextLen ? shareText.slice(0, maxTextLen - 1) + "\u2026" : shareText;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareTelegram = () => {
    const url = buildUrl("telegram");
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareReddit = () => {
    const url = buildUrl("reddit");
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareLinkedIn = () => {
    const url = buildUrl("linkedin");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyLink = async () => {
    const url = buildUrl("copy");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const url = buildUrl("native");
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled or unsupported
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  if (canNativeShare) {
    return (
      <div className={styles.row}>
        <button
          className={styles.pill}
          onClick={handleNativeShare}
          aria-label="Share this post"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM12 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM5.7 7.4l4.6-2.8M5.7 8.6l4.6 2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Share
        </button>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <button className={`${styles.pill} ${styles.x}`} onClick={shareX} aria-label="Share on X">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M9.47 6.77 14.35 1H13.1L8.92 5.95 5.6 1H1l5.12 7.45L1 15h1.25l4.47-5.2L10.4 15H15L9.47 6.77Zm-1.58 1.84-.52-.74L2.86 1.91h1.78l3.33 4.76.52.74 4.33 6.19h-1.78L7.89 8.61Z" fill="currentColor" />
        </svg>
        X
      </button>

      <button className={`${styles.pill} ${styles.telegram}`} onClick={shareTelegram} aria-label="Share on Telegram">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M14.5 1.5L1 7l4.5 2 1.5 4.5 2.5-3 3 2.5L14.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5.5 9L14.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Telegram
      </button>

      <button className={`${styles.pill} ${styles.reddit}`} onClick={shareReddit} aria-label="Share on Reddit">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M14 8a1.5 1.5 0 0 0-2.5-1.1 7.3 7.3 0 0 0-3.5-1l.6-2.8 2 .4a1 1 0 1 0 .1-1 1 1 0 0 0-.9.6l-2.2-.5a.3.3 0 0 0-.3.2L6.5 5.9a7.5 7.5 0 0 0-3.6 1A1.5 1.5 0 0 0 .5 8.5 1.5 1.5 0 0 0 1 9.8v.2a4.3 4.3 0 0 0 5 3.5 4.3 4.3 0 0 0 5-3.5V9.8A1.5 1.5 0 0 0 14 8ZM5 9.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm5.7 2.4a3.3 3.3 0 0 1-3.4 0 .3.3 0 0 1 .4-.4 2.7 2.7 0 0 0 2.6 0 .3.3 0 0 1 .4.4ZM10 10.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="currentColor" />
        </svg>
        Reddit
      </button>

      <button className={`${styles.pill} ${styles.linkedin}`} onClick={shareLinkedIn} aria-label="Share on LinkedIn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4.25 6.5v5.25M7.75 11.75v-3a1.75 1.75 0 1 1 3.5 0v3M7.75 8.75v-2.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4.25" cy="4.25" r="0.75" fill="currentColor" />
          <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        LinkedIn
      </button>

      <button
        className={`${styles.pill} ${copied ? styles.copied : ""}`}
        onClick={copyLink}
        aria-label="Copy link"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6.75 9.25a2.5 2.5 0 0 0 3.54 0l2-2a2.5 2.5 0 0 0-3.54-3.54l-.75.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.25 6.75a2.5 2.5 0 0 0-3.54 0l-2 2a2.5 2.5 0 0 0 3.54 3.54l.75-.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
