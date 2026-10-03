/* WDFOX Jobcenter poster exact-image fix */
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
    var anchor = document.getElementById('aok-postfach-2026-10-03');
    if (!anchor) {
      anchor = Array.from(document.querySelectorAll('h2')).find(function(el){
        return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise';
      });
    }
    if (!anchor || !anchor.parentNode) return false;

    var card = document.createElement('div');
    card.id = 'postfach-2026-10-03-1222';
    card.className = 'outlook-card';

    var title = document.createElement('div');
    title.className = 'outlook-card-title';
    title.textContent = '📨 Postfachnachricht vom 03.10.2026 | 12:22';

    var note = document.createElement('div');
    note.className = 'outlook-card-note';
    note.textContent = 'Original-PDF der am 03.10.2026 um 12:22 Uhr übermittelten Postfachnachricht.';

    var details = document.createElement('details');
    details.className = 'outlook-details';
    var summary = document.createElement('summary');
    summary.className = 'outlook-summary';
    summary.textContent = '📨 Nachricht / PDF anzeigen';

    var view = document.createElement('div');
    view.className = 'outlook-view';
    var head = document.createElement('div');
    head.className = 'outlook-view-head';
    head.innerHTML = '<div class="outlook-view-subject">Postfachnachricht vom 03.10.2026 | 12:22</div><div class="outlook-view-meta"><strong>Datum:</strong> 03.10.2026 | 12:22<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut</div>';
    var body = document.createElement('div');
    body.className = 'outlook-view-body';
    body.style.whiteSpace = 'normal';
    var link = document.createElement('a');
    link.href = POSTFACH_PDF_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.style.fontWeight = '700';
    link.textContent = '📄 Original-PDF öffnen - postfachnachricht-03.10.2026 12_22.pdf';
    body.appendChild(link);
    view.appendChild(head);
    view.appendChild(body);
    details.appendChild(summary);
    details.appendChild(view);
    card.appendChild(title);
    card.appendChild(note);
    card.appendChild(details);

    anchor.insertAdjacentElement('afterend', card);
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
