import type { BlogMeta } from "@/lib/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oculus.jlabs.digital";

interface JsonLdProps {
  meta: BlogMeta;
}

export function JsonLd({ meta }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    keywords: meta.tags.join(", "),
    author: {
      "@type": "Organization",
      name: "Jlabs Digital",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Jlabs Digital",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${meta.slug}`,
    },
    ...(meta.thumbnail && {
      image: meta.thumbnail.startsWith("http")
        ? meta.thumbnail
        : `${SITE_URL}${meta.thumbnail}`,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
