import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllDocMetas, getAllStaticParams, getDocMetaByRouteSegments, getPostByRouteSegments } from '@/lib/content';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildPrimaryEntityJsonLd } from '@/lib/schema';
import { buildAlternates, getOpenGraphImage, getOpenGraphType, parseRobots } from '@/lib/seo';

export async function generateStaticParams() {
  const all = await getAllStaticParams();
  return all.filter((x) => x.slug.length > 0);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getDocMetaByRouteSegments(slug);
  if (!meta) return {};

  const all = await getAllDocMetas();
  const ogImage = getOpenGraphImage(meta);
  const canonical = meta.canonical ?? meta.routePath;

  return {
    // Use absolute to avoid applying the root title template (prevents "| Brand | Brand").
    title: { absolute: meta.title },
    description: meta.description,
    alternates: buildAlternates(meta, all),
    robots: parseRobots(meta.robots),
    openGraph: {
      type: getOpenGraphType(meta),
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const post = await getPostByRouteSegments(slug);
  if (!post) return notFound();

  const primaryJsonLd = buildPrimaryEntityJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);
  const isHub =
    post.type === 'blogIndex' ||
    post.slug === 'tools' ||
    post.slug === 'guides' ||
    post.slug.endsWith('/tools') ||
    post.slug.endsWith('/guides') ||
    post.slug.endsWith('/blog');
  const itemListJsonLd = isHub ? buildItemListJsonLd(post, await getAllDocMetas()) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {itemListJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      ) : null}
      {post.faq?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: post.faq.map((x) => ({
                '@type': 'Question',
                name: x.q,
                acceptedAnswer: { '@type': 'Answer', text: x.a },
              })),
            }),
          }}
        />
      ) : null}

      {post.content}
    </>
  );
}
