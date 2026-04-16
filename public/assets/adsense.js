(() => {
  'use strict';

  const initAdsense = () => {
    const ads = document.querySelectorAll('ins.adsbygoogle');
    if (!ads.length) return;

    window.adsbygoogle = window.adsbygoogle || [];

    ads.forEach((ad) => {
      if (ad.getAttribute('data-adsbygoogle-status') === 'done') return;
      try {
        window.adsbygoogle.push({});
      } catch {
        // Ignore errors (e.g. ad blockers).
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdsense);
  } else {
    initAdsense();
  }
})();
