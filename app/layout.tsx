import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/site';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/schema';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { LangHtmlUpdater } from '@/components/LangHtmlUpdater';

export const viewport: Viewport = {
  themeColor: '#6D5EF3',
};

export const metadata: Metadata = {
  title: {
    default: SITE.brandName,
    template: `%s | ${SITE.brandName}`,
  },
  description:
    'Creator stack guides and tool pages for AI video, UGC ads, localization, and practical marketing workflows (updated April 2026).',
  metadataBase: new URL(SITE.baseUrl),
  alternates: { canonical: '/' },
  manifest: '/images/site.webmanifest',
  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/images/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE.brandName,
    title: SITE.brandName,
    description: 'SEO-first creator stack hub: AI video tools, UGC ads workflows, localization playbooks, and practical guides.',
    url: SITE.baseUrl,
    images: [{ url: '/images/og-vidforges.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.brandName,
    description: 'SEO-first creator stack hub: AI video tools, UGC ads workflows, localization playbooks, and practical guides.',
    images: ['/images/og-vidforges.jpg'],
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = buildOrganizationJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body data-ga4-id={SITE.ga4Id}>
        <LangHtmlUpdater />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
        <SiteHeader />
        <main id="main-content" role="main">
          {children}
        </main>
        <SiteFooter />
        <script src="/site.js" defer />
      </body>
    </html>
  );
}
