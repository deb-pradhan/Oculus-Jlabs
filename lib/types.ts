/** Blog post metadata — the contract every blog folder's meta.ts must satisfy */
export interface BlogMeta {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string; // 1-3 sentences, used for SEO + cards
  tags: string[];
  category: BlogCategory;
  thumbnail?: string;
  authors?: string[];
  readingTime?: number; // minutes
}

export type BlogCategory =
  | "options"
  | "funding"
  | "onchain"
  | "macro"
  | "derivatives"
  | "signals";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "options",
  "funding",
  "onchain",
  "macro",
  "derivatives",
  "signals",
];

/** Post with engagement counters (returned by API) */
export interface PostWithCounts extends BlogMeta {
  viewCount: number;
  reactionCount: number;
}

/** Allowed reaction emojis */
export type ReactionEmoji = "\uD83D\uDD25" | "\uD83E\uDDE0" | "\uD83D\uDC8E" | "\uD83D\uDCC9" | "\uD83D\uDE80";

export const REACTION_EMOJIS: { emoji: ReactionEmoji; label: string }[] = [
  { emoji: "\uD83D\uDD25", label: "Hot take" },
  { emoji: "\uD83E\uDDE0", label: "Insightful" },
  { emoji: "\uD83D\uDC8E", label: "Alpha" },
  { emoji: "\uD83D\uDCC9", label: "Bearish" },
  { emoji: "\uD83D\uDE80", label: "Bullish" },
];

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
