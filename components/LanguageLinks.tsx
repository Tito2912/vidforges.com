'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { getLangFromPathname, homePath, localizedUrl, SITE } from '@/lib/site';

const LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
};

export function LanguageLinks() {
  const pathname = usePathname() ?? '/';
  const current = getLangFromPathname(pathname);
  const isNotFoundRoute = pathname.includes('_not-found') || pathname === '/404' || pathname === '/404/';

  return (
    <>
      {SITE.supportedLangs.map((lang, idx) => (
        <Fragment key={lang}>
          <Link
            aria-current={current === lang ? 'page' : undefined}
            href={isNotFoundRoute ? homePath(lang) : localizedUrl(pathname, lang)}
            hrefLang={lang}
            lang={lang}
          >
            {LABELS[lang] ?? lang.toUpperCase()}
          </Link>
          {idx < SITE.supportedLangs.length - 1 ? <span aria-hidden="true">|</span> : null}
        </Fragment>
      ))}
    </>
  );
}
