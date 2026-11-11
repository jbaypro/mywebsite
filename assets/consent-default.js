// Google Consent Mode v2 — default state, must run before tarteaucitron and GTM
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 800
  });
  var tarteaucitronForceLanguage = (function () {
    try { var l = localStorage.getItem('lang'); if (l === 'fr' || l === 'en') return l; } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  })();
