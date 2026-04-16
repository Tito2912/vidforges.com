import type { DocMeta } from '@/lib/content';
import type { Post } from '@/lib/types';
import { blogIndexPath, guidesIndexPath, homePath, normalizeLang, SITE, toolsIndexPath, UI_TRANSLATIONS } from '@/lib/site';

const BASE_URL = SITE.baseUrl;
const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

export function buildOrganizationJsonLd() {
  const twitter =
    SITE.twitterHandle && SITE.twitterHandle.startsWith('@') ? `https://twitter.com/${SITE.twitterHandle.slice(1)}` : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.brandName,
    legalName: SITE.companyName,
    url: BASE_URL,
    email: SITE.contactEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.companyStreetAddress,
      postalCode: SITE.companyPostalCode,
      addressLocality: SITE.companyLocality,
      addressCountry: SITE.companyCountry,
    },
    identifier: SITE.companyId,
    sameAs: twitter ? [twitter] : undefined,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.contactEmail,
        availableLanguage: ['en', 'fr', 'es', 'de'],
      },
    ],
    logo: {
      '@type': 'ImageObject',
      url: new URL('/images/vidforges-logo.png', BASE_URL).toString(),
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.brandName,
    url: BASE_URL,
    publisher: { '@id': ORG_ID },
  };
}

function normalizePathname(pathname: string): string {
  let path = pathname || '/';
  if (path !== '/') path = path.replace(/\/+$/, '');
  return path.replace(/\.html$/, '');
}

function ensureTrailingSlash(pathname: string): string {
  const path = pathname || '/';
  if (path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

function canonicalPathFromPost(post: Post): string {
  const raw = post.canonical ?? `/${post.slug}`;
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return ensureTrailingSlash(withLeading);
}

function stripBrandSuffix(title: string): string {
  const t = String(title ?? '').trim();
  if (!t) return '';
  const suffix = ` | ${SITE.brandName}`;
  return t.endsWith(suffix) ? t.slice(0, -suffix.length).trim() : t;
}

function getPublishedAndModified(post: Post): { published?: string; modified?: string } {
  const published = post.date ?? post.updatedAt ?? undefined;
  const modified = post.updatedAt ?? post.date ?? undefined;
  return { published, modified };
}

export function buildPrimaryEntityJsonLd(post: Post) {
  const url = new URL(canonicalPathFromPost(post), BASE_URL).toString();
  const lang = normalizeLang(post.lang);
  const title = stripBrandSuffix(post.title) || post.title;
  const { published, modified } = getPublishedAndModified(post);

  if (post.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: post.description,
      mainEntityOfPage: url,
      datePublished: published,
      dateModified: modified ?? published,
      inLanguage: lang,
      author: [{ '@id': ORG_ID }],
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': WEBSITE_ID },
    };
  }

  const canonicalPath = canonicalPathFromPost(post);
  const isHub =
    canonicalPath === blogIndexPath(lang) || canonicalPath === toolsIndexPath(lang) || canonicalPath === guidesIndexPath(lang);
  const pageType = post.type === 'blogIndex' || isHub ? 'CollectionPage' : 'WebPage';

  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description: post.description,
    url,
    datePublished: published,
    dateModified: modified ?? published,
    inLanguage: lang,
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

function startsWithSegments(segments: string[], prefix: string[]): boolean {
  if (segments.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i += 1) {
    if (segments[i] !== prefix[i]) return false;
  }
  return true;
}

function sortByPreferredOrder<T>(items: T[], getKey: (item: T) => string, order: string[]): T[] {
  const rank = new Map<string, number>();
  order.forEach((k, idx) => rank.set(k, idx));

  return [...items].sort((a, b) => {
    const ka = getKey(a);
    const kb = getKey(b);
    const ra = rank.has(ka) ? (rank.get(ka) as number) : Number.POSITIVE_INFINITY;
    const rb = rank.has(kb) ? (rank.get(kb) as number) : Number.POSITIVE_INFINITY;
    if (ra !== rb) return ra - rb;
    return ka.localeCompare(kb);
  });
}

function parseDateForSort(value: string | undefined): number {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

export function buildItemListJsonLd(post: Post, all: DocMeta[]): object | null {
  const lang = normalizeLang(post.lang);
  const canonicalPath = canonicalPathFromPost(post);

  const isToolsIndex = canonicalPath === toolsIndexPath(lang);
  const isGuidesIndex = canonicalPath === guidesIndexPath(lang);
  const isBlogIndex = canonicalPath === blogIndexPath(lang);
  if (!isToolsIndex && !isGuidesIndex && !isBlogIndex) return null;

  const prefix = isToolsIndex
    ? lang === 'en'
      ? ['tools']
      : [lang, 'tools']
    : isGuidesIndex
      ? lang === 'en'
        ? ['guides']
        : [lang, 'guides']
      : lang === 'en'
        ? ['blog']
        : [lang, 'blog'];

  const filtered = all.filter((m) => {
    if (normalizeLang(m.lang) !== lang) return false;
    if (!startsWithSegments(m.segments, prefix)) return false;
    if (m.segments.length <= prefix.length) return false; // exclude the index itself
    if (isBlogIndex && m.type !== 'article') return false;
    return true;
  });

  let ordered = filtered;

  if (isToolsIndex) {
    const toolOrder = ['kling', 'invideo', 'pictory', 'heygen', 'akool', 'capcut', 'elevenlabs', 'make', 'shopify', 'wordpress', 'systeme'];
    ordered = sortByPreferredOrder(filtered, (m) => m.segments[prefix.length] ?? '', toolOrder);
  } else if (isGuidesIndex) {
    const guideOrder = ['creator-stack', 'ugc-ads-system', 'video-localization'];
    ordered = sortByPreferredOrder(filtered, (m) => m.segments[prefix.length] ?? '', guideOrder);
  } else if (isBlogIndex) {
    ordered = [...filtered].sort((a, b) => {
      const da = parseDateForSort(a.date ?? a.updatedAt);
      const db = parseDateForSort(b.date ?? b.updatedAt);
      if (da !== db) return db - da; // newest first
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  const items = ordered.map((m) => {
    const path = ensureTrailingSlash((m.canonical ?? m.routePath) || '/');
    return {
      name: stripBrandSuffix(m.title) || m.title,
      url: new URL(path, BASE_URL).toString(),
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: isBlogIndex ? 'https://schema.org/ItemListOrderDescending' : 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((x, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: x.name,
      item: x.url,
    })),
  };
}

type Crumb = { name: string; path: string };

export function buildBreadcrumbJsonLd(post: Post) {
  const lang = normalizeLang(post.lang);
  const ui = UI_TRANSLATIONS[lang];
  const url = new URL(canonicalPathFromPost(post), BASE_URL).toString();

  const home: Crumb = { name: ui.home, path: homePath(lang) };

  // Blog articles should always live under the Blog hub.
  if (post.type === 'article') {
    const crumbs: Crumb[] = [
      home,
      { name: ui.blog, path: blogIndexPath(lang) },
      { name: stripBrandSuffix(post.title) || ui.blog, path: canonicalPathFromPost(post) },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: c.name,
        item: idx === crumbs.length - 1 ? url : new URL(c.path, BASE_URL).toString(),
      })),
    };
  }

  // Home: single crumb.
  const canonical = normalizePathname(canonicalPathFromPost(post));
  const homeCanonical = normalizePathname(home.path);
  if (canonical === homeCanonical) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: home.name,
          item: new URL(home.path, BASE_URL).toString(),
        },
      ],
    };
  }

  const canonicalPath = canonicalPathFromPost(post);
  const title = stripBrandSuffix(post.title) || post.title;
  const crumbs: Crumb[] = [home, { name: title, path: canonicalPath }];

  // Tool pages benefit from a Tools hub crumb: Home > Tools > Tool
  const isToolPage = /^\/tools\/[^/]+\/$/.test(canonicalPath) || /^\/(fr|es|de)\/tools\/[^/]+\/$/.test(canonicalPath);
  if (isToolPage) {
    const toolCrumbs: Crumb[] = [home, { name: ui.tools, path: toolsIndexPath(lang) }, { name: title, path: canonicalPath }];
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: toolCrumbs.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: c.name,
        item: idx === toolCrumbs.length - 1 ? url : new URL(c.path, BASE_URL).toString(),
      })),
    };
  }

  // Guide pages: Home > Guides > Guide
  const isGuidesIndex = canonicalPath === guidesIndexPath(lang);
  const isGuidePage =
    /^\/guides\/[^/]+\/$/.test(canonicalPath) || /^\/(fr|es|de)\/guides\/[^/]+\/$/.test(canonicalPath);
  if (isGuidesIndex || isGuidePage) {
    const guideCrumbs: Crumb[] = isGuidesIndex
      ? [home, { name: ui.guides, path: guidesIndexPath(lang) }]
      : [home, { name: ui.guides, path: guidesIndexPath(lang) }, { name: title, path: canonicalPath }];
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: guideCrumbs.map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: c.name,
        item: idx === guideCrumbs.length - 1 ? url : new URL(c.path, BASE_URL).toString(),
      })),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: idx === crumbs.length - 1 ? url : new URL(c.path, BASE_URL).toString(),
    })),
  };
}
