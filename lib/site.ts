export const SITE = {
  baseUrl: 'https://vidforges.com',
  domain: 'vidforges.com',
  brandName: 'Vidforges',
  twitterHandle: '@Vidforges',
  companyName: 'SASU E-Com Shop',
  companyStreetAddress: '60 rue François 1er',
  companyPostalCode: '75008',
  companyLocality: 'Paris',
  companyCountry: 'FR',
  companyAddress: '60 rue François 1er, 75008 Paris, France',
  companyId: 'SIREN 934 934 308',
  hostName: 'Netlify',
  contactEmail: 'contact.ecomshopfrance@gmail.com',
  ga4Id: 'G-NHSS23Q3D9',
  affiliateLinks: {
    elevenlabs: 'https://try.elevenlabs.io/uo7tjoejxk32',
    pictory: 'https://pictory.ai?ref=pictoryavis',
    akool: 'https://akool.com/?via=rayzideoai',
    heygen:
      'https://www.heygen.com/?sid=rewardful&utm_content=creator&utm_medium=affiliate&via=rayzvideoai',
    wordpress: 'https://automattic.pxf.io/9VWqM0',
    capcut: 'https://capcutaffiliateprogram.pxf.io/yq111D',
    invideo: 'https://invideo.sjv.io/3JrYry',
    kling: 'https://klingaiaffiliate.pxf.io/4G9Der',
    shopify: 'https://shopify.pxf.io/6yLX0r',
    make: 'https://www.make.com/en/register?pc=makebyebyesalariat',
    systeme: 'https://systeme.io/fr?sa=sa022920257535b2a67f9fded54e95fb2cb3a100dc',
  },
  supportedLangs: ['en', 'fr', 'es', 'de'] as const,
} as const;

export type Lang = (typeof SITE.supportedLangs)[number];

export type UiCopy = {
  skipToContent: string;
  home: string;
  blog: string;
  guides: string;
  tools: string;
  legal: string;
  privacy: string;
  language: string;
  manageCookies: string;
  tryFree: string;
  trademarkDisclosure: string;
  footerMeta: string;
  primaryNavLabel: string;
};

export const UI_TRANSLATIONS: Record<Lang, UiCopy> = {
  en: {
    skipToContent: 'Skip to content',
    home: 'Home',
    blog: 'Blog',
    guides: 'Guides',
    tools: 'Tools',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    language: 'Language',
    manageCookies: 'Manage cookies',
    tryFree: 'Try Kling AI',
    trademarkDisclosure:
      'Trademarks belong to their respective owners. This site provides editorial content and may use sponsored affiliate links.',
    footerMeta: `Built by ${SITE.companyName} • Hosted on ${SITE.hostName}`,
    primaryNavLabel: 'Main navigation',
  },
  fr: {
    skipToContent: 'Aller au contenu',
    home: 'Accueil',
    blog: 'Blog',
    guides: 'Guides',
    tools: 'Outils',
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    language: 'Langue',
    manageCookies: 'Gérer les cookies',
    tryFree: 'Essayer Kling AI',
    trademarkDisclosure:
      'Les marques appartiennent à leurs propriétaires. Ce site propose du contenu éditorial et peut utiliser des liens d’affiliation sponsorisés.',
    footerMeta: `Dév. ${SITE.companyName} • Hébergement ${SITE.hostName}`,
    primaryNavLabel: 'Navigation principale',
  },
  es: {
    skipToContent: 'Saltar al contenido',
    home: 'Inicio',
    blog: 'Blog',
    guides: 'Guías',
    tools: 'Herramientas',
    legal: 'Aviso legal',
    privacy: 'Política de privacidad',
    language: 'Idioma',
    manageCookies: 'Gestionar cookies',
    tryFree: 'Probar Kling AI',
    trademarkDisclosure:
      'Las marcas pertenecen a sus respectivos propietarios. Este sitio ofrece contenido editorial y puede usar enlaces de afiliación patrocinados.',
    footerMeta: `Creado por ${SITE.companyName} • Alojado en ${SITE.hostName}`,
    primaryNavLabel: 'Navegación principal',
  },
  de: {
    skipToContent: 'Zum Inhalt springen',
    home: 'Start',
    blog: 'Blog',
    guides: 'Guides',
    tools: 'Tools',
    legal: 'Impressum',
    privacy: 'Datenschutzerklärung',
    language: 'Sprache',
    manageCookies: 'Cookies verwalten',
    tryFree: 'Kling AI testen',
    trademarkDisclosure:
      'Marken sind Eigentum ihrer jeweiligen Inhaber. Diese Seite bietet redaktionelle Inhalte und kann gesponserte Affiliate-Links enthalten.',
    footerMeta: `Built by ${SITE.companyName} • Hosted on ${SITE.hostName}`,
    primaryNavLabel: 'Hauptnavigation',
  },
};

export function normalizeLang(lang: unknown): Lang {
  const normalized = String(lang ?? '').toLowerCase();
  return (SITE.supportedLangs as readonly string[]).includes(normalized) ? (normalized as Lang) : 'en';
}

function normalizePathname(pathname: string): string {
  let path = pathname || '/';
  if (path !== '/') path = path.replace(/\/+$/, '');
  return path.replace(/\.html$/, '');
}

export function getLangFromPathname(pathname: string): Lang {
  const path = normalizePathname(pathname);
  if (path === '/fr' || path.startsWith('/fr/')) return 'fr';
  if (path === '/es' || path.startsWith('/es/')) return 'es';
  if (path === '/de' || path.startsWith('/de/')) return 'de';
  if (path === '/en' || path.startsWith('/en/')) return 'en'; // legacy
  return 'en';
}

export function prefixPath(lang: Lang): string {
  return lang === 'en' ? '' : `/${lang}`;
}

export type TranslationKey =
  | 'home'
  | 'blog_index'
  | 'tools_index'
  | 'blog_invideo_ai_review'
  | 'blog_kling_ai_ads_workflow'
  | 'blog_kling_4k_update'
  | 'blog_heygen_kling_avatars'
  | 'legal_notice'
  | 'privacy_policy';

export const ROUTE_BY_KEY: Record<TranslationKey, Record<Lang, string>> = {
  home: {
    en: '/',
    fr: '/fr/',
    es: '/es/',
    de: '/de/',
  },
  blog_index: {
    en: '/blog/',
    fr: '/fr/blog/',
    es: '/es/blog/',
    de: '/de/blog/',
  },
  tools_index: {
    en: '/tools/',
    fr: '/fr/tools/',
    es: '/es/tools/',
    de: '/de/tools/',
  },
  blog_invideo_ai_review: {
    en: '/blog/invideo-ai-review/',
    fr: '/fr/blog/avis-invideo-ai/',
    es: '/es/blog/invideo-ai-review/',
    de: '/de/blog/invideo-ai-review/',
  },
  blog_kling_ai_ads_workflow: {
    en: '/blog/kling-ai-ads-workflow/',
    fr: '/fr/blog/kling-ai-ads-workflow/',
    es: '/es/blog/kling-ai-ads-workflow/',
    de: '/de/blog/kling-ai-ads-workflow/',
  },
  blog_kling_4k_update: {
    en: '/blog/kling-4k-update/',
    fr: '/fr/blog/mise-a-jour-kling-4k/',
    es: '/es/blog/kling-4k-update/',
    de: '/de/blog/kling-4k-update/',
  },
  blog_heygen_kling_avatars: {
    en: '/blog/heygen-kling-avatars-ia/',
    fr: '/fr/blog/heygen-kling-avatars-ia/',
    es: '/es/blog/heygen-kling-avatars-ia/',
    de: '/de/blog/heygen-kling-avatars-ia/',
  },
  legal_notice: {
    en: '/legal-notice/',
    fr: '/fr/mentions-legales/',
    es: '/es/legal-notice/',
    de: '/de/legal-notice/',
  },
  privacy_policy: {
    en: '/privacy-policy/',
    fr: '/fr/politique-de-confidentialite/',
    es: '/es/privacy-policy/',
    de: '/de/privacy-policy/',
  },
};

const KEY_BY_ROUTE = new Map<string, TranslationKey>();
for (const key of Object.keys(ROUTE_BY_KEY) as TranslationKey[]) {
  for (const route of Object.values(ROUTE_BY_KEY[key])) {
    KEY_BY_ROUTE.set(normalizePathname(route), key);
  }
}

function translationKeyFromPath(pathname: string): TranslationKey | null {
  return KEY_BY_ROUTE.get(normalizePathname(pathname)) ?? null;
}

export function homePath(lang: Lang): string {
  return ROUTE_BY_KEY.home[lang];
}

export function blogIndexPath(lang: Lang): string {
  return ROUTE_BY_KEY.blog_index[lang];
}

export function guidesIndexPath(lang: Lang): string {
  return `${prefixPath(lang)}/guides/`.replace(/\/{2,}/g, '/');
}

export function toolsIndexPath(lang: Lang): string {
  return ROUTE_BY_KEY.tools_index[lang];
}

export function akoolReviewPath(lang: Lang): string {
  return `${prefixPath(lang)}/tools/akool/`.replace(/\/{2,}/g, '/');
}

export function legalNoticePath(lang: Lang): string {
  return ROUTE_BY_KEY.legal_notice[lang];
}

export function privacyPath(lang: Lang): string {
  return ROUTE_BY_KEY.privacy_policy[lang];
}

export function localizedUrl(pathname: string, lang: Lang): string {
  const target = normalizeLang(lang);
  const key = translationKeyFromPath(pathname);
  if (key) return ROUTE_BY_KEY[key][target];

  function withTrailingSlash(path: string): string {
    if (path === '/') return '/';
    return path.endsWith('/') ? path : `${path}/`;
  }

  const path = normalizePathname(pathname);
  const withoutPrefix =
    path === '/fr' || path.startsWith('/fr/')
      ? path.replace(/^\/fr\b/, '') || '/'
      : path === '/es' || path.startsWith('/es/')
        ? path.replace(/^\/es\b/, '') || '/'
        : path === '/de' || path.startsWith('/de/')
          ? path.replace(/^\/de\b/, '') || '/'
          : path === '/en' || path.startsWith('/en/')
            ? path.replace(/^\/en\b/, '') || '/'
            : path;

  if (withoutPrefix === '/' || withoutPrefix === '') return homePath(target);
  const cleaned = withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
  return withTrailingSlash(`${prefixPath(target)}${cleaned}`);
}
