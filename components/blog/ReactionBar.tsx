"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { REACTION_EMOJIS } from "@/lib/types";
import type { ReactionEmoji } from "@/lib/types";
import { generateFingerprint } from "@/lib/fingerprint";
import styles from "./ReactionBar.module.css";

interface ReactionBarProps {
  slug: string;
}

type ReactionCounts = Record<ReactionEmoji, number>;

function getStorageKey(slug: string): string {
  return `oculus:reactions:${slug}`;
}

function getReactedEmojis(slug: string): Set<ReactionEmoji> {
  try {
    const raw = localStorage.getItem(getStorageKey(slug));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as ReactionEmoji[]);
  } catch {
    return new Set();
  }
}

function saveReactedEmoji(slug: string, emoji: ReactionEmoji) {
  const set = getReactedEmojis(slug);
  set.add(emoji);
  localStorage.setItem(getStorageKey(slug), JSON.stringify([...set]));
}

export function ReactionBar({ slug }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCounts>(() => {
    const init = {} as ReactionCounts;
    for (const { emoji } of REACTION_EMOJIS) {
      init[emoji] = 0;
    }
    return init;
  });

  const [reacted, setReacted] = useState<Set<ReactionEmoji>>(new Set());
  const [bouncing, setBouncing] = useState<ReactionEmoji | null>(null);
  const fingerprintRef = useRef<string>("");

  useEffect(() => {
    setReacted(getReactedEmojis(slug));
    fingerprintRef.current = generateFingerprint();

    const fetchCounts = async () => {
      try {
        const res = await fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = (await res.json()) as ReactionCounts;
          setCounts((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // silent fail
      }
    };

    fetchCounts();
  }, [slug]);

  const handleReact = useCallback(
    async (emoji: ReactionEmoji) => {
      if (reacted.has(emoji)) return;

      // Optimistic update
      setCounts((prev) => ({
        ...prev,
        [emoji]: prev[emoji] + 1,
      }));
      setReacted((prev) => {
        const next = new Set(prev);
        next.add(emoji);
        return next;
      });
      saveReactedEmoji(slug, emoji);

      // Bounce animation
      setBouncing(emoji);
      setTimeout(() => setBouncing(null), 400);

      try {
        const res = await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            emoji,
            fingerprint: fingerprintRef.current,
          }),
        });

        if (!res.ok) {
          throw new Error("Reaction failed");
        }
      } catch {
        // Rollback
        setCounts((prev) => ({
          ...prev,
          [emoji]: Math.max(0, prev[emoji] - 1),
        }));
        setReacted((prev) => {
          const next = new Set(prev);
          next.delete(emoji);
          return next;
        });
        // Remove from localStorage
        try {
          const set = getReactedEmojis(slug);
          set.delete(emoji);
          localStorage.setItem(getStorageKey(slug), JSON.stringify([...set]));
        } catch {
          // ignore
        }
      }
    },
    [slug, reacted]
  );

  return (
    <div className={styles.bar}>
      {REACTION_EMOJIS.map(({ emoji, label }) => (
        <button
          key={emoji}
          className={`${styles.button} ${reacted.has(emoji) ? styles.active : ""} ${bouncing === emoji ? styles.bounce : ""}`}
          onClick={() => handleReact(emoji)}
          disabled={reacted.has(emoji)}
          aria-label={`${label} (${counts[emoji]})`}
          title={label}
        >
          <span className={styles.emoji}>{emoji}</span>
          <span className={styles.count}>{counts[emoji]}</span>
        </button>
      ))}
    </div>
  );
}
