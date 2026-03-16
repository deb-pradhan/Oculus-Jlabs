import type { Metadata } from 'next';
import meta from './meta';
import IntroducingImpactMarket from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oculus.jlabsdigital.com';

export function generateMetadata(): Metadata {
  const ogImageUrl = `${SITE_URL}/api/og?${new URLSearchParams({
    title: meta.title,
    category: meta.category,
    date: meta.date,
    ...(meta.readingTime ? { readingTime: String(meta.readingTime) } : {}),
  }).toString()}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    authors: meta.authors?.map((name) => ({ name })),
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/blog/${meta.slug}`,
      siteName: 'Oculus by Jlabs Digital',
      publishedTime: `${meta.date}T00:00:00Z`,
      tags: meta.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImageUrl],
      creator: '@jlabsdigital',
    },
  };
}

export default function Page() {
  return <IntroducingImpactMarket />;
}
