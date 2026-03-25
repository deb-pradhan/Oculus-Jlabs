export interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    landscape: string;
    tiny: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

const CATEGORY_KEYWORDS: Record<string, string> = {
  options: "stock options trading finance",
  funding: "financial charts data analysis",
  onchain: "blockchain network technology",
  macro: "global economy finance markets",
  derivatives: "trading floor wall street",
  signals: "data analytics technology abstract",
};

/** Simple string hash to get a deterministic number from a slug */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/** Fetch a pool of Pexels images for a category (cached 1 hour) */
async function fetchCategoryPool(category: string): Promise<PexelsPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  const query = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.macro;

  try {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("size", "medium");
    url.searchParams.set("per_page", "15");

    const response = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data: PexelsSearchResponse = await response.json();
    return data.photos || [];
  } catch {
    return [];
  }
}

/**
 * Fetch unique Pexels images for a list of posts.
 * Each post gets a different image based on its slug hash,
 * even if multiple posts share the same category.
 */
export async function fetchPostImages(
  posts: { slug: string; category: string }[]
): Promise<Map<string, PexelsPhoto>> {
  // Fetch image pools for each unique category in parallel
  const uniqueCategories = [...new Set(posts.map((p) => p.category))];
  const pools = new Map<string, PexelsPhoto[]>();

  await Promise.all(
    uniqueCategories.map(async (cat) => {
      const photos = await fetchCategoryPool(cat);
      pools.set(cat, photos);
    })
  );

  // Assign a unique image to each post using slug hash
  const results = new Map<string, PexelsPhoto>();
  const usedIds = new Set<number>();

  for (const post of posts) {
    const pool = pools.get(post.category) || [];
    if (pool.length === 0) continue;

    const hash = hashString(post.slug);
    // Try to find an unused image, fall back to any image
    let photo: PexelsPhoto | null = null;
    for (let i = 0; i < pool.length; i++) {
      const idx = (hash + i) % pool.length;
      if (!usedIds.has(pool[idx].id)) {
        photo = pool[idx];
        break;
      }
    }
    // If all images in pool are used, just pick by hash
    if (!photo) {
      photo = pool[hash % pool.length];
    }

    usedIds.add(photo.id);
    results.set(post.slug, photo);
  }

  return results;
}
