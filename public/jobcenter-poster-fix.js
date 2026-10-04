/* WDFOX Jobcenter poster and evidence fix */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20%E2%80%93%20und%20dann_de.png';
  var FACEBOOK_URL = 'https://www.facebook.com/photo?fbid=980105415133071&set=a.858080437335570';
  var POSTFACH_1222_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2012_22.pdf';
  var POSTFACH_1430_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2014_30.1.pdf';

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

  async function loadPdfText(target, pdfUrl){
    if (target.getAttribute('data-loaded') === '1') return;
    target.textContent = 'Nachricht wird geladen ...';
    try {
      var pdfjs = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      var response = await fetch(pdfUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('PDF konnte nicht geladen werden (' + response.status + ')');
      var buffer = await response.arrayBuffer();
      var pdf = await pdfjs.getDocument({ data: buffer }).promise;
      var allLines = [];
      for (var pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        var page = await pdf.getPage(pageNo);
        var content = await page.getTextContent();
        var grouped = [];
        content.items.forEach(function(item){
          var y = item.transform && item.transform[5] || 0;
          var x = item.transform && item.transform[4] || 0;
          var line = grouped.find(function(candidate){ return Math.abs(candidate.y - y) < 2.5; });
          if (!line) {
            line = { y: y, items: [] };
            grouped.push(line);
          }
          line.items.push({ x: x, text: item.str || '' });
        });
        grouped.sort(function(a,b){ return b.y - a.y; });
        grouped.forEach(function(line){
          var text = line.items.sort(function(a,b){ return a.x - b.x; }).map(function(item){ return item.text; }).join(' ').replace(/\s+/g, ' ').trim();
          if (text) allLines.push(text);
        });
      }

      var start = allLines.findIndex(function(line){ return /^Sehr geehrte Damen und Herren/i.test(line); });
      var lines = start >= 0 ? allLines.slice(start) : allLines;
      target.textContent = '';
      var bufferLines = [];

      function flush(){
        var text = bufferLines.join(' ').replace(/\s+/g, ' ').trim();
        bufferLines = [];
        if (!text) return;
        var p = document.createElement('p');
        p.textContent = text;
        p.style.margin = '0 0 14px';
        p.style.textAlign = 'justify';
        p.style.textJustify = 'inter-word';
        p.style.hyphens = 'auto';
        target.appendChild(p);
      }

      lines.forEach(function(line){
        var text = String(line || '').replace(/\s+/g, ' ').trim();
        if (!text) { flush(); return; }
        if (/^Mit freundlichen Grüßen/i.test(text) && bufferLines.length) flush();
        bufferLines.push(text);
        if (/[.!?:]$/.test(text) || /^Mit freundlichen Grüßen/i.test(text) || /^Peter Ferenc$/i.test(text)) flush();
      });
      flush();
      target.setAttribute('data-loaded', '1');
    } catch (error) {
      target.textContent = 'Die Nachricht konnte im Browser nicht automatisch aus dem PDF gelesen werden. Bitte öffnen Sie das Original-PDF über die linke Schaltfläche.\n\nTechnischer Hinweis: ' + (error && error.message ? error.message : String(error));
    }
  }

  function addPostfachPdfCard(config){
    if (document.getElementById(config.id)) return true;

    var card = document.createElement('section');
    card.id = config.id;
    card.setAttribute('aria-label', 'Postfachnachricht vom ' + config.date + ' um ' + config.time);
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
    title.textContent = '📨 NEU - Postfachnachricht vom ' + config.date + ' | ' + config.time;

    var note = document.createElement('div');
    note.style.marginBottom = '12px';
    note.textContent = 'Original-PDF der am ' + config.date + ' um ' + config.time + ' Uhr an das Jobcenter übermittelten Postfachnachricht.';

    var controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.width = '100%';
    controls.style.border = '1px solid #cfcfcf';
    controls.style.borderRadius = '8px';
    controls.style.overflow = 'hidden';
    controls.style.background = '#fff';
    controls.style.boxSizing = 'border-box';

    var pdfButton = document.createElement('a');
    pdfButton.href = config.pdfUrl;
    pdfButton.target = '_blank';
    pdfButton.rel = 'noopener noreferrer';
    pdfButton.style.flex = '1 1 50%';
    pdfButton.style.display = 'flex';
    pdfButton.style.alignItems = 'center';
    pdfButton.style.justifyContent = 'center';
    pdfButton.style.padding = '12px 14px';
    pdfButton.style.boxSizing = 'border-box';
    pdfButton.style.fontWeight = '700';
    pdfButton.style.color = '#111';
    pdfButton.style.textDecoration = 'none';
    pdfButton.style.background = '#fff';
    pdfButton.textContent = '📄 Original-PDF öffnen';

    var browserButton = document.createElement('button');
    browserButton.type = 'button';
    browserButton.style.flex = '1 1 50%';
    browserButton.style.display = 'flex';
    browserButton.style.alignItems = 'center';
    browserButton.style.justifyContent = 'center';
    browserButton.style.padding = '12px 14px';
    browserButton.style.boxSizing = 'border-box';
    browserButton.style.border = '0';
    browserButton.style.borderLeft = '1px solid #cfcfcf';
    browserButton.style.background = '#fff';
    browserButton.style.color = '#111';
    browserButton.style.font = 'inherit';
    browserButton.style.fontWeight = '700';
    browserButton.style.cursor = 'pointer';
    browserButton.textContent = 'Nachricht im Browser anzeigen';
    browserButton.setAttribute('aria-expanded', 'false');
    browserButton.setAttribute('aria-controls', config.id + '-browser');

    var browserView = document.createElement('div');
    browserView.id = config.id + '-browser';
    browserView.style.display = 'none';
    browserView.style.marginTop = '14px';
    browserView.style.background = '#fff';
    browserView.style.border = '1px solid #d9d9d9';
    browserView.style.borderRadius = '8px';
    browserView.style.overflow = 'hidden';

    var meta = document.createElement('div');
    meta.style.padding = '14px 16px';
    meta.style.borderBottom = '1px solid #e4e4e4';
    meta.style.background = '#f5f7fa';
    meta.innerHTML = '<strong>Datum:</strong> ' + config.date + ' | ' + config.time + '<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut';

    var textView = document.createElement('div');
    textView.id = config.id + '-text';
    textView.style.padding = '18px 6px';
    textView.style.lineHeight = '1.6';
    textView.style.minHeight = '220px';
    textView.style.background = '#fff';
    textView.style.textAlign = 'justify';
    textView.style.textJustify = 'inter-word';

    browserButton.addEventListener('click', function(){
      var open = browserView.style.display !== 'none';
      browserView.style.display = open ? 'none' : 'block';
      browserButton.setAttribute('aria-expanded', open ? 'false' : 'true');
      browserButton.textContent = open ? 'Nachricht im Browser anzeigen' : 'Nachricht im Browser ausblenden';
      if (!open) loadPdfText(textView, config.pdfUrl);
    });

    controls.appendChild(pdfButton);
    controls.appendChild(browserButton);
    browserView.appendChild(meta);
    browserView.appendChild(textView);
    card.appendChild(title);
    card.appendChild(note);
    card.appendChild(controls);
    card.appendChild(browserView);

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

  function addPostfachCards(){
    addPostfachPdfCard({
      id: 'postfach-2026-10-03-1222',
      date: '03.10.2026',
      time: '12:22',
      pdfUrl: POSTFACH_1222_PDF_URL
    });
    addPostfachPdfCard({
      id: 'postfach-2026-10-03-1430',
      date: '03.10.2026',
      time: '14:30',
      pdfUrl: POSTFACH_1430_PDF_URL
    });
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
    addPostfachCards();
    replacePoster();
    setTimeout(function(){
      addTopFacebookIcon();
      addPostfachCards();
      replacePoster();
    }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
