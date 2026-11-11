// tarteaucitron init + custom ga4consent service (updates Consent Mode and pushes cmp_consent_update)
  tarteaucitron.init({
    "privacyUrl": "",
    "bodyPosition": "bottom",
    "hashtag": "#tarteaucitron",
    "cookieName": "tarteaucitron",
    "orientation": "middle",
    "groupServices": false,
    "showDetailsOnClick": true,
    "serviceDefaultState": "wait",
    "showAlertSmall": false,
    "cookieslist": false,
    "closePopup": false,
    "showIcon": false,
    "adblocker": false,
    "DenyAllCta": true,
    "AcceptAllCta": true,
    "highPrivacy": true,
    "alwaysNeedConsent": false,
    "handleBrowserDNTRequest": false,
    "removeCredit": false,
    "moreInfoLink": true,
    "useExternalCss": false,
    "useExternalJs": false,
    "mandatory": true,
    "mandatoryCta": false,
    "googleConsentMode": false,
    "bingConsentMode": false,
    "softConsentMode": false,
    "partnersList": false
  });
  // Service maison : met à jour Consent Mode v2 ET pousse un événement dataLayer exploitable dans GTM.
  // (googleConsentMode est désactivé pour éviter le second "consent default" envoyé tardivement par tarteaucitron.)
  var tacLastConsent = null;
  function tacConsent(state) {               // one update + one dataLayer event per real change
    if (state === tacLastConsent) return;
    tacLastConsent = state;
    gtag('consent', 'update', { analytics_storage: state });
    window.dataLayer.push({ event: 'cmp_consent_update', analytics_storage: state });
  }
  tarteaucitron.services.ga4consent = {
    "key": "ga4consent",
    "type": "analytic",
    "name": "Google Analytics 4",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "cookies": ["_ga", "_gid", "_gat"],
    "js": function () { tacConsent('granted'); },
    "fallback": function () {
      // also called while the visitor hasn't chosen yet ("wait"): only react to a stored refusal
      var c = decodeURIComponent((document.cookie.match(/(?:^|; )tarteaucitron=([^;]*)/) || [])[1] || '');
      if (/(^|!)ga4consent=false/.test(c)) tacConsent('denied');
    }
  };
  // refusal clicked in the banner or the panel
  document.addEventListener('ga4consent_disallowed', function () { tacConsent('denied'); });
  (tarteaucitron.job = tarteaucitron.job || []).push('ga4consent');
