(function () {
  var GA4_ID = '';
  var CONSENT_KEY = 'cat_consent_v1';

  try {
    GA4_ID = (document.body && document.body.getAttribute('data-ga4-id')) || '';
  } catch {
    GA4_ID = '';
  }

  function getLangFromPathname(pathname) {
    var p = String(pathname || '/');
    if (p === '/fr' || p.indexOf('/fr/') === 0) return 'fr';
    if (p === '/es' || p.indexOf('/es/') === 0) return 'es';
    if (p === '/de' || p.indexOf('/de/') === 0) return 'de';
    return 'en';
  }

  function getCopy() {
    var lang = getLangFromPathname(window.location.pathname);
    var COPY = {
      en: {
        manageCookies: 'Manage cookies',
        cookieAria: 'Cookie consent',
        cookieTitle: 'Cookies',
        cookieTextBefore: 'Necessary cookies are always on. You can also allow',
        cookieTextAnalytics: 'Analytics (GA4)',
        cookieTextAnd: 'and',
        cookieTextExternal: 'External media (YouTube).',
        acceptAll: 'Accept all',
        rejectAll: 'Reject',
        customize: 'Customize',
        cookieSettingsTitle: 'Cookie settings',
        cookieSettingsSubtitle: 'Choose what you allow. Necessary is always on.',
        necessary: 'Necessary',
        necessaryDesc: 'Core functionality, security, and consent storage.',
        analytics: 'Analytics (GA4)',
        analyticsDesc: 'Loaded only after consent. Helps us improve the site.',
        externalMedia: 'External media',
        externalMediaDesc: 'Enables YouTube embeds (youtube-nocookie.com).',
        save: 'Save',
        close: 'Close',
        videoPlaceholderTitle: 'Click to load video',
        videoPlaceholderBody: 'External media (YouTube) is blocked until you allow it.',
        videoPlaceholderCta: 'Load video',
      },
      fr: {
        manageCookies: 'Gérer les cookies',
        cookieAria: 'Consentement cookies',
        cookieTitle: 'Cookies',
        cookieTextBefore: 'Les cookies nécessaires sont toujours actifs. Vous pouvez aussi autoriser',
        cookieTextAnalytics: 'Analytics (GA4)',
        cookieTextAnd: 'et',
        cookieTextExternal: 'Médias externes (YouTube).',
        acceptAll: 'Tout accepter',
        rejectAll: 'Tout refuser',
        customize: 'Personnaliser',
        cookieSettingsTitle: 'Paramètres cookies',
        cookieSettingsSubtitle: 'Choisissez ce que vous autorisez. Nécessaires : toujours actifs.',
        necessary: 'Nécessaires',
        necessaryDesc: 'Fonctionnement, sécurité et stockage du consentement.',
        analytics: 'Analytics (GA4)',
        analyticsDesc: 'Chargé uniquement après consentement. Aide à améliorer le site.',
        externalMedia: 'Médias externes',
        externalMediaDesc: 'Active les vidéos YouTube (youtube-nocookie.com).',
        save: 'Enregistrer',
        close: 'Fermer',
        videoPlaceholderTitle: 'Cliquer pour charger la vidéo',
        videoPlaceholderBody: 'Les médias externes (YouTube) sont bloqués tant que vous ne les autorisez pas.',
        videoPlaceholderCta: 'Charger la vidéo',
      },
      es: {
        manageCookies: 'Gestionar cookies',
        cookieAria: 'Consentimiento de cookies',
        cookieTitle: 'Cookies',
        cookieTextBefore: 'Las cookies necesarias siempre están activas. También puedes permitir',
        cookieTextAnalytics: 'Analítica (GA4)',
        cookieTextAnd: 'y',
        cookieTextExternal: 'Medios externos (YouTube).',
        acceptAll: 'Aceptar todo',
        rejectAll: 'Rechazar',
        customize: 'Personalizar',
        cookieSettingsTitle: 'Ajustes de cookies',
        cookieSettingsSubtitle: 'Elige lo que permites. Las necesarias siempre están activas.',
        necessary: 'Necesarias',
        necessaryDesc: 'Funcionalidad básica, seguridad y almacenamiento del consentimiento.',
        analytics: 'Analítica (GA4)',
        analyticsDesc: 'Se carga solo tras el consentimiento. Ayuda a mejorar el sitio.',
        externalMedia: 'Medios externos',
        externalMediaDesc: 'Activa vídeos de YouTube (youtube-nocookie.com).',
        save: 'Guardar',
        close: 'Cerrar',
        videoPlaceholderTitle: 'Haz clic para cargar el vídeo',
        videoPlaceholderBody: 'Los medios externos (YouTube) están bloqueados hasta que los permitas.',
        videoPlaceholderCta: 'Cargar vídeo',
      },
      de: {
        manageCookies: 'Cookies verwalten',
        cookieAria: 'Cookie-Einwilligung',
        cookieTitle: 'Cookies',
        cookieTextBefore: 'Notwendige Cookies sind immer aktiv. Du kannst zusätzlich',
        cookieTextAnalytics: 'Analytics (GA4)',
        cookieTextAnd: 'und',
        cookieTextExternal: 'Externe Medien (YouTube) erlauben.',
        acceptAll: 'Alle akzeptieren',
        rejectAll: 'Ablehnen',
        customize: 'Anpassen',
        cookieSettingsTitle: 'Cookie-Einstellungen',
        cookieSettingsSubtitle: 'Wähle aus. Notwendige Cookies sind immer aktiv.',
        necessary: 'Notwendig',
        necessaryDesc: 'Grundfunktionen, Sicherheit und Speicherung der Einwilligung.',
        analytics: 'Analytics (GA4)',
        analyticsDesc: 'Wird erst nach Einwilligung geladen. Hilft uns, die Seite zu verbessern.',
        externalMedia: 'Externe Medien',
        externalMediaDesc: 'Aktiviert YouTube-Einbettungen (youtube-nocookie.com).',
        save: 'Speichern',
        close: 'Schließen',
        videoPlaceholderTitle: 'Klicken, um das Video zu laden',
        videoPlaceholderBody: 'Externe Medien (YouTube) sind blockiert, bis du sie erlaubst.',
        videoPlaceholderCta: 'Video laden',
      },
    };

    return COPY[lang] || COPY.en;
  }

  function readConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return { analytics: !!parsed.analytics, externalMedia: !!parsed.externalMedia };
    } catch {
      return null;
    }
  }

  function writeConsent(next) {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ analytics: !!next.analytics, externalMedia: !!next.externalMedia, ts: Date.now() })
      );
    } catch {
      // ignore
    }
  }

  function ensureGa4Loaded() {
    if (!GA4_ID) return;
    if (window.__cat_ga4_loaded) return;
    window.__cat_ga4_loaded = true;

    var ext = document.createElement('script');
    ext.async = true;
    ext.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(ext);

    var inline = document.createElement('script');
    inline.text =
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','" +
      GA4_ID +
      "',{anonymize_ip:true});";
    document.head.appendChild(inline);
  }

  function safeText(input, maxLen) {
    var s = String(input || '').replace(/\s+/g, ' ').trim();
    if (!s) return '';
    var n = Number(maxLen || 0);
    if (!Number.isFinite(n) || n <= 0) n = 120;
    return s.length > n ? s.slice(0, n) : s;
  }

  function getVerticalFromPathname(pathname) {
    var p = String(pathname || '/');
    var lower = p.toLowerCase();

    if (lower.indexOf('invideo') !== -1) return 'invideo';
    if (lower.indexOf('akool') !== -1) return 'akool';

    if (
      lower === '/blog' ||
      lower.indexOf('/blog/') === 0 ||
      lower.indexOf('/fr/blog/') === 0 ||
      lower.indexOf('/es/blog/') === 0 ||
      lower.indexOf('/de/blog/') === 0
    ) {
      return 'blog';
    }

    if (
      lower === '/tools' ||
      lower.indexOf('/tools/') === 0 ||
      lower.indexOf('/fr/tools/') === 0 ||
      lower.indexOf('/es/tools/') === 0 ||
      lower.indexOf('/de/tools/') === 0
    ) {
      return 'tools';
    }

    if (lower.indexOf('privacy') !== -1 || lower.indexOf('confidentialite') !== -1) return 'privacy';
    if (lower.indexOf('legal') !== -1 || lower.indexOf('mentions-legales') !== -1) return 'legal';

    return 'other';
  }

  function isAffiliateLink(a) {
    if (!a) return false;
    var rel = String(a.getAttribute('rel') || '').toLowerCase();
    if (rel.indexOf('sponsored') !== -1) return true;
    if (a.getAttribute('data-affiliate-product')) return true;
    return false;
  }

  function installAffiliateClickHook() {
    if (window.__hpl_affiliate_hooked) return;
    window.__hpl_affiliate_hooked = true;

    document.addEventListener(
      'click',
      function (e) {
        try {
          var target = e && e.target ? e.target : null;
          if (!target) return;

          var a = target.closest ? target.closest('a') : null;
          if (!a) return;
          if (!isAffiliateLink(a)) return;

          var consent = readConsent();
          if (!consent || !consent.analytics) return;

          ensureGa4Loaded();
          if (typeof window.gtag !== 'function') return;

          var href = a.getAttribute('href') || '';
          if (!href) return;

          var url = null;
          try {
            url = new URL(href, window.location.href);
          } catch {
            return;
          }

          var path = window.location && window.location.pathname ? window.location.pathname : '/';
          var product = a.getAttribute('data-affiliate-product') || '';

          window.gtag('event', 'affiliate_click', {
            link_url: url.toString(),
            link_domain: url.hostname || '',
            link_text: safeText(a.textContent || '', 80),
            affiliate_product: safeText(product, 40),
            page_path: path,
            page_lang: getLangFromPathname(path),
            vertical: getVerticalFromPathname(path),
          });
        } catch {
          // ignore
        }
      },
      true
    );
  }

  function ensureCookieUi(copy) {
    var banner = document.getElementById('cookie-banner');
    var modal = document.getElementById('cookie-modal');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', copy.cookieAria);
      banner.hidden = true;
      banner.innerHTML =
        '<div class="cookie-content">' +
        '<p><strong data-cookie-title></strong> <span data-cookie-text></span></p>' +
        '<div class="cookie-actions">' +
        '<button type="button" class="btn-secondary" data-cookie-action="reject"></button>' +
        '<button type="button" class="btn-secondary" data-cookie-action="customize"></button>' +
        '<button type="button" class="btn-primary" data-cookie-action="accept"></button>' +
        '</div>' +
        '</div>';
      document.body.appendChild(banner);
    }

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cookie-modal';
      modal.className = 'cookie-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', copy.cookieSettingsTitle);
      modal.innerHTML =
        '<div class="cookie-modal-inner">' +
        '<div class="cookie-modal-head">' +
        '<strong data-cookie-settings-title></strong>' +
        '<button type="button" class="btn-secondary" data-cookie-close></button>' +
        '</div>' +
        '<div class="muted" data-cookie-settings-subtitle></div>' +
        '<div class="cookie-rows">' +
        '<div class="cookie-row">' +
        '<label><input type="checkbox" checked disabled /> <span data-cookie-necessary></span></label>' +
        '<div class="muted" data-cookie-necessary-desc></div>' +
        '</div>' +
        '<div class="cookie-row">' +
        '<label><input type="checkbox" data-cookie-analytics-input /> <span data-cookie-analytics-label></span></label>' +
        '<div class="muted" data-cookie-analytics-desc></div>' +
        '</div>' +
        '<div class="cookie-row">' +
        '<label><input type="checkbox" data-cookie-external-input /> <span data-cookie-external-label></span></label>' +
        '<div class="muted" data-cookie-external-desc></div>' +
        '</div>' +
        '</div>' +
        '<div class="cookie-actions" style="margin-top:12px">' +
        '<button type="button" class="btn-secondary" data-cookie-close></button>' +
        '<button type="button" data-cookie-save></button>' +
        '</div>' +
        '</div>';
      document.body.appendChild(modal);

      modal.addEventListener('click', function (e) {
        if (e && e.target === modal) closeCookieSettings();
      });
    }

    // Update copy every run (in case SPA navigation changes language).
    banner.setAttribute('aria-label', copy.cookieAria);
    banner.querySelector('[data-cookie-title]').textContent = copy.cookieTitle;
    banner.querySelector('[data-cookie-text]').textContent =
      copy.cookieTextBefore + ' ' + copy.cookieTextAnalytics + ' ' + copy.cookieTextAnd + ' ' + copy.cookieTextExternal;
    banner.querySelector('[data-cookie-action="reject"]').textContent = copy.rejectAll;
    banner.querySelector('[data-cookie-action="customize"]').textContent = copy.customize;
    banner.querySelector('[data-cookie-action="accept"]').textContent = copy.acceptAll;

    modal.setAttribute('aria-label', copy.cookieSettingsTitle);
    modal.querySelector('[data-cookie-settings-title]').textContent = copy.cookieSettingsTitle;
    var closeBtns = modal.querySelectorAll('[data-cookie-close]');
    for (var i = 0; i < closeBtns.length; i++) closeBtns[i].textContent = copy.close;
    modal.querySelector('[data-cookie-save]').textContent = copy.save;
    modal.querySelector('[data-cookie-settings-subtitle]').textContent = copy.cookieSettingsSubtitle;
    modal.querySelector('[data-cookie-necessary]').textContent = copy.necessary;
    modal.querySelector('[data-cookie-necessary-desc]').textContent = copy.necessaryDesc;
    modal.querySelector('[data-cookie-analytics-label]').textContent = copy.analytics;
    modal.querySelector('[data-cookie-analytics-desc]').textContent = copy.analyticsDesc;
    modal.querySelector('[data-cookie-external-label]').textContent = copy.externalMedia;
    modal.querySelector('[data-cookie-external-desc]').textContent = copy.externalMediaDesc;

    // One-time event bindings
    if (banner.getAttribute('data-cookie-bound') !== '1') {
      banner.setAttribute('data-cookie-bound', '1');
      banner.addEventListener('click', function (e) {
        var t = e && e.target ? e.target : null;
        var action = t && t.getAttribute ? t.getAttribute('data-cookie-action') : '';
        if (!action) return;
        if (action === 'accept') {
          var c1 = { analytics: true, externalMedia: true };
          writeConsent(c1);
          hideCookieBanner();
          applyConsent(c1);
          return;
        }
        if (action === 'reject') {
          var c2 = { analytics: false, externalMedia: false };
          writeConsent(c2);
          hideCookieBanner();
          applyConsent(c2);
          return;
        }
        if (action === 'customize') {
          openCookieSettings();
        }
      });
    }

    if (modal.getAttribute('data-cookie-bound') !== '1') {
      modal.setAttribute('data-cookie-bound', '1');
      modal.addEventListener('click', function (e) {
        var t = e && e.target ? e.target : null;
        if (!t || !t.getAttribute) return;
        if (t.hasAttribute('data-cookie-close')) closeCookieSettings();
        if (t.hasAttribute('data-cookie-save')) saveCookieSettings();
      });
      document.addEventListener('keydown', function (e) {
        if (e && e.key === 'Escape') closeCookieSettings();
      });
    }
  }

  function showCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.hidden = false;
    try {
      requestAnimationFrame(function () {
        banner.classList.add('show');
      });
    } catch {
      banner.classList.add('show');
    }
  }

  function hideCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.classList.remove('show');
    setTimeout(function () {
      banner.hidden = true;
    }, 300);
  }

  function openCookieSettings() {
    var modal = document.getElementById('cookie-modal');
    if (!modal) return;

    var consent = readConsent() || { analytics: false, externalMedia: false };
    var a = modal.querySelector('[data-cookie-analytics-input]');
    var x = modal.querySelector('[data-cookie-external-input]');
    if (a) a.checked = !!consent.analytics;
    if (x) x.checked = !!consent.externalMedia;

    modal.setAttribute('data-open', '1');
  }

  function closeCookieSettings() {
    var modal = document.getElementById('cookie-modal');
    if (!modal) return;
    modal.removeAttribute('data-open');
  }

  function saveCookieSettings() {
    var modal = document.getElementById('cookie-modal');
    if (!modal) return;

    var a = modal.querySelector('[data-cookie-analytics-input]');
    var x = modal.querySelector('[data-cookie-external-input]');
    var next = { analytics: !!(a && a.checked), externalMedia: !!(x && x.checked) };
    writeConsent(next);
    hideCookieBanner();
    closeCookieSettings();
    applyConsent(next);
  }

  function buildYouTubeUrl(id) {
    return (
      'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(String(id || '')) +
      '?rel=0&modestbranding=1&playsinline=1'
    );
  }

  function renderYouTubeIframe(el, id, title) {
    el.textContent = '';
    el.classList.add('card');

    var iframe = document.createElement('iframe');
    iframe.className = 'video-embed';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.src = buildYouTubeUrl(id);
    iframe.title = title || 'YouTube video';
    el.appendChild(iframe);
  }

  function renderYouTubePlaceholder(el, copy, thumb, title) {
    el.textContent = '';
    el.classList.add('card');

    var wrap = document.createElement('div');
    wrap.className = 'video-placeholder';

    var t = safeText(thumb, 500);
    if (t) {
      var img = document.createElement('img');
      img.className = 'video-thumb';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = safeText(title, 120) || 'Video thumbnail';
      img.src = t;
      wrap.appendChild(img);
    }

    var strong = document.createElement('strong');
    strong.textContent = copy.videoPlaceholderTitle;
    wrap.appendChild(strong);

    var body = document.createElement('div');
    body.className = 'muted';
    body.textContent = copy.videoPlaceholderBody;
    wrap.appendChild(body);

    var actions = document.createElement('div');
    actions.className = 'video-actions';

    var manage = document.createElement('button');
    manage.type = 'button';
    manage.className = 'btn-secondary';
    manage.textContent = copy.manageCookies;
    manage.addEventListener('click', openCookieSettings);

    var load = document.createElement('button');
    load.type = 'button';
    load.textContent = copy.videoPlaceholderCta;
    load.addEventListener('click', function () {
      var next = readConsent() || { analytics: false, externalMedia: false };
      next.externalMedia = true;
      writeConsent(next);
      hideCookieBanner();
      applyConsent(next);
    });

    actions.appendChild(manage);
    actions.appendChild(load);
    wrap.appendChild(actions);
    el.appendChild(wrap);
  }

  function enhanceYouTubeEmbeds(consent, copy) {
    var nodes = document.querySelectorAll('[data-youtube-id]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var id = el.getAttribute('data-youtube-id') || '';
      if (!id) continue;
      var title = el.getAttribute('data-youtube-title') || '';
      var thumb = el.getAttribute('data-youtube-thumb') || '';
      var mode = consent && consent.externalMedia ? 'iframe' : 'placeholder';
      if (el.getAttribute('data-video-mode') === mode) continue;
      el.setAttribute('data-video-mode', mode);

      if (mode === 'iframe') renderYouTubeIframe(el, id, title);
      else renderYouTubePlaceholder(el, copy, thumb, title);
    }
  }

  function applyConsent(consent) {
    var copy = getCopy();
    if (consent && consent.analytics) ensureGa4Loaded();
    enhanceYouTubeEmbeds(consent || { analytics: false, externalMedia: false }, copy);
  }

  function normalizePrefix(prefix) {
    var p = String(prefix || '').trim();
    if (!p) return '';
    p = p.replace(/^\/+/, '');
    if (p.startsWith('images/')) p = p.slice('images/'.length);
    if (p.startsWith('/images/')) p = p.slice('/images/'.length);
    return p;
  }

  function buildImageUrl(prefix, n) {
    var p = normalizePrefix(prefix);
    return '/images/' + p + String(n) + '.jpg';
  }

  function formatAlt(template, n) {
    var t = String(template || '').trim();
    if (!t) return 'Photo ' + String(n);
    return t.replace(/\{n\}/g, String(n));
  }

  function findRepresentativeImageSrc(galleryEl, prefix) {
    var search = '/images/' + normalizePrefix(prefix);
    var sib = galleryEl.previousElementSibling;

    while (sib) {
      var imgs = sib.querySelectorAll('img');
      for (var i = imgs.length - 1; i >= 0; i--) {
        var src = imgs[i].getAttribute('src') || '';
        if (src.indexOf(search) !== -1) return src;
      }
      sib = sib.previousElementSibling;
    }

    return '';
  }

  function hideRepresentativeImageBlock(galleryEl, prefix) {
    var search = '/images/' + normalizePrefix(prefix);
    var sib = galleryEl.previousElementSibling;

    while (sib) {
      var img = sib.querySelector('img');
      if (img) {
        var src = img.getAttribute('src') || '';
        if (src.indexOf(search) !== -1) {
          var wrapper = img.closest('[aria-hidden="true"]');
          (wrapper || img).style.display = 'none';
          return;
        }
      }
      sib = sib.previousElementSibling;
    }
  }

  function getInitialIndex(prefix, fallbackSrc) {
    var p = normalizePrefix(prefix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('/images/' + p + '(\\d+)\\.jpg(?:[?#].*)?$', 'i');
    var m = re.exec(String(fallbackSrc || ''));
    var n = m ? Number(m[1]) : 1;
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }

  function enhanceGallery(galleryEl) {
    if (!galleryEl || galleryEl.getAttribute('data-gallery-ready') === '1') return;

    var prefix = galleryEl.getAttribute('data-carousel-prefix') || '';
    var count = Number(galleryEl.getAttribute('data-carousel-count') || '0');
    var altTemplate = galleryEl.getAttribute('data-carousel-alt') || 'Photo {n}';

    if (!prefix || !Number.isFinite(count) || count < 2) return;

    var headRow = galleryEl.firstElementChild;
    var carouselRoot = headRow ? headRow.nextElementSibling : null;
    var paginationRoot = carouselRoot ? carouselRoot.nextElementSibling : null;

    if (!carouselRoot) return;

    var prevBtn = headRow ? headRow.querySelector('[data-carousel="prev"]') : null;
    var nextBtn = headRow ? headRow.querySelector('[data-carousel="next"]') : null;

    // Use any existing nearby image as the initial selection (and hide it to prevent duplicates).
    var representativeSrc = findRepresentativeImageSrc(galleryEl, prefix);
    var initialIndex = getInitialIndex(prefix, representativeSrc);
    if (initialIndex > count) initialIndex = 1;

    hideRepresentativeImageBlock(galleryEl, prefix);

    galleryEl.classList.add('card', 'gallery-card');
    galleryEl.setAttribute('data-gallery-ready', '1');

    if (headRow) headRow.className = 'gallery-head';
    if (prevBtn) prevBtn.className = 'gallery-nav';
    if (nextBtn) nextBtn.className = 'gallery-nav';

    var body = document.createElement('div');
    body.className = 'gallery-body';

    var mainBtn = document.createElement('button');
    mainBtn.type = 'button';
    mainBtn.className = 'gallery-main';
    mainBtn.setAttribute('aria-label', 'Open full size');

    var mainImg = document.createElement('img');
    mainImg.decoding = 'async';
    mainImg.loading = 'eager';
    mainImg.alt = formatAlt(altTemplate, initialIndex);
    mainImg.src = buildImageUrl(prefix, initialIndex);
    mainBtn.appendChild(mainImg);

    var thumbs = document.createElement('div');
    thumbs.className = 'gallery-thumbs';
    thumbs.setAttribute('role', 'list');

    var thumbButtons = [];
    var current = initialIndex;

    function setCurrent(next, opts) {
      if (!Number.isFinite(next)) return;
      var n = next;
      if (n < 1) n = count;
      if (n > count) n = 1;
      current = n;

      mainImg.src = buildImageUrl(prefix, n);
      mainImg.alt = formatAlt(altTemplate, n);

      for (var i = 0; i < thumbButtons.length; i++) {
        thumbButtons[i].setAttribute('aria-pressed', i + 1 === n ? 'true' : 'false');
      }

      if (!opts || !opts.silentScroll) {
        var active = thumbButtons[n - 1];
        if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }

    function openFull() {
      try {
        window.open(mainImg.src, '_blank', 'noopener,noreferrer');
      } catch {
        window.location.href = mainImg.src;
      }
    }

    mainBtn.addEventListener('click', openFull);

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        setCurrent(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        setCurrent(current + 1);
      });
    }

    for (var i = 1; i <= count; i++) {
      (function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gallery-thumb';
        b.setAttribute('aria-label', 'Photo ' + String(n));
        b.setAttribute('aria-pressed', n === initialIndex ? 'true' : 'false');

        var img = document.createElement('img');
        img.decoding = 'async';
        img.loading = 'lazy';
        img.alt = formatAlt(altTemplate, n);
        img.src = buildImageUrl(prefix, n);
        b.appendChild(img);

        b.addEventListener('click', function () {
          setCurrent(n);
        });

        b.addEventListener('keydown', function (e) {
          if (!e) return;
          var key = e.key || '';
          if (key === 'ArrowLeft' || key === 'ArrowUp') {
            e.preventDefault();
            setCurrent(current - 1);
            thumbButtons[current - 1].focus();
          }
          if (key === 'ArrowRight' || key === 'ArrowDown') {
            e.preventDefault();
            setCurrent(current + 1);
            thumbButtons[current - 1].focus();
          }
        });

        thumbs.appendChild(b);
        thumbButtons.push(b);
      })(i);
    }

    body.appendChild(mainBtn);
    body.appendChild(thumbs);

    carouselRoot.textContent = '';
    carouselRoot.appendChild(body);

    if (paginationRoot) paginationRoot.style.display = 'none';

    setCurrent(initialIndex, { silentScroll: true });
  }

  function enhanceGalleries() {
    var galleries = document.querySelectorAll('[data-carousel-prefix][data-carousel-count]');
    for (var i = 0; i < galleries.length; i++) enhanceGallery(galleries[i]);
  }

  function normalizeSearchText(input) {
    return String(input || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenizeQuery(q) {
    var s = normalizeSearchText(q);
    return s ? s.split(' ') : [];
  }

  function readBlogQueryFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      return params.get('q') || '';
    } catch {
      return '';
    }
  }

  function applyBlogSearch(tokens) {
    var cards = document.querySelectorAll('[data-blog-card]');
    if (!cards || !cards.length) return;

    var want = Array.isArray(tokens) ? tokens.filter(Boolean) : [];
    var any = false;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var hay = normalizeSearchText((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || ''));
      var ok = true;
      for (var t = 0; t < want.length; t++) {
        if (hay.indexOf(want[t]) === -1) {
          ok = false;
          break;
        }
      }
      card.style.display = ok ? '' : 'none';
      if (ok) any = true;
    }

    var empty = document.querySelector('[data-blog-empty]');
    if (empty) empty.hidden = any;
  }

  function enhanceBlogSearch() {
    var input = document.querySelector('[data-blog-search]');
    if (!input) return;

    var cards = document.querySelectorAll('[data-blog-card]');
    if (!cards || !cards.length) return;

    if (input.getAttribute('data-blog-bound') !== '1') {
      input.setAttribute('data-blog-bound', '1');
      input.addEventListener('input', function () {
        applyBlogSearch(tokenizeQuery(input.value || ''));
      });
    }

    var q = readBlogQueryFromUrl();
    if (q && String(input.value || '') !== String(q)) input.value = q;
    applyBlogSearch(tokenizeQuery(input.value || ''));
  }

  function enhanceScrollAnimations() {
    var nodes = document.querySelectorAll('[data-animate]');
    if (!nodes || !nodes.length) return;

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || !el.classList) continue;
      if (el.classList.contains('animate')) continue;
      el.classList.add('animate');
    }
  }

  function bindManageCookiesLink() {
    var links = document.querySelectorAll('[data-manage-cookies]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.getAttribute('data-cookie-bound') === '1') continue;
      link.setAttribute('data-cookie-bound', '1');
      link.addEventListener('click', function (e) {
        if (e && e.preventDefault) e.preventDefault();
        openCookieSettings();
      });
    }
  }

  function run() {
    var copy = getCopy();
    ensureCookieUi(copy);
    bindManageCookiesLink();

    var consent = readConsent();
    if (!consent) {
      showCookieBanner();
      consent = { analytics: false, externalMedia: false };
    } else {
      hideCookieBanner();
    }

    applyConsent(consent);
    enhanceGalleries();
    enhanceBlogSearch();
    enhanceScrollAnimations();
  }

  function installSpaNavigationHook() {
    if (window.__hpl_nav_hooked) return;
    window.__hpl_nav_hooked = true;

    function scheduleRun() {
      window.setTimeout(run, 0);
    }

    var _push = history.pushState;
    history.pushState = function () {
      _push.apply(this, arguments);
      scheduleRun();
    };
    var _replace = history.replaceState;
    history.replaceState = function () {
      _replace.apply(this, arguments);
      scheduleRun();
    };
    window.addEventListener('popstate', scheduleRun);
  }

  installSpaNavigationHook();
  installAffiliateClickHook();

  function scheduleInitialRuns() {
    run();
    window.setTimeout(run, 50);
    window.setTimeout(run, 250);
    window.setTimeout(run, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleInitialRuns);
  else scheduleInitialRuns();

  window.addEventListener('load', function () {
    window.setTimeout(run, 0);
  });
})();
