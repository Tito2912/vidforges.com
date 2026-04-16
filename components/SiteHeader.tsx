'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';
import {
  blogIndexPath,
  getLangFromPathname,
  guidesIndexPath,
  homePath,
  localizedUrl,
  prefixPath,
  SITE,
  toolsIndexPath,
  UI_TRANSLATIONS,
} from '@/lib/site';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
};

const ALL_TOOLS_LABEL: Record<string, string> = {
  en: 'All tools',
  fr: 'Tous les outils',
  es: 'Todas las herramientas',
  de: 'Alle Tools',
};

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];
  const [isOpen, setIsOpen] = useState(false);
  const isNotFoundRoute = pathname.includes('_not-found') || pathname === '/404' || pathname === '/404/';

  function onNavLinkClick(e?: MouseEvent<HTMLElement>) {
    try {
      const target = e?.currentTarget as HTMLElement | undefined;
      const details = target?.closest?.('details') as HTMLDetailsElement | null;
      if (details) details.open = false;
    } catch {
      // ignore
    }

    setIsOpen(false);
  }

  function toolPath(slug: string) {
    return `${prefixPath(lang)}/tools/${slug}/`;
  }

  return (
    <header className="header" role="banner">
      <div className="container">
        <nav aria-label={t.primaryNavLabel} className="nav">
          <Link aria-label={`${SITE.brandName} — ${t.home}`} className="logo-link" href={homePath(lang)}>
            <img alt={SITE.brandName} decoding="async" fetchPriority="high" height={40} src="/images/vidforges-logo.png" width={168} />
          </Link>

          <button
            aria-controls="main-menu"
            aria-expanded={isOpen}
            aria-label={t.primaryNavLabel}
            className="menu-toggle"
            onClick={() => setIsOpen((v) => !v)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <ul aria-expanded={isOpen} className="nav-menu" id="main-menu" role="navigation">
            <li>
              <details className="nav-dropdown">
                <summary>
                  {t.tools} <span aria-hidden="true" className="nav-dropdown-caret">▾</span>
                </summary>
                <div className="nav-dropdown-menu" role="menu">
                  <Link href={toolPath('heygen')} onClick={onNavLinkClick} role="menuitem">
                    HeyGen
                  </Link>
                  <Link href={toolPath('akool')} onClick={onNavLinkClick} role="menuitem">
                    Akool
                  </Link>
                  <Link href={toolPath('invideo')} onClick={onNavLinkClick} role="menuitem">
                    InVideo
                  </Link>
                  <Link href={toolPath('pictory')} onClick={onNavLinkClick} role="menuitem">
                    Pictory
                  </Link>
                  <Link href={toolPath('kling')} onClick={onNavLinkClick} role="menuitem">
                    Kling
                  </Link>
                  <Link href={toolPath('capcut')} onClick={onNavLinkClick} role="menuitem">
                    CapCut
                  </Link>
                  <Link href={toolPath('elevenlabs')} onClick={onNavLinkClick} role="menuitem">
                    ElevenLabs
                  </Link>
                  <div className="nav-dropdown-divider" role="separator" />
                  <Link href={toolsIndexPath(lang)} onClick={onNavLinkClick} role="menuitem">
                    {ALL_TOOLS_LABEL[lang] ?? ALL_TOOLS_LABEL.en}
                  </Link>
                </div>
              </details>
            </li>
            <li>
              <Link href={guidesIndexPath(lang)} onClick={onNavLinkClick}>
                {t.guides}
              </Link>
            </li>
            <li>
              <Link href={blogIndexPath(lang)} onClick={onNavLinkClick}>
                {t.blog}
              </Link>
            </li>
            <li>
              <details className="nav-dropdown nav-dropdown--right lang-dropdown">
                <summary aria-label={t.language}>
                  {LANGUAGE_LABELS[lang] ?? lang.toUpperCase()}{' '}
                  <span aria-hidden="true" className="nav-dropdown-caret">▾</span>
                </summary>
                <div className="nav-dropdown-menu" role="menu">
                  {SITE.supportedLangs.map((l) => (
                    <Link
                      aria-current={l === lang ? 'page' : undefined}
                      href={isNotFoundRoute ? homePath(l) : localizedUrl(pathname, l)}
                      hrefLang={l}
                      key={l}
                      lang={l}
                      onClick={onNavLinkClick}
                      role="menuitem"
                    >
                      {LANGUAGE_LABELS[l] ?? l.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </details>
            </li>

            <li>
              <a
                className="btn-primary nav-cta"
                data-affiliate-product="kling"
                href={SITE.affiliateLinks.kling}
                rel="noopener nofollow sponsored noreferrer"
                target="_blank"
              >
                {t.tryFree}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
