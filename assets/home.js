// Home only: data-flow background + arrival animation (once per browser session)
(function () {
  const Flow = (() => {
    const cv = document.getElementById('flow'), mask = document.getElementById('flow-mask'), ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W=0,H=0,raf=null,nodes=[],edges=[],pk=[],running=false,showLabels=true;
    const L = {
      fr:{site:'Site web',app:'App',crm:'CRM',ads:'Médias',gtm:'GTM',sgtm:'Server-side',bq:'BigQuery',clean:'Nettoyage',model:'Modèle',dash:'Dashboards',ga4:'GA4',dec:'Décisions'},
      en:{site:'Website',app:'App',crm:'CRM',ads:'Media',gtm:'GTM',sgtm:'Server-side',bq:'BigQuery',clean:'Cleaning',model:'Model',dash:'Dashboards',ga4:'GA4',dec:'Decisions'}};
    const layout = [['site',.05,.20],['app',.11,.40],['crm',.05,.60],['ads',.12,.80],['gtm',.22,.30],['sgtm',.23,.66],['bq',.50,.95],
                    ['clean',.77,.32],['model',.78,.68],['dash',.94,.20],['ga4',.90,.46],['dec',.95,.76]];
    const E = [['site','gtm'],['app','gtm'],['crm','sgtm'],['ads','sgtm'],['gtm','sgtm'],['gtm','bq'],['sgtm','bq'],['bq','clean'],['bq','model'],['clean','dash'],['clean','ga4'],['model','ga4'],['model','dec'],['dash','dec']];
    function size(){
      const main = cv.parentElement, card = document.querySelector('#home .product');
      if (!card || !card.offsetParent) return;
      const DPR = Math.min(2, devicePixelRatio||1);
      W = main.clientWidth;
      H = Math.max(360, card.getBoundingClientRect().top - main.getBoundingClientRect().top + 24);
      cv.style.height = mask.style.height = H + 'px';
      cv.width = W*DPR; cv.height = H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
      showLabels = W >= 900;
      const by = {};
      nodes = layout.map(([id,x,y]) => (by[id] = {id, x:x*W, y:y*H}));
      edges = E.map(([a,b]) => [by[a], by[b]]);
    }
    function point(a,b,t){ const mx=(a.x+b.x)/2,u=1-t; return [u*u*u*a.x+3*u*u*t*mx+3*u*t*t*mx+t*t*t*b.x, u*u*u*a.y+3*u*u*t*a.y+3*u*t*t*b.y+t*t*t*b.y]; }
    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.lineWidth = 1;
      for (const [a,b] of edges){ const mx=(a.x+b.x)/2; ctx.strokeStyle='rgba(161,161,170,.15)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.bezierCurveTo(mx,a.y,mx,b.y,b.x,b.y); ctx.stroke(); }
      if (!reduce && Math.random() < .1) pk.push({e:edges[Math.floor(Math.random()*edges.length)], t:0, s:.005+Math.random()*.006});
      for (let i=pk.length-1;i>=0;i--){
        const p=pk[i]; p.t+=p.s; if (p.t>=1){ pk.splice(i,1); continue; }
        const [x,y]=point(p.e[0],p.e[1],p.t), g=ctx.createRadialGradient(x,y,0,x,y,6);
        g.addColorStop(0,'rgba(96,165,250,.85)'); g.addColorStop(1,'rgba(96,165,250,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,6,0,7); ctx.fill();
      }
      const lab = L[document.documentElement.dataset.lang] || L.fr;
      ctx.font='11px Inter, system-ui, sans-serif'; ctx.textAlign='center';
      for (const n of nodes){
        ctx.fillStyle='#0a0a0a'; ctx.strokeStyle='rgba(161,161,170,.38)'; ctx.beginPath(); ctx.arc(n.x,n.y,4.5,0,7); ctx.fill(); ctx.stroke();
        if (showLabels){ ctx.fillStyle='rgba(161,161,170,.5)'; ctx.fillText(lab[n.id], n.x, n.y+20); }
      }
    }
    function loop(){ draw(); raf = (running && !reduce && !document.hidden) ? requestAnimationFrame(loop) : null; }
    addEventListener('resize', () => { if (running){ size(); if (!raf) loop(); } });
    document.addEventListener('visibilitychange', () => { if (running && !document.hidden && !raf) loop(); });
    return {
      start(){ running = true; requestAnimationFrame(() => { size(); if (!raf) loop(); }); },
      stop(){ running = false; if (raf) cancelAnimationFrame(raf); raf = null; }
    };
  })();


  let revealed = false;
  function revealConsole(){
    if (revealed) return; revealed = true;
    let seen = false; try { seen = sessionStorage.getItem('intro_seen') === '1'; sessionStorage.setItem('intro_seen', '1'); } catch (e) {}
    if (seen) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('intro');
    const vals = [...document.querySelectorAll('.feed .val > span')];
    vals.forEach(sp => { sp.dataset.t = sp.textContent; if (!reduce) sp.textContent = ''; });
    if (!reduce) {
      let t = 1000;
      document.querySelectorAll('.feed .row').forEach(row => {
        const spans = row.querySelectorAll('.val > span');
        const len = Math.max(...[...spans].map(x => x.dataset.t.length));
        const dur = Math.min(1100, len * 14);
        setTimeout(() => {
          spans.forEach(sp => sp.classList.add('caret'));
          const start = performance.now();
          const step = now => {
            const p = Math.min(1, (now - start) / dur);
            spans.forEach(sp => sp.textContent = sp.dataset.t.slice(0, Math.floor(sp.dataset.t.length * p)));
            if (p < 1) requestAnimationFrame(step); else spans.forEach(sp => sp.classList.remove('caret'));
          };
          requestAnimationFrame(step);
        }, t);
        t += dur + 140;
      });
      document.querySelectorAll('.fact b').forEach(b => {
        const target = b.textContent.trim(); const num = parseInt(target.replace(/\D/g,''),10); const suffix = target.replace(/[0-9]/g,'');
        if (isNaN(num)) return;
        b.textContent = '0'+suffix;
        setTimeout(() => {
          const start = performance.now(), dur = 1200;
          const step = now => { const p = Math.min(1,(now-start)/dur); const e = 1-Math.pow(1-p,3); b.textContent = Math.round(num*e)+suffix; if (p<1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }, 700);
      });
    }
  }
  revealConsole();
  Flow.start();
})();
