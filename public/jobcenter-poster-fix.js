/* WDFOX Jobcenter poster and evidence fix */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20%E2%80%93%20und%20dann_de.png';
  var FACEBOOK_URL = 'https://www.facebook.com/photo?fbid=980105415133071&set=a.858080437335570';
  var POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2012_22.pdf';

  function styleFacebookIcon(fb, size){
    fb.href = FACEBOOK_URL;
    fb.target = '_blank';
    fb.rel = 'noopener noreferrer';
    fb.setAttribute('aria-label', 'Facebook-Beitrag öffnen');
    fb.title = 'Facebook-Beitrag öffnen';
    fb.style.display = 'inline-flex';
    fb.style.alignItems = 'center';
    fb.style.justifyContent = 'center';
    fb.style.width = size + 'px';
    fb.style.height = size + 'px';
    fb.style.borderRadius = '50%';
    fb.style.background = '#1877F2';
    fb.style.color = '#fff';
    fb.style.fontFamily = 'Arial, Helvetica, sans-serif';
    fb.style.fontSize = Math.round(size * 0.69) + 'px';
    fb.style.fontWeight = '700';
    fb.style.lineHeight = '1';
    fb.style.textDecoration = 'none';
    fb.style.boxShadow = '0 3px 10px rgba(0,0,0,.18)';
    fb.textContent = 'f';
  }

  function addTopFacebookIcon(){
    if (document.getElementById('jobcenter-facebook-top')) return true;
    var title = Array.from(document.querySelectorAll('h1,h2')).find(function(el){
      return (el.textContent || '').indexOf('Antwort auf Ihre Fragen für das Jobcenter') !== -1;
    }) || document.querySelector('h1,h2');
    if (!title) return false;
    var host = title.parentElement || document.body;
    if (window.getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var fb = document.createElement('a');
    fb.id = 'jobcenter-facebook-top';
    styleFacebookIcon(fb, 52);
    fb.style.position = 'absolute';
    fb.style.top = '0';
    fb.style.right = '12px';
    fb.style.zIndex = '20';
    host.appendChild(fb);
    return true;
  }

  function addPostfachPdfCard(){
    if (document.getElementById('postfach-2026-10-03-1222')) return true;

    var card = document.createElement('section');
    card.id = 'postfach-2026-10-03-1222';
    card.setAttribute('aria-label', 'Postfachnachricht vom 03.10.2026 um 12:22');
    card.style.display = 'block';
    card.style.boxSizing = 'border-box';
    card.style.width = '100%';
    card.style.margin = '16px 0';
    card.style.padding = '16px';
    card.style.border = '2px solid #1877F2';
    card.style.borderRadius = '10px';
    card.style.background = '#f7fbff';
    card.style.color = '#111';
    card.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)';

    var title = document.createElement('div');
    title.style.fontWeight = '700';
    title.style.fontSize = '1.05rem';
    title.style.marginBottom = '8px';
    title.textContent = '📨 NEU - Postfachnachricht vom 03.10.2026 | 12:22';

    var note = document.createElement('div');
    note.style.marginBottom = '12px';
    note.textContent = 'Original-PDF der am 03.10.2026 um 12:22 Uhr an das Jobcenter übermittelten Postfachnachricht.';

    var details = document.createElement('details');
    var summary = document.createElement('summary');
    summary.style.cursor = 'pointer';
    summary.style.fontWeight = '700';
    summary.style.padding = '10px 12px';
    summary.style.border = '1px solid #cfcfcf';
    summary.style.borderRadius = '8px';
    summary.style.background = '#fff';
    summary.textContent = '📨 Nachricht / PDF anzeigen';

    var body = document.createElement('div');
    body.style.padding = '14px 0 2px';

    var meta = document.createElement('div');
    meta.style.marginBottom = '14px';
    meta.innerHTML = '<strong>Datum:</strong> 03.10.2026 | 12:22<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut';

    var link = document.createElement('a');
    link.href = POSTFACH_PDF_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'inline-block';
    link.style.padding = '12px 16px';
    link.style.borderRadius = '8px';
    link.style.background = '#111';
    link.style.color = '#fff';
    link.style.textDecoration = 'none';
    link.style.fontWeight = '700';
    link.textContent = '📄 Original-PDF öffnen - postfachnachricht-03.10.2026 12_22.pdf';

    body.appendChild(meta);
    body.appendChild(link);
    details.appendChild(summary);
    details.appendChild(body);
    card.appendChild(title);
    card.appendChild(note);
    card.appendChild(details);

    var heading = Array.from(document.querySelectorAll('h2')).find(function(el){
      return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise';
    });
    if (heading && heading.parentNode) {
      heading.insertAdjacentElement('afterend', card);
    } else {
      var poster = document.getElementById('jobcenter-social-poster-2026-10-03');
      if (poster && poster.parentNode) poster.insertAdjacentElement('beforebegin', card);
      else document.body.appendChild(card);
    }
    return true;
  }

  function replacePoster(){
    var existing = document.getElementById('jobcenter-social-poster-2026-10-03');
    if (existing) existing.remove();
    var poster = document.createElement('section');
    poster.id = 'jobcenter-social-poster-2026-10-03';
    poster.className = 'jobcenter-social-poster';
    poster.setAttribute('aria-label', 'Jahrelange Arbeit - und dann');
    var img = document.createElement('img');
    img.src = POSTER_URL;
    img.alt = 'Jahrelange Arbeit - und dann';
    img.decoding = 'async';
    img.loading = 'eager';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxWidth = '1672px';
    img.style.margin = '0 auto';
    img.style.border = '0';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 3px 16px rgba(0,0,0,.2)';

    var linkWrap = document.createElement('div');
    linkWrap.style.display = 'flex';
    linkWrap.style.justifyContent = 'center';
    linkWrap.style.margin = '18px 0 0';
    var fb = document.createElement('a');
    styleFacebookIcon(fb, 52);
    linkWrap.appendChild(fb);
    poster.appendChild(img);
    poster.appendChild(linkWrap);
    document.body.appendChild(poster);
    return true;
  }

  function run(){
    addTopFacebookIcon();
    addPostfachPdfCard();
    replacePoster();
    setTimeout(function(){
      addTopFacebookIcon();
      addPostfachPdfCard();
      replacePoster();
    }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
