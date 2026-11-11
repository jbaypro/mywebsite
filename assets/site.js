// Shared behaviour for every page: language, mobile menu, cookie modal lock, contact click tracking
(function () {
  // Language switch
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.lang button');
  function setLang(l){
    root.dataset.lang = l; root.lang = l;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === l)));
    const t = document.body.dataset['title' + (l === 'fr' ? 'Fr' : 'En')]; if (t) document.title = t;
    try { localStorage.setItem('lang', l); } catch(e){}
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  buttons.forEach(b => b.addEventListener('click', () => {
    setLang(b.dataset.set);
    const tacRoot = document.getElementById('tarteaucitronRoot');
    if (tacRoot && tacRoot.classList.contains('tarteaucitronBeforeVisible') && b.dataset.set !== window.tarteaucitronForceLanguage) { location.reload(); return; }
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: 'language_switch', language: b.dataset.set });
  }));
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch(e){}
  if (!saved) saved = (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  setLang(saved);

  // Mobile menu
  const nav = document.querySelector('.top nav'), burger = document.querySelector('.burger');
  burger.addEventListener('click', () => { const open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(open)); });

  // Cookie banner language: tarteaucitron can't switch language live, so reload in the right one
  function setCmpLangAndReload(l, openPanel){
    try { localStorage.setItem('lang', l); if (openPanel) sessionStorage.setItem('tac_open', '1'); } catch (e) {}
    location.reload();
  }
  window.openCookieSettings = function(){
    const lang = document.documentElement.dataset.lang;
    if (lang !== window.tarteaucitronForceLanguage) setCmpLangAndReload(lang, true);
    else tarteaucitron.userInterface.openPanel();
  };
  (function cmpLangUi(){
    let tries = 0;
    const tick = () => {
      const alert = document.getElementById('tarteaucitronAlertBig');
      const ready = alert && window.tarteaucitron && tarteaucitron.userInterface;
      if (!ready) { if (++tries < 100) setTimeout(tick, 100); return; }
      // reopen the settings panel after a language reload
      try { if (sessionStorage.getItem('tac_open')) { sessionStorage.removeItem('tac_open'); tarteaucitron.userInterface.openPanel(); } } catch (e) {}
    };
    tick();
  })();

  // Cookie modal: block the page (mouse + keyboard) until a choice is made
  (function lockUntilChoice(){
    const header = document.querySelector('.top');
    const blocked = () => [document.querySelector('main'), document.querySelector('footer'), header.querySelector('.brand'), header.querySelector('nav'), header.querySelector('.burger')];
    const apply = () => {
      const root = document.getElementById('tarteaucitronRoot');
      const open = !!(root && root.classList.contains('tarteaucitronBeforeVisible'));
      blocked().forEach(el => el && (open ? el.setAttribute('inert', '') : el.removeAttribute('inert')));
      header.classList.toggle('over-cmp', open);
      return root;
    };
    const watch = () => {
      const root = apply();
      if (!root) return setTimeout(watch, 100);
      new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['class'] });
    };
    watch();
  })();

  // Contact clicks (method only)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    const method = h.startsWith('mailto:') ? 'email' : h.includes('linkedin.com') ? 'linkedin' : h.includes('github.com') ? 'github' : null;
    if (!method) return;
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: 'contact_click', contact_method: method, link_location: a.closest('footer') ? 'footer' : 'contact_page' });
  });

})();
