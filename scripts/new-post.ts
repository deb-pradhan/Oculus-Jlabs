/**
 * new-post.ts
 * Scaffolds a new blog post folder with meta.ts, page.tsx, and data.ts.
 *
 * Usage:  tsx scripts/new-post.ts --slug my-post --title "My Post" [--category macro]
 */

import fs from "node:fs";
import path from "node:path";

// ── Parse CLI args ──────────────────────────────────────────
function parseArgs(): { slug: string; title: string; category: string } {
  const args = process.argv.slice(2);
  let slug = "";
  let title = "";
  let category = "macro";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--slug" && args[i + 1]) {
      slug = args[++i];
    } else if (args[i] === "--title" && args[i + 1]) {
      title = args[++i];
    } else if (args[i] === "--category" && args[i + 1]) {
      category = args[++i];
    }
  }

  if (!slug) {
    console.error("Error: --slug is required");
    console.error("Usage: tsx scripts/new-post.ts --slug my-post --title \"My Post\" [--category macro]");
    process.exit(1);
  }

  if (!title) {
    // Default title from slug
    title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return { slug, title, category };
}

// ── Templates ───────────────────────────────────────────────
function metaTemplate(slug: string, title: string, category: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `import type { BlogMeta } from "@/lib/types";

const meta: BlogMeta = {
  slug: "${slug}",
  title: "${title}",
  date: "${today}",
  description: "",
  tags: [],
  category: "${category}",
  readingTime: 5,
};

export default meta;
`;
}

function pageTemplate(slug: string, title: string): string {
  return `import BlogLayout from "@/components/layout/BlogLayout";
import meta from "./meta";

export const metadata = {
  title: meta.title,
  description: meta.description,
};

export default function ${toPascalCase(slug)}Page() {
  return (
    <BlogLayout meta={meta}>
      <p>Start writing here.</p>
    </BlogLayout>
  );
}
`;
}

function dataTemplate(): string {
  return `/** Chart data and constants for this post */

export {};
`;
}

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// ── Main ────────────────────────────────────────────────────
function main() {
  const { slug, title, category } = parseArgs();
  const dir = path.resolve(__dirname, "../app/blog", slug);

  if (fs.existsSync(dir)) {
    console.error(`Error: Directory already exists: ${dir}`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "meta.ts"), metaTemplate(slug, title, category));
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug, title));
  fs.writeFileSync(path.join(dir, "data.ts"), dataTemplate());

  console.log(`✅ Created new post scaffold at app/blog/${slug}/`);
  console.log(`   • meta.ts`);
  console.log(`   • page.tsx`);
  console.log(`   • data.ts`);
}

main();
