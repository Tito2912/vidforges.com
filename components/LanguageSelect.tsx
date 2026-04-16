'use client';

import { usePathname } from 'next/navigation';
import { useId } from 'react';
import type { Lang } from '@/lib/site';
import { getLangFromPathname, localizedUrl, SITE, UI_TRANSLATIONS } from '@/lib/site';

const LANG_STORAGE_KEY = 'cat_lang_v1';

export function LanguageSelect() {
  const selectId = useId();
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  function onChange(nextLang: Lang) {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    } catch {
      // ignore
    }

    const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
    window.location.href = `${localizedUrl(pathname, nextLang)}${hash}`;
  }

  return (
    <select
      aria-label={t.language}
      id={selectId}
      name="lang"
      onChange={(e) => onChange(e.target.value as Lang)}
      value={lang}
    >
      {SITE.supportedLangs.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
