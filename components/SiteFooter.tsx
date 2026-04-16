'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  blogIndexPath,
  getLangFromPathname,
  guidesIndexPath,
  homePath,
  legalNoticePath,
  privacyPath,
  prefixPath,
  SITE,
  toolsIndexPath,
  UI_TRANSLATIONS,
} from '@/lib/site';
import { LanguageLinks } from '@/components/LanguageLinks';

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  function toolPath(slug: string) {
    return `${prefixPath(lang)}/tools/${slug}/`;
  }

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img alt={SITE.brandName} decoding="async" height={35} loading="lazy" src="/images/vidforges-logo.png" width={147} />
            <p>{t.trademarkDisclosure}</p>
            <div className="affiliation-badge">{t.footerMeta}</div>
          </div>

          <nav aria-label="Footer navigation" className="footer-nav">
            <div className="footer-nav-column">
              <h4>{SITE.brandName}</h4>
              <ul>
                <li>
                  <Link href={homePath(lang)}>{t.home}</Link>
                </li>
                <li>
                  <Link href={blogIndexPath(lang)}>{t.blog}</Link>
                </li>
                <li>
                  <Link href={guidesIndexPath(lang)}>{t.guides}</Link>
                </li>
                <li>
                  <Link href={toolsIndexPath(lang)}>{t.tools}</Link>
                </li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4>Tools</h4>
              <ul>
                <li>
                  <Link href={toolPath('kling')}>Kling</Link>
                </li>
                <li>
                  <Link href={toolPath('heygen')}>HeyGen</Link>
                </li>
                <li>
                  <Link href={toolPath('pictory')}>Pictory</Link>
                </li>
                <li>
                  <Link href={toolPath('elevenlabs')}>ElevenLabs</Link>
                </li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href={privacyPath(lang)}>{t.privacy}</Link>
                </li>
                <li>
                  <Link href={legalNoticePath(lang)}>{t.legal}</Link>
                </li>
                <li>
                  <a href="#cookie-settings" data-manage-cookies>
                    {t.manageCookies}
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="footer-meta">
            <div className="lang-selector">
              <LanguageLinks />
            </div>
            <p className="copyright">© {new Date().getFullYear()} {SITE.brandName}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
