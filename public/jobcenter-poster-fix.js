/* WDFOX Jobcenter poster, evidence and Daniel Freund letter */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20DEUTSCHLAND%E2%80%93%20und%20dann_.png';
  var FACEBOOK_POST_URL = 'https://www.facebook.com/photo?fbid=981014231708856&set=a.858080437335570';
  var FACEBOOK_SHARE_URL = FACEBOOK_POST_URL;
  var EXISTENZ_REFERENCE_FACEBOOK_URL = 'https://www.facebook.com/photo?fbid=980105415133071&set=a.858080437335570';
  var JOBCENTER_PAGE_URL = 'https://www.foxprof.club/jobcenter/';
  var POSTFACH_1222_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2012_22.pdf';
  var POSTFACH_1430_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2014_30.1.pdf';
  var EXISTENZ_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Unverz%C3%BCgliche%20finanzielle%20Sicherung%20meiner%20Existenz_DE.pdf';
  var EXISTENZ_POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-04.10.2026%2015_21_existenz.pdf';
  var GUTSCHEIN_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Gutschein.jpg';
  var FREUND_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Freund%20Daniel_list_SK.pdf';
  var KRANKEN_POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-05.10.2026%2010_16.pdf';
  var KRANKEN_ANHANG_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/DRINGEND%20%E2%80%93%20Existenzsicherung%20Krankenversicherung.pdf';
  var JC_SCHREIBEN_2909_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/20260929_080455_SCHREIBEN.pdf';
  var FREUND_EMAIL_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Text%20tela%20emailu_SK.pdf';
  var FREUND_EMAIL_KRANKEN_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/DRINGEND%20%E2%80%93%20Existenzsicherung%20Krankenversicherung.pdf';
  var FREUND_EMAIL_POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-05.10.2026%2010_16.pdf';
  var REGIONAL_BESCHWERDE_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Beschwerde_Jobcenter_Landkreis_LA_Regionaldirektion%20Bayern_DE_SK.pdf';
  var SOZIALGERICHT_DE_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/15_Sozialgericht_LA_Antrag_auf_einstweilige_Anordnung_DE_v2.pdf';
  var SOZIALGERICHT_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/15_Sozialgericht%20LA_Antrag%20auf%20einstweilige%20Anordnung_SK.pdf';
  var FREUND_WARNUNG_IMAGE_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/16_Freund.jpg';

  async function downloadFile(url, filename){
    try {
      var response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Download fehlgeschlagen (' + response.status + ')');
      var blob = await response.blob();
      var objectUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(objectUrl); }, 1500);
    } catch (error) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  window.downloadFile = downloadFile;
  window.GUTSCHEIN_URL = GUTSCHEIN_URL;
  window.FREUND_SK_PDF_URL = FREUND_SK_PDF_URL;

  function styleFacebookIcon(fb, size){
    fb.href = FACEBOOK_SHARE_URL;
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

  function cleanExistenzPdfText(target){
    if (!target || target.id !== 'existenz-postfach-pdf-text') return;
    Array.from(target.querySelectorAll('p')).forEach(function(p){
      var text = String(p.textContent || '').replace(/\s+/g, ' ').trim();
      if (
        text.indexOf('https://www.facebook.com/photo?') !== -1 ||
        text.indexOf('fbid=980105415133071') !== -1 ||
        text.indexOf('https://www.foxprof.club/jobcenter/') !== -1 ||
        /^1 von 1$/i.test(text)
      ) p.remove();
    });
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
          if (!line) { line = { y: y, items: [] }; grouped.push(line); }
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
        p.style.margin = '0 0 10px';
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
      cleanExistenzPdfText(target);
      target.setAttribute('data-loaded', '1');
    } catch (error) {
      target.textContent = 'Die Nachricht konnte im Browser nicht automatisch aus dem PDF gelesen werden. Bitte öffnen Sie das Original-PDF. Technischer Hinweis: ' + (error && error.message ? error.message : String(error));
    }
  }

  function addPostfachPdfCard(config){
    if (document.getElementById(config.id)) return true;
    var card = document.createElement('section');
    card.id = config.id;
    card.style.cssText = 'display:block;box-sizing:border-box;width:100%;margin:16px 0;padding:16px;border:2px solid #1877F2;border-radius:10px;background:#f7fbff;color:#111;box-shadow:0 2px 8px rgba(0,0,0,.08)';
    var title = document.createElement('div');
    title.style.cssText = 'font-weight:700;font-size:1.05rem;margin-bottom:8px';
    title.textContent = '📨 NEU - Postfachnachricht vom ' + config.date + ' | ' + config.time;
    var note = document.createElement('div');
    note.style.marginBottom = '12px';
    note.textContent = 'Original-PDF der am ' + config.date + ' um ' + config.time + ' Uhr an das Jobcenter übermittelten Postfachnachricht.';
    var controls = document.createElement('div');
    controls.style.cssText = 'display:flex;width:100%;border:1px solid #cfcfcf;border-radius:8px;overflow:hidden;background:#fff;box-sizing:border-box';
    var pdfButton = document.createElement('a');
    pdfButton.href = config.pdfUrl; pdfButton.target = '_blank'; pdfButton.rel = 'noopener noreferrer';
    pdfButton.style.cssText = 'flex:1 1 50%;display:flex;align-items:center;justify-content:center;padding:12px 14px;box-sizing:border-box;font-weight:700;color:#111;text-decoration:none;background:#fff';
    pdfButton.textContent = '📄 Original-PDF öffnen';
    var browserButton = document.createElement('button');
    browserButton.type = 'button';
    browserButton.style.cssText = 'flex:1 1 50%;display:flex;align-items:center;justify-content:center;padding:12px 14px;box-sizing:border-box;border:0;border-left:1px solid #cfcfcf;background:#fff;color:#111;font:inherit;font-weight:700;cursor:pointer';
    browserButton.textContent = 'Nachricht im Browser anzeigen';
    var browserView = document.createElement('div');
    browserView.style.cssText = 'display:none;margin-top:14px;background:#fff;border:1px solid #d9d9d9;border-radius:8px;overflow:hidden';
    var meta = document.createElement('div');
    meta.style.cssText = 'padding:14px 16px;border-bottom:1px solid #e4e4e4;background:#f5f7fa';
    meta.innerHTML = '<strong>Datum:</strong> ' + config.date + ' | ' + config.time + '<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut';
    var textView = document.createElement('div');
    textView.style.cssText = 'padding:18px 6px;line-height:1.45;min-height:220px;background:#fff;text-align:justify;text-justify:inter-word';
    browserButton.addEventListener('click', function(){
      var open = browserView.style.display !== 'none';
      browserView.style.display = open ? 'none' : 'block';
      browserButton.textContent = open ? 'Nachricht im Browser anzeigen' : 'Nachricht im Browser ausblenden';
      if (!open) loadPdfText(textView, config.pdfUrl);
    });
    controls.appendChild(pdfButton); controls.appendChild(browserButton);
    browserView.appendChild(meta); browserView.appendChild(textView);
    card.appendChild(title); card.appendChild(note); card.appendChild(controls); card.appendChild(browserView);
    var heading = Array.from(document.querySelectorAll('h2')).find(function(el){ return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise'; });
    if (heading && heading.parentNode) heading.insertAdjacentElement('afterend', card); else document.body.appendChild(card);
    return true;
  }

  function addPostfachCards(){
    addPostfachPdfCard({ id:'postfach-2026-10-03-1222', date:'03.10.2026', time:'12:22', pdfUrl:POSTFACH_1222_PDF_URL });
    addPostfachPdfCard({ id:'postfach-2026-10-03-1430', date:'03.10.2026', time:'14:30', pdfUrl:POSTFACH_1430_PDF_URL });
  }

  function addExistenzMessage(){
    if (document.getElementById('jobcenter-existenz-message-2026-10-04')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-existenz-message-2026-10-04';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '34px';
    section.innerHTML = `
      <style>
        #jobcenter-existenz-message-2026-10-04 .outlook-view-body{padding:10px 14px!important;display:block!important;white-space:normal!important;line-height:1.32!important}
        #jobcenter-existenz-message-2026-10-04 .outlook-view-body>div:first-child{margin-top:0!important;padding-top:0!important;margin-bottom:2px!important}
        #jobcenter-existenz-message-2026-10-04 [data-wdfox-reference-links="1"]{margin:0 0 2px!important;gap:0!important;line-height:1.2!important}
        #jobcenter-existenz-message-2026-10-04 #existenz-postfach-pdf-text{margin:0 0 2px!important;padding:0!important;line-height:1.25!important}
        #jobcenter-existenz-message-2026-10-04 #existenz-postfach-pdf-text p{margin:0 0 2px!important;padding:0!important;min-height:0!important}
        #jobcenter-existenz-message-2026-10-04 #existenz-postfach-pdf-text p:last-child{margin-bottom:2px!important}
        #jobcenter-existenz-message-2026-10-04 .outlook-view-body>p{margin:0 0 4px!important;padding:0!important;min-height:0!important;line-height:1.28!important}
        #jobcenter-existenz-message-2026-10-04 .outlook-view-body>ul{margin:0 0 5px!important;padding-top:0!important;padding-bottom:0!important;gap:0!important;min-height:0!important}
        #jobcenter-existenz-message-2026-10-04 .outlook-view-body>ul>li{margin:0 0 2px!important;padding-top:0!important;padding-bottom:0!important;min-height:0!important;line-height:1.28!important}
      </style>
      <hr class="evidence-divider">
      <p class="update-date">Aktualisiert am: 04.10.2026 | 15:21</p>
      <h2>Sofortiger Schutz meiner Existenz – Schreiben an das Jobcenter</h2>
      <div class="outlook-card" style="border:2px solid #1877F2;background:#f7fbff">
        <div class="outlook-card-title">📨 Unverzügliche finanzielle Sicherung meiner Existenz und Unterstützung bei der Aufnahme meiner selbständigen Tätigkeit</div>
        <div class="outlook-card-note">Am 04.10.2026 an das Jobcenter Landkreis Landshut übermittelt.</div>
        <details class="outlook-details">
          <summary class="outlook-summary">📄 Schreiben im Browser anzeigen / ausblenden</summary>
          <div class="outlook-view">
            <div class="outlook-view-head"><div class="outlook-view-meta"><strong>Datum:</strong> 04.10.2026 | 15:21<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut<br><strong>Betreff:</strong> Sofortiger Schutz meiner Existenz</div></div>
            <div class="outlook-view-body" style="padding:10px 14px;line-height:1.32;text-align:justify;text-justify:inter-word;hyphens:auto;white-space:normal">
              <div class="existenz-email-intro" style="margin:0;padding:0;line-height:1.28;white-space:normal">
                <div style="font-weight:700;margin:0">postfachnachricht-04.10.2026 15_21</div>
                <p style="margin:0 0 10px">Sehr geehrte Damen und Herren,</p>
                <p style="margin:0">anbei übersende ich Ihnen mein Schreiben zur unverzüglichen finanziellen Sicherung meiner Existenz sowie zur Unterstützung bei der Aufnahme meiner selbständigen Tätigkeit. Ich bitte um sofortige Bearbeitung und um eine schriftliche Bestätigung der darin genannten Maßnahmen und Fristen.</p>
                <p style="margin:0">Mit freundlichen Grüßen</p><p style="margin:0 0 10px">Peter Ferenc</p>
                <div data-wdfox-reference-links="1" style="display:flex;flex-direction:column;align-items:flex-start;gap:0;margin:0;line-height:1.2;white-space:normal">
                  <a href="${JOBCENTER_PAGE_URL}" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline;word-break:break-all">https://www.foxprof.club/jobcenter/</a><a href="${EXISTENZ_REFERENCE_FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline;word-break:break-all">https://www.facebook.com/photo?fbid=980105415133071&amp;set=a.858080437335570</a>
                </div>
                <div style="font-family:monospace;color:#666;overflow:hidden;white-space:nowrap;margin:0">======================================================</div>
                <div style="font-weight:700;margin:0">pdf Anhang:</div>
              </div>
              <p style="margin:0 0 10px">Sehr geehrte Damen und Herren,</p>
              <p style="margin:0">meine Situation ist inzwischen keine Frage weiteren Wartens, weiterer Erklärungen oder der fortlaufenden Ausgabe einzelner Gutscheine mehr. Ich benötige <strong>eine tatsächliche finanzielle Absicherung meiner grundlegenden Lebensbedürfnisse</strong> und zugleich die Mittel, die es mir ermöglichen, so schnell wie möglich durch die geplante selbständige Tätigkeit ein eigenes Einkommen aufzubauen.</p>
              <p style="margin:0 0 4px">Daher erwarte ich vom Jobcenter eine konkrete finanzielle Lösung innerhalb der folgenden Fristen:</p>
              <ul style="padding-left:24px;margin:2px 0 5px">
                <li style="margin-bottom:2px"><strong>am Montag, den 05.10.2026</strong>, fordere ich die Überweisung von <strong>200 € auf mein Konto zur Begleichung aufgelaufener und überfälliger notwendiger Zahlungen</strong>, zusätzlich die <strong>Erstattung der bereits eingereichten Vodafone-Rechnung</strong>, sowie <strong>150 € zur Sicherstellung meiner Ernährung für den Monat Oktober 2026</strong>;</li>
                <li style="margin-bottom:2px"><strong>spätestens am Montag, den 05.10.2026</strong>, erwarte ich außerdem, dass mein Krankenversicherungsschutz bei der <strong>AOK Bayern</strong> ordnungsgemäß sichergestellt ist, damit ich aufgrund meiner derzeitigen Zahn- und Gesundheitsprobleme ohne weitere Verzögerung die notwendige medizinische und zahnärztliche Versorgung in Anspruch nehmen kann;</li>
                <li style="margin-bottom:2px"><strong>spätestens am Mittwoch, den 07.10.2026</strong>, fordere ich die Auszahlung von <strong>1.000 € für September 2026</strong>, also für den Zeitraum, in dem ich ohne Einkommen war und auf eine tatsächliche Sicherung meiner grundlegenden Lebensbedürfnisse gewartet habe;</li>
                <li><strong>spätestens bis Freitag, den 09.10.2026</strong>, fordere ich die Bereitstellung von <strong>5.000 € für den Aufbau meiner geplanten selbständigen Tätigkeit, die ich auf Grundlage von § 16c Abs. 1 SGB II beantrage und auf die ich Anspruch erhebe</strong>, damit ich so schnell wie möglich ein eigenes Einkommen erzielen, meine Situation stabilisieren und nicht länger auf weitere Unterstützung des Jobcenters angewiesen sein muss.</li>
              </ul>
              <p style="margin:0 0 4px">Diese Beträge fordere ich nicht als abstrakte Zahlen, sondern als konkrete Mittel zur Lösung meiner derzeitigen Situation, denn ohne diese finanziellen Mindestmittel wird es mir nicht möglich sein, meine Tätigkeit tatsächlich aufzubauen.</p>
              <p style="margin:0 0 4px">Ich muss überfällige notwendige Zahlungen begleichen, meine Ernährung und grundlegenden Lebensbedürfnisse sichern und zugleich eine reale Möglichkeit erhalten, meine wirtschaftliche Selbständigkeit aufzubauen.</p>
              <p style="margin:0 0 4px">Ebenso unverzichtbar ist für mich die ordnungsgemäße Sicherstellung meines Krankenversicherungsschutzes bei der AOK Bayern. Aufgrund meiner aktuellen Zahnprobleme und des weiteren Behandlungsbedarfs kann die Frage meines Krankenversicherungsschutzes nicht länger ungeklärt bleiben. Ich erwarte daher, dass ich <strong>am Montag, den 05.10.2026, ordnungsgemäß bei der AOK Bayern versichert bzw. gemeldet bin</strong> und ohne weitere administrative Hindernisse die notwendige medizinische und zahnärztliche Behandlung in Anspruch nehmen kann.</p>
              <p style="margin:0 0 4px">Gerade die Unterstützung bei der Aufnahme einer selbständigen Tätigkeit hat dann einen Sinn, wenn sie einem Menschen ermöglicht, sich aus der Abhängigkeit von Sozialleistungen zu lösen und ein eigenes Einkommen zu schaffen. Genau das ist mein Ziel.</p>
              <p style="margin:0 0 4px">Die bisherige Ausgabe einzelner Gutscheine im Wert von jeweils 25 € löst meine Situation nicht. Sie ermöglicht lediglich ein vorübergehendes Überleben von Tag zu Tag, ohne die Möglichkeit, Verbindlichkeiten zu begleichen, finanzielle Stabilität herzustellen oder meine selbständige Tätigkeit tatsächlich aufzubauen.</p>
              <p style="margin:0 0 4px">Daher erwarte ich von Ihnen jetzt <strong>eine konkrete finanzielle und existenzsichernde Lösung und keine weiteren Verzögerungen</strong>.</p>
              <p style="margin:0 0 4px">Ich fordere Sie auf, mir unverzüglich schriftlich zu bestätigen, welche der oben genannten Zahlungen Sie leisten werden, in welcher Höhe und an welchem Tag diese meinem Konto gutgeschrieben werden. Gleichzeitig erwarte ich die Bestätigung, dass mein Krankenversicherungsschutz bei der AOK Bayern spätestens am Montag, den 05.10.2026, ordnungsgemäß sichergestellt ist.</p>
              <p style="margin:0 0 4px">Sollten Sie eine der genannten Zahlungen ablehnen oder meinen Krankenversicherungsschutz nicht innerhalb der genannten Frist sicherstellen, fordere ich Sie auf, mir diese Ablehnung schriftlich und eindeutig mitzuteilen, damit klar ersichtlich ist, welche konkrete Lösung meiner existenziellen Situation Sie mir stattdessen anbieten.</p>
              <p style="margin:0 0 4px">Sollten die genannten Zahlungen nicht innerhalb der gesetzten Fristen erfolgen und mein Krankenversicherungsschutz nicht ordnungsgemäß sichergestellt werden, werde ich sämtliche verfügbaren rechtlichen Mittel ausschöpfen. Dazu gehören die Einreichung entsprechender Anträge und Klagen bei den zuständigen Gerichten einschließlich des Sozialgerichts sowie die Geltendmachung von Schadensersatz- und Entschädigungsansprüchen, soweit mir infolge weiteren untätigen oder rechtswidrigen Handelns finanzielle, gesundheitliche oder sonstige nachweisbare Schäden entstehen.</p>
              <p style="margin:0 0 4px">Mein Ziel ist es nicht, dauerhaft auf Leistungen des Jobcenters angewiesen zu bleiben.</p>
              <p style="margin:0 0 4px">Mein Ziel ist es, <strong>jetzt meine grundlegenden Lebensbedingungen und die notwendige gesundheitliche Versorgung zu sichern und zugleich eine reale Möglichkeit zu erhalten, so schnell wie möglich durch meine eigene Tätigkeit Einkommen zu erzielen</strong>.</p>
              <p style="margin:0 0 4px">Mein Ziel ist weiterhin, diese Situation ohne weiteren gerichtlichen Streit zu lösen. Sollte das Jobcenter jedoch nicht handeln, werde ich meine Rechte in vollem Umfang gerichtlich durchsetzen, <strong>einschließlich der Herbeiführung entsprechender strafrechtlicher Konsequenzen, sofern die gesetzlichen Voraussetzungen hierfür erfüllt sind</strong>.</p>
              <p style="margin:0 0 5px">Mit freundlichen Grüßen<br><strong>Peter Ferenc</strong><br>Kumhausen, Deutschland</p>


              <div style="display:flex;flex-wrap:wrap;gap:10px;margin:0 0 14px">
                <a href="${EXISTENZ_PDF_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 14px;border:1px solid #1877F2;border-radius:8px;background:#fff;color:#0b57d0;font-weight:700;text-decoration:none">📄 Unverzügliche finanzielle Sicherung meiner Existenz_DE.pdf öffnen</a>
              </div>

            </div>
          </div>
        </details>
      </div>`;
    var daniel = document.getElementById('daniel-freund-letter-2026-10-04');
    if (daniel && daniel.parentNode) daniel.insertAdjacentElement('beforebegin', section);
    else {
      var firstEvidence = document.querySelector('section.attachment.evidence-section');
      if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section); else document.body.appendChild(section);
    }
    return true;
  }



  function addJobcenterPersonalVisit20261007(){
    if (document.getElementById('jobcenter-personal-visit-2026-10-07')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-personal-visit-2026-10-07';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML = \`
      <style>
        #jobcenter-personal-visit-2026-10-07 .outlook-card{border:2px solid #1877F2;background:#f7fbff}
        #jobcenter-personal-visit-2026-10-07 .visit-lang-card{margin-top:10px;padding:12px 14px;border:1px solid #d9d9d9;border-radius:8px;background:#fff;line-height:1.35;text-align:justify;text-justify:inter-word;hyphens:auto}
        #jobcenter-personal-visit-2026-10-07 .visit-lang-card p{margin:0 0 6px}
        #jobcenter-personal-visit-2026-10-07 .visit-lang-card ul{margin:2px 0 8px;padding-left:24px}
        #jobcenter-personal-visit-2026-10-07 .visit-lang-card li{margin:0 0 3px}
        #jobcenter-personal-visit-2026-10-07 .visit-lang-card h3{margin:12px 0 7px;font-size:1.05em}
        #jobcenter-personal-visit-2026-10-07 .visit-translate-btn{display:inline-block;margin:10px 0 2px;padding:9px 13px;border:1px solid #1877F2;border-radius:8px;background:#fff;color:#0b57d0;font-weight:700;cursor:pointer}
      </style>
      <hr class="evidence-divider">
      <p class="update-date">Aktualisiert am: 07.10.2026</p>
      <h2>Persönlicher Besuch beim Jobcenter – verweigerte sachliche Klärung, unangemessene Behandlung und weitere Verschärfung meiner existenziellen Situation</h2>
      <div class="outlook-card">
        <div class="outlook-card-title">📨 Dokumentation meines persönlichen Besuchs beim Jobcenter Landkreis Landshut am 07.10.2026</div>
        <div class="outlook-card-note">Dokumentation des persönlichen Termins und der anschließenden Vorsprache bei der AOK.</div>
        <details class="outlook-details">
          <summary class="outlook-summary">📄 Nachricht im Browser anzeigen / ausblenden</summary>
          <button type="button" class="visit-translate-btn" data-lang="de">Preložiť do EN</button>

          <div class="visit-lang-card" data-panel="de">
            <p>Am <strong>07.10.2026</strong> erschien ich persönlich beim Jobcenter Landkreis Landshut. Den Termin hatte ich bereits am Montag vereinbart, weil ich persönlich mit einer vorgesetzten Mitarbeiterin, einem vorgesetzten Mitarbeiter oder einer anderen zuständigen Person darüber sprechen wollte, dass meine Angelegenheiten betreffend <strong>Grundsicherungsgeld</strong>, Krankenversicherung und Unterstützung beim Beginn meiner selbständigen Erwerbstätigkeit weiterhin ungelöst sind.</p>
            <p>Das Ergebnis dieses Besuchs war für mich äußerst enttäuschend.</p>
            <p>Ich verlangte, mit einer Führungskraft sprechen zu können. Mir wurde jedoch mitgeteilt, dass die verantwortlichen Personen angeblich an einem anderen, neuen Arbeitsplatz seien. Statt eines Gesprächs mit der Leitung wurde mir eine andere Mitarbeiterin zugeteilt, die mir keinerlei konkrete Informationen zum Bearbeitungsstand meiner Angelegenheiten gab.</p>
            <p>Ihre Art der Kommunikation empfand ich als sehr unangenehm, ablehnend und stellenweise sogar aggressiv.</p>
            <p>Als ich um eine Erklärung oder konkrete Hilfe bat, wurde mir sinngemäß gesagt, dass wir das Gespräch beenden könnten, wenn mir die angebotene Lösung nicht gefalle, weil die Mitarbeiterin auch andere Arbeit habe.</p>
            <p>Eine solche Art der Kommunikation mit mir als Bürger, der sich in einer existenziellen Notlage befindet und wiederholt um die Klärung seiner gesetzlichen Ansprüche ersucht, halte ich für inakzeptabel.</p>

            <h3>Lebensmittelhilfe – statt eines normalen Lebensmitteleinkaufs Verweisung auf Lebensmittel nach Ablauf des Mindesthaltbarkeitsdatums</h3>
            <p>Während des Besuchs beantragte ich zugleich den Austausch eines Lebensmittel-Gutscheins, dessen Gültigkeit nach einem Monat abgelaufen war.</p>
            <p>Statt eines neuen Gutscheins, mit dem ich die grundlegenden Lebensmittel entsprechend meinem tatsächlichen Bedarf in einem normalen Geschäft hätte kaufen können, erhielt ich eine Bescheinigung für den kostenlosen Bezug von Lebensmitteln aus Ausgabestellen der Lebensmittelhilfe, zu denen auch Lebensmittel nach Ablauf des Mindesthaltbarkeitsdatums gehören können.</p>
            <p>Eine solche Lösung behebt meine tatsächliche existenzielle Situation jedoch nicht.</p>
            <p>In diesen Ausgabestellen sind nicht regelmäßig alle grundlegenden Lebensmittel verfügbar, die ich für eine normale Ernährung benötige, zum Beispiel:</p>
            <ul>
              <li>Mehl,</li>
              <li>Hefe,</li>
              <li>Salz,</li>
              <li>Fleisch,</li>
              <li>Grundnahrungsmittel zum Kochen und Backen,</li>
              <li>weitere gewöhnliche Lebensmittel entsprechend dem aktuellen Bedarf.</li>
            </ul>
            <p>Ich habe daher keine Möglichkeit zu entscheiden, was ich tatsächlich kaufen muss, sondern bin ausschließlich darauf angewiesen, was mir gerade zugeteilt wird.</p>
            <p><strong>Eine solche Behandlung vermittelt mir das Gefühl, dass mit mir nicht wie mit einem Menschen umgegangen wird, der ein Recht auf eine menschenwürdige Existenz hat, sondern lediglich wie mit einem Problem, das administrativ möglichst billig beiseitegeschoben werden soll.</strong></p>
            <p>Ich verlange keinen Luxus.</p>
            <p>Ich verlange die Möglichkeit, grundlegende Lebensmittel zu kaufen, die für ein normales Leben und eine normale Ernährung notwendig sind.</p>

            <h3>Krankenversicherung – Jobcenter verwies mich an die AOK, die AOK faktisch zurück an das Jobcenter</h3>
            <p>Besonders schwerwiegend ist die Situation hinsichtlich meiner Krankenversicherung.</p>
            <p>Beim Jobcenter wurde mir wiederholt gesagt, dass ich mich wegen der Krankenversicherung an die AOK wenden solle.</p>
            <p>Deshalb suchte ich die AOK persönlich auf und bat um eine Erklärung.</p>
            <p>Bei der AOK wurde mir mitgeteilt, dass das Jobcenter sehr wohl weiß, dass meine ordnungsgemäße Krankenversicherung über das Jobcenter erst dann geregelt werden kann, wenn mein Anspruch auf die entsprechende Leistung ordnungsgemäß bearbeitet ist und ich entsprechend registriert bin.</p>
            <p>Deshalb frage ich:</p>
            <p><strong>Warum schickt mich das Jobcenter zur AOK, wenn es wissen muss, dass die AOK das Problem ohne Klärung meines Status durch das Jobcenter nicht endgültig lösen kann?</strong></p>
            <p>Das Ergebnis ist eine absurde Situation:</p>
            <p><strong>Das Jobcenter schickt mich zur AOK und die AOK verweist mich faktisch zurück auf die Klärung meines Status durch das Jobcenter.</strong></p>
            <p>In der Zwischenzeit bin ich derjenige, der sämtliche Folgen trägt.</p>
            <p>Ich habe gesundheitliche Probleme, benötige eine zahnärztliche Behandlung und weitere medizinische Versorgung, werde aber statt einer Lösung zwischen den einzelnen Institutionen hin- und hergeschoben.</p>

            <h3>Nicht einmal minimale praktische Hilfe</h3>
            <p>Während meines Besuchs bei der AOK bat ich außerdem darum, ob ich mein Mobiltelefon aufladen dürfe.</p>
            <p>Nicht einmal diese minimale praktische Hilfe wurde mir ermöglicht, und auch dort empfand ich die Art der Kommunikation mit mir als unwillig und unangemessen unfreundlich.</p>
            <p>Ich führe dies nicht als Hauptproblem meines Falles an, sondern als weiteres Beispiel dafür, wie in dieser existenziellen Situation mit mir umgegangen wird.</p>

            <h3>Schlussfolgerung</h3>
            <p>Am 07.10.2026 kam ich zum Jobcenter, um endlich konkrete Informationen und eine Lösung zu erhalten.</p>
            <p>Stattdessen:</p>
            <ul>
              <li>kam ich nicht zu einer Führungskraft,</li>
              <li>erhielt ich keine konkrete Information über den Bearbeitungsstand meiner Angelegenheiten,</li>
              <li>erhielt ich keinen normalen Ersatz für den abgelaufenen Gutschein,</li>
              <li>wurde ich auf eine eingeschränkte Lebensmittelhilfe verwiesen, statt normal einkaufen zu können,</li>
              <li>wurde ich hinsichtlich der Krankenversicherung erneut an die AOK verwiesen,</li>
              <li>bestätigte mir die AOK anschließend, dass die entscheidenden Schritte zunächst durch das Jobcenter geklärt werden müssen,</li>
              <li>und meine grundlegenden existenziellen und gesundheitlichen Probleme blieben erneut ungelöst.</li>
            </ul>
            <p><strong>Ein solches Vorgehen betrachte ich nicht mehr als bloße administrative Unannehmlichkeit. Es hat unmittelbare Auswirkungen auf meine Ernährung, meine Gesundheit, meine Würde und meine Fähigkeit, ein normales Leben zu führen.</strong></p>
            <p>Ich bin ein Bürger, der sich in einer existenziellen Notlage an eine öffentliche Institution gewandt hat.</p>
            <p><strong>Ich erwarte eine Lösung und nicht das Weiterschieben von einer Institution zur anderen, Ersatzlösungen bei der Lebensmittelversorgung und die Verweigerung konkreter Antworten.</strong></p>
            <p>Und wenn dieser Zustand fortbesteht, werde ich ihn weiterhin dokumentieren und den zuständigen Kontrollorganen und Gerichten als Bestandteil des gesamten Verlaufs meines Falles vorlegen.</p>
          </div>

          <div class="visit-lang-card" data-panel="en" hidden>
            <p>On <strong>07.10.2026</strong>, I personally appeared at Jobcenter Landkreis Landshut. I had arranged the appointment already on Monday because I wanted to speak personally with a supervisor or another competent person about the fact that my matters concerning <strong>Grundsicherungsgeld</strong>, health insurance and support for starting my self-employed activity remain unresolved.</p>
            <p>The result of this visit was extremely disappointing for me.</p>
            <p>I asked to speak with a manager. However, I was told that the responsible persons were allegedly at another, new workplace. Instead of speaking with management, another employee was assigned to me, who provided me with no concrete information about the processing status of my matters.</p>
            <p>I experienced her manner of communication as very unpleasant, dismissive and at times even aggressive.</p>
            <p>When I asked for an explanation or concrete help, I was essentially told that if I did not like the proposed solution, we could end the conversation because the employee also had other work to do.</p>
            <p>I consider such a manner of communication with me as a citizen who is in an existential emergency and who has repeatedly requested the resolution of his statutory entitlements to be unacceptable.</p>

            <h3>Food assistance – instead of normal food shopping, referral to food after the best-before date</h3>
            <p>During the visit, I also requested the replacement of a food voucher whose validity had expired after one month.</p>
            <p>Instead of a new voucher that would allow me to buy basic food in a normal shop according to my actual needs, I was given a certificate for the free collection of food from food-aid distribution points, which may also include food after the best-before date.</p>
            <p>Such a solution, however, does not resolve my real existential situation.</p>
            <p>These distribution points do not regularly provide all the basic food that I need for normal nutrition, for example:</p>
            <ul>
              <li>flour,</li>
              <li>yeast,</li>
              <li>salt,</li>
              <li>meat,</li>
              <li>basic ingredients for cooking and baking,</li>
              <li>other ordinary food according to current need.</li>
            </ul>
            <p>I therefore have no possibility to decide what I actually need to buy, but I am dependent only on what happens to be allocated to me.</p>
            <p><strong>Such treatment gives me the feeling that I am not being treated as a person who has the right to a dignified existence, but merely as a problem that should be administratively pushed aside as cheaply as possible.</strong></p>
            <p>I am not asking for luxury.</p>
            <p>I am asking for the possibility to buy basic food necessary for normal functioning and nutrition.</p>

            <h3>Health insurance – Jobcenter referred me to AOK, AOK effectively referred me back to Jobcenter</h3>
            <p>The situation concerning my health insurance is particularly serious.</p>
            <p>At Jobcenter I was repeatedly told to contact AOK regarding health insurance.</p>
            <p>Therefore, I personally went to AOK and asked for an explanation.</p>
            <p>At AOK I was told that Jobcenter knows very well that my proper health insurance through Jobcenter can only be dealt with once my entitlement to the relevant benefit has been properly processed and I have been registered accordingly.</p>
            <p>I therefore ask:</p>
            <p><strong>Why does Jobcenter send me to AOK if it must know that AOK cannot definitively resolve the problem without Jobcenter first clarifying my status?</strong></p>
            <p>The result is an absurd situation:</p>
            <p><strong>Jobcenter sends me to AOK and AOK effectively refers me back to having my status resolved through Jobcenter.</strong></p>
            <p>Meanwhile, I am the person who bears all the consequences.</p>
            <p>I have health problems, I need dental treatment and further health care, but instead of a solution I am being moved between the individual institutions.</p>

            <h3>Not even minimal practical assistance</h3>
            <p>During my visit to AOK, I also asked whether I could charge my mobile phone.</p>
            <p>Not even this minimal practical assistance was allowed, and I also experienced the way they communicated with me there as unwilling and inappropriately unfriendly.</p>
            <p>I do not present this as the main problem of my case, but as another example of how I am being treated in this existential situation.</p>

            <h3>Conclusion</h3>
            <p>On 07.10.2026, I came to Jobcenter in order finally to obtain concrete information and a solution.</p>
            <p>Instead:</p>
            <ul>
              <li>I was not given access to a manager,</li>
              <li>I was not provided with concrete information about the status of my matters,</li>
              <li>I did not receive a normal replacement for the expired voucher,</li>
              <li>I was referred to restricted food assistance instead of being able to shop normally,</li>
              <li>I was again referred to AOK regarding health insurance,</li>
              <li>AOK subsequently confirmed to me that the decisive steps first have to be resolved by Jobcenter,</li>
              <li>and my basic existential and health problems once again remained unresolved.</li>
            </ul>
            <p><strong>I no longer regard such a procedure as an ordinary administrative inconvenience. It has a direct impact on my nutrition, my health, my dignity and my ability to lead a normal life.</strong></p>
            <p>I am a citizen who turned to a public institution while in an existential emergency.</p>
            <p><strong>I expect a solution, not being moved from one institution to another, substitute food arrangements and the refusal to provide concrete answers.</strong></p>
            <p>And if this situation continues, I will continue to document it and submit it to the competent supervisory bodies and courts as part of the overall course of my case.</p>
          </div>

          <div class="visit-lang-card" data-panel="sk" hidden>
            <p>Dňa <strong>07.10.2026</strong> som sa osobne dostavil na Jobcenter Landkreis Landshut. Termín som si zabezpečil už v pondelok, pretože som chcel osobne hovoriť s nadriadeným pracovníkom alebo inou kompetentnou osobou o tom, že moje záležitosti týkajúce sa <strong>Grundsicherungsgeld</strong>, zdravotného poistenia a podpory pri začatí samostatnej zárobkovej činnosti zostávajú naďalej nevyriešené.</p>
            <p>Výsledok tejto návštevy bol pre mňa mimoriadne sklamaním.</p>
            <p>Žiadal som, aby som mohol hovoriť s vedúcim pracovníkom. Bolo mi však oznámené, že zodpovedné osoby sú údajne na inom, novom pracovisku. Namiesto rozhovoru s vedením mi bola pridelená iná pracovníčka, ktorá mi neposkytla žiadne konkrétne informácie o stave vybavovania mojich vecí.</p>
            <p>Jej spôsob komunikácie som vnímal ako veľmi nepríjemný, odmietavý a miestami až agresívny.</p>
            <p>Keď som žiadal vysvetlenie alebo konkrétnu pomoc, bolo mi povedané v podstate to, že ak sa mi ponúknuté riešenie nepáči, rozhovor môžeme ukončiť, pretože pracovníčka má aj inú prácu.</p>
            <p>Takýto spôsob komunikácie so mnou ako s občanom, ktorý sa nachádza v existenčnej núdzi a opakovane žiada o vyriešenie svojich zákonných nárokov, považujem za neprijateľný.</p>

            <h3>Potravinová pomoc – namiesto normálneho nákupu potravín odkázanie na potraviny po dátume minimálnej trvanlivosti</h3>
            <p>Počas návštevy som zároveň žiadal o výmenu potravinového Gutscheinu, ktorého platnosť uplynula po jednom mesiaci.</p>
            <p>Namiesto nového Gutscheinu, ktorý by mi umožnil nakúpiť si základné potraviny v bežnom obchode podľa mojich skutočných potrieb, mi bolo poskytnuté potvrdenie na odber bezplatných potravín, ktoré pochádzajú z výdajní potravinovej pomoci a môžu zahŕňať aj potraviny po uplynutí dátumu minimálnej trvanlivosti.</p>
            <p>Takéto riešenie však nerieši moju reálnu existenčnú situáciu.</p>
            <p>V týchto výdajniach nie sú pravidelne dostupné všetky základné potraviny, ktoré potrebujem na normálne stravovanie, napríklad:</p>
            <ul>
              <li>múka,</li>
              <li>droždie,</li>
              <li>soľ,</li>
              <li>mäso,</li>
              <li>základné suroviny na varenie a pečenie,</li>
              <li>ďalšie bežné potraviny podľa aktuálnej potreby.</li>
            </ul>
            <p>Nemám preto možnosť rozhodnúť sa, čo si potrebujem kúpiť, ale som odkázaný iba na to, čo mi bude práve pridelené.</p>
            <p><strong>Takéto zaobchádzanie vo mne vyvoláva pocit, že sa so mnou nezaobchádza ako s človekom, ktorý má právo na dôstojnú existenciu, ale iba ako s problémom, ktorý treba čo najlacnejšie administratívne odsunúť.</strong></p>
            <p>Nežiadam luxus.</p>
            <p>Žiadam možnosť kúpiť si základné potraviny potrebné na normálne fungovanie a stravovanie.</p>

            <h3>Zdravotné poistenie – Jobcenter ma odkázal na AOK, AOK späť na Jobcenter</h3>
            <p>Osobitne závažná je situácia týkajúca sa môjho zdravotného poistenia.</p>
            <p>Na Jobcentri mi bolo opakovane povedané, aby som sa vo veci zdravotného poistenia obrátil na AOK.</p>
            <p>Preto som sa osobne dostavil do AOK a žiadal vysvetlenie.</p>
            <p>V AOK mi bolo oznámené, že Jobcenter veľmi dobre vie, že moje riadne zdravotné poistenie prostredníctvom Jobcentra je možné riešiť až po tom, ako bude môj nárok na príslušnú dávku riadne spracovaný a budem príslušne evidovaný.</p>
            <p>Preto sa pýtam:</p>
            <p><strong>Prečo ma Jobcenter posiela na AOK, ak musí vedieť, že AOK bez vyriešenia môjho statusu zo strany Jobcentra nemôže problém definitívne vyriešiť?</strong></p>
            <p>Výsledkom je absurdná situácia:</p>
            <p><strong>Jobcenter ma posiela na AOK a AOK ma fakticky odkazuje späť na vyriešenie môjho statusu cez Jobcenter.</strong></p>
            <p>Medzitým zostávam ja tým človekom, ktorý nesie všetky následky.</p>
            <p>Mám zdravotné problémy, potrebujem zubné ošetrenie a ďalšiu zdravotnú starostlivosť, ale namiesto riešenia som presúvaný medzi jednotlivými inštitúciami.</p>

            <h3>Ani minimálna praktická pomoc</h3>
            <p>Počas návštevy AOK som zároveň požiadal, či by som si mohol nabiť mobilný telefón.</p>
            <p>Ani takáto minimálna praktická pomoc mi nebola umožnená a spôsob komunikácie so mnou som aj tam vnímal ako neochotný a neprimerane nepríjemný.</p>
            <p>Neuvádzam to ako hlavný problém môjho prípadu, ale ako ďalší príklad toho, akým spôsobom je so mnou v tejto existenčnej situácii zaobchádzané.</p>

            <h3>Záver</h3>
            <p>Dňa 07.10.2026 som prišiel na Jobcenter preto, aby som konečne získal konkrétne informácie a riešenie.</p>
            <p>Namiesto toho:</p>
            <ul>
              <li>som sa nedostal k vedúcemu pracovníkovi,</li>
              <li>nebola mi poskytnutá konkrétna informácia o stave mojich vecí,</li>
              <li>nedostal som normálnu náhradu za prepadnutý Gutschein,</li>
              <li>bol som odkázaný na obmedzenú potravinovú pomoc namiesto možnosti normálneho nákupu,</li>
              <li>vo veci zdravotného poistenia som bol znovu odkázaný na AOK,</li>
              <li>AOK mi následne potvrdila, že rozhodujúce kroky musí najprv vyriešiť Jobcenter,</li>
              <li>a moje základné existenčné a zdravotné problémy zostali opäť bez riešenia.</li>
            </ul>
            <p><strong>Takýto postup už nepovažujem za obyčajnú administratívnu nepríjemnosť. Má priamy dopad na moje stravovanie, moje zdravie, moju dôstojnosť a moju schopnosť viesť normálny život.</strong></p>
            <p>Som občan, ktorý sa obrátil na verejnú inštitúciu v existenčnej núdzi.</p>
            <p><strong>Očakávam riešenie, nie presúvanie z jednej inštitúcie na druhú, náhradné potravinové riešenia a odmietanie konkrétnych odpovedí.</strong></p>
            <p>A pokiaľ bude tento stav pokračovať, budem ho naďalej dokumentovať a predkladať príslušným kontrolným orgánom a súdom ako súčasť celkového priebehu môjho prípadu.</p>
          </div>
        </details>
      </div>\`;

    var btn = section.querySelector('.visit-translate-btn');
    var order = ['de','en','sk'];
    if (btn) btn.addEventListener('click', function(){
      var current = btn.getAttribute('data-lang') || 'de';
      var idx = order.indexOf(current);
      var next = order[(idx + 1) % order.length];
      section.querySelectorAll('[data-panel]').forEach(function(panel){
        panel.hidden = panel.getAttribute('data-panel') !== next;
      });
      btn.setAttribute('data-lang', next);
      btn.textContent = next === 'de' ? 'Preložiť do EN' : (next === 'en' ? 'Preložiť do SK' : 'Preložiť do DE');
    });

    var regional = document.getElementById('jobcenter-regionaldirektion-beschwerde-2026-10-06');
    if (regional && regional.parentNode) regional.insertAdjacentElement('beforebegin', section);
    else {
      var firstEvidence = document.querySelector('section.attachment.evidence-section');
      if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section);
      else document.body.appendChild(section);
    }
    return true;
  }

  function addRegionaldirektionBeschwerde20261006(){
    if (document.getElementById('jobcenter-regionaldirektion-beschwerde-2026-10-06')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-regionaldirektion-beschwerde-2026-10-06';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML =
      '<style>' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .outlook-card{border:2px solid #1877F2;background:#f7fbff}' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .outlook-view-body{padding:12px 14px!important;display:block!important;white-space:normal!important;line-height:1.3!important;text-align:justify;text-justify:inter-word;hyphens:auto}' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .outlook-view-body p{margin:0 0 4px!important;padding:0!important;min-height:0!important;line-height:1.3!important}' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .jc-compact-separator{font-family:monospace;color:#666;overflow:hidden;white-space:nowrap;margin:4px 0}' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .jc-pdf-label{font-weight:700;margin:0 0 5px}' +
      '#jobcenter-regionaldirektion-beschwerde-2026-10-06 .wdfox-signature{margin-top:6px;line-height:1.25}' +
      '</style>' +
      '<hr class="evidence-divider">' +
      '<p class="update-date">Aktualisiert am: 06.10.2026 | Aktualisierung Nr. 1</p>' +
      '<h2>Beschwerde wegen Untätigkeit und Bearbeitung meines Falles – Regionaldirektion Bayern</h2>' +
      '<div class="outlook-card">' +
        '<div class="outlook-card-title">📨 Beschwerde wegen Untätigkeit und Bearbeitung meines Falles – Jobcenter Landkreis Landshut</div>' +
        '<div class="outlook-card-note">Am 06.10.2026 an die Regionaldirektion Bayern übermittelt.</div>' +
        '<details class="outlook-details">' +
          '<summary class="outlook-summary">📄 Begleittext und Anlage im Browser anzeigen / ausblenden</summary>' +
          '<div class="outlook-view">' +
            '<div class="outlook-view-head"><div class="outlook-view-meta"><strong>Datum:</strong> 06.10.2026<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Regionaldirektion Bayern – Kundenreaktionsmanagement<br><strong>Betreff:</strong> Beschwerde wegen Untätigkeit und Bearbeitung meines Falles – Jobcenter Landkreis Landshut</div></div>' +
            '<div class="outlook-view-body">' +
              '<p><strong>Betreff / Predmet:</strong> Beschwerde wegen Untätigkeit und Bearbeitung meines Falles – Jobcenter Landkreis Landshut</p>' +
              '<p><strong>Sehr geehrte Damen und Herren,</strong></p>' +
              '<p>anbei übersende ich Ihnen meine formelle Beschwerde bezüglich des bisherigen Vorgehens des Jobcenters Landkreis Landshut in meinem Fall.</p>' +
              '<p>Das beigefügte Dokument enthält eine Zusammenfassung der aktuellen Situation, meine konkreten Anliegen sowie ergänzende Nachweise und eine slowakische Übersetzung des Haupttextes.</p>' +
              '<p>Aufgrund meiner akuten existenziellen und gesundheitlichen Situation bitte ich um eine unverzügliche Prüfung der Angelegenheit, um eine Bestätigung des Eingangs dieser Beschwerde sowie um eine Information über das weitere Vorgehen.</p>' +
              '<p>Mit freundlichen Grüßen</p>' +
              '<p>Details:<br><a href="' + JOBCENTER_PAGE_URL + '" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline">https://www.foxprof.club/jobcenter/</a></p>' +
              '<div class="wdfox-signature"><strong><a href="https://foxprof.club/" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline">WebDesignFOX</a> Peter Ferenc</strong><br><strong>Rammelkam 2,<br>84036 Kumhausen</strong><br>📞 Mobil: +49 157 317 3333 2<br>📠 +1 231 538 6409<br>📧 <a href="mailto:info@foxprof.club" style="color:#0b57d0;text-decoration:underline">info@foxprof.club</a> | <a href="http://www.foxprof.club/" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline">www.foxprof.club</a></div>' +
              '<div class="jc-compact-separator">======================================================</div>' +
              '<div class="jc-pdf-label">pdf Anhang: Beschwerde_Jobcenter_Landkreis_LA_Regionaldirektion Bayern_DE_SK.pdf</div>' +
              '<div id="regional-beschwerde-pdf-text" style="margin:0 0 5px;line-height:1.3">Anhangtext wird beim Öffnen geladen ...</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:7px 0 0"><a href="' + REGIONAL_BESCHWERDE_PDF_URL + '" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:9px 12px;border:1px solid #1877F2;border-radius:8px;background:#fff;color:#0b57d0;font-weight:700;text-decoration:none">📄 Original-PDF öffnen</a></div>' +
            '</div>' +
          '</div>' +
        '</details>' +
      '</div>';
    var details = section.querySelector('details');
    if (details) details.addEventListener('toggle', function(){
      if (!details.open) return;
      var target = document.getElementById('regional-beschwerde-pdf-text');
      if (target) loadPdfText(target, REGIONAL_BESCHWERDE_PDF_URL);
    });
    var krank = document.getElementById('jobcenter-krankenversicherung-2026-10-05');
    if (krank && krank.parentNode) krank.insertAdjacentElement('beforebegin', section);
    else {
      var firstEvidence = document.querySelector('section.attachment.evidence-section');
      if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section);
      else document.body.appendChild(section);
    }
    return true;
  }

  function addSozialgerichtEA20261006(){
    if (document.getElementById('jobcenter-sozialgericht-ea-2026-10-06')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-sozialgericht-ea-2026-10-06';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML =
      '<style>' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .outlook-card{border:2px solid #1877F2;background:#f7fbff}' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .sg-docs{display:flex;flex-direction:column;gap:10px;margin-top:10px}' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .sg-doc{padding:10px 12px;border:1px solid #d9d9d9;border-radius:8px;background:#fff}' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .sg-doc-title{font-weight:700;margin:0 0 7px}' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .sg-actions{display:flex;flex-wrap:wrap;gap:8px}' +
      '#jobcenter-sozialgericht-ea-2026-10-06 .sg-actions a,#jobcenter-sozialgericht-ea-2026-10-06 .sg-actions button{display:inline-block;padding:8px 11px;border:1px solid #1877F2;border-radius:7px;background:#fff;color:#0b57d0;font:inherit;font-weight:700;text-decoration:none;cursor:pointer}' +
      '</style>' +
      '<hr class="evidence-divider">' +
      '<p class="update-date">Aktualisiert am: 06.10.2026 | Aktualisierung Nr. 2</p>' +
      '<h2>ANTRAG AUF ERLASS EINER EINSTWEILIGEN ANORDNUNG<br><span style="font-size:.92em">gemäß § 86b Abs. 2 SGG</span></h2>' +
      '<div class="outlook-card">' +
        '<div class="outlook-card-title">📨 Antrag an das Sozialgericht Landshut</div>' +
        '<div class="outlook-card-note">Am 06.10.2026 über MJP an das Sozialgericht Landshut übermittelt. Kein Begleittext – übermittelt wurden ausschließlich die beiden PDF-Dokumente.</div>' +
        '<div class="sg-docs">' +
          '<div class="sg-doc">' +
            '<div class="sg-doc-title">🇩🇪 15_Sozialgericht_LA_Antrag_auf_einstweilige_Anordnung_DE_v2.pdf</div>' +
            '<div class="sg-actions">' +
              '<a href="' + SOZIALGERICHT_DE_PDF_URL + '" target="_blank" rel="noopener noreferrer">📄 PDF anzeigen</a>' +
              '<button type="button" data-download="de">⬇ PDF herunterladen</button>' +
            '</div>' +
          '</div>' +
          '<div class="sg-doc">' +
            '<div class="sg-doc-title">🇸🇰 15_Sozialgericht LA_Antrag auf einstweilige Anordnung_SK.pdf</div>' +
            '<div class="sg-actions">' +
              '<a href="' + SOZIALGERICHT_SK_PDF_URL + '" target="_blank" rel="noopener noreferrer">📄 PDF anzeigen</a>' +
              '<button type="button" data-download="sk">⬇ PDF herunterladen</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    var deBtn = section.querySelector('[data-download="de"]');
    var skBtn = section.querySelector('[data-download="sk"]');
    if (deBtn) deBtn.addEventListener('click', function(){ downloadFile(SOZIALGERICHT_DE_PDF_URL, '15_Sozialgericht_LA_Antrag_auf_einstweilige_Anordnung_DE_v2.pdf'); });
    if (skBtn) skBtn.addEventListener('click', function(){ downloadFile(SOZIALGERICHT_SK_PDF_URL, '15_Sozialgericht LA_Antrag auf einstweilige Anordnung_SK.pdf'); });
    var regional = document.getElementById('jobcenter-regionaldirektion-beschwerde-2026-10-06');
    if (regional && regional.parentNode) regional.insertAdjacentElement('afterend', section);
    else {
      var krank = document.getElementById('jobcenter-krankenversicherung-2026-10-05');
      if (krank && krank.parentNode) krank.insertAdjacentElement('beforebegin', section);
      else document.body.appendChild(section);
    }
    return true;
  }

  function addFreundWarnung20261006(){
    if (document.getElementById('jobcenter-freund-warnung-2026-10-06')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-freund-warnung-2026-10-06';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML = '<hr class="evidence-divider">' +
      '<p class="update-date">Aktualisiert am: 06.10.2026 | Aktualisierung Nr. 3</p>' +
      '<h2>Warnung – Nachricht an Daniel Freund</h2>' +
      '<div class="outlook-card" style="border:2px solid #1877F2;background:#f7fbff">' +
      '<div class="outlook-card-title">📨 Warnung</div>' +
      '<div class="outlook-card-note">Am 06.10.2026 per E-Mail an Daniel Freund, Mitglied des Europäischen Parlaments, übermittelt.</div>' +
      '<img src="' + FREUND_WARNUNG_IMAGE_URL + '" alt="Daniel Freund" style="display:block;max-width:240px;width:44%;height:auto;margin:12px auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.15)">' +
      '<div style="margin:10px 0 0;padding:10px 12px;border:1px solid #d9d9d9;border-radius:8px;background:#fff;line-height:1.35">' +
      '<strong>Datum:</strong> 06.10.2026<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Daniel Freund – Mitglied des Europäischen Parlaments<br><strong>Betreff:</strong> Warnung' +
      '</div>' +
      '<details class="outlook-details" style="margin-top:10px">' +
      '<summary class="outlook-summary">📄 Nachricht im Browser anzeigen / ausblenden</summary>' +
      '<div class="outlook-view"><div class="outlook-view-body" style="padding:12px 14px;line-height:1.3;text-align:justify;hyphens:auto">' +
      '<p>Herr Freund,</p>' +
      '<p>aus Ihrer bisherigen Untätigkeit gewinne ich den Eindruck, dass Ihr öffentliches Mandat im Europäischen Parlament in meinem Fall lediglich formalen und deklarativen Charakter hat.</p>' +
      '<p>Bürger wählen ihre politischen Vertreter nicht dafür, dass diese lediglich hohe öffentliche Bezüge erhalten, sondern dafür, dass sie bei schwerwiegenden Problemen der Bürger handeln, kommunizieren und Verantwortung für die Ausübung ihres Mandats übernehmen.</p>' +
      '<p>Auf mein Anliegen bezüglich meiner existenziellen Situation, meines Krankenversicherungsschutzes und des Vorgehens des Jobcenters habe ich von Ihnen bislang keine sachliche Antwort erhalten.</p>' +
      '<p>Ich halte es für legitim, öffentlich darauf hinzuweisen, wenn ein gewählter Vertreter trotz der Schwere eines vorgetragenen Anliegens nicht reagiert. Ebenso halte ich es für legitim, die Öffentlichkeit darüber zu informieren, wie einzelne öffentliche Mandatsträger ihr Mandat ausüben und ob sie Bürgern, die sich an sie wenden, tatsächliche Unterstützung oder zumindest eine sachliche Antwort geben.</p>' +
      '<p>Ich erwarte daher von Ihnen eine klare Stellungnahme zu meinem Anliegen und die Information, ob Sie beabsichtigen, sich mit meinem Fall zu befassen.</p>' +
      '<p>Mit freundlichen Grüßen</p>' +
      '<p><strong>Peter Ferenc</strong></p>' +
      '</div></div></details></div>';
    var sozial = document.getElementById('jobcenter-sozialgericht-ea-2026-10-06');
    if (sozial && sozial.parentNode) sozial.insertAdjacentElement('afterend', section);
    else document.body.appendChild(section);
    return true;
  }

  function addDanielFreundEmail20261005(){
    if (document.getElementById('daniel-freund-email-2026-10-05')) return true;
    var section = document.createElement('section');
    section.id = 'daniel-freund-email-2026-10-05';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML = `
      <style>
        #daniel-freund-email-2026-10-05 .outlook-card{border:2px solid #1877F2;background:#f7fbff}
        #daniel-freund-email-2026-10-05 .outlook-view-body{padding:12px 14px!important;display:block!important;white-space:normal!important;line-height:1.3!important;text-align:justify;text-justify:inter-word;hyphens:auto}
        #daniel-freund-email-2026-10-05 .outlook-view-body p{margin:0 0 5px!important;padding:0!important;min-height:0!important;line-height:1.3!important}
        #daniel-freund-email-2026-10-05 .wdfox-nested-downloads{margin:10px 0 0 14px;padding:9px 0 2px 12px;border-left:3px solid #1877F2;display:flex;flex-direction:column;align-items:flex-start;gap:7px}
        #daniel-freund-email-2026-10-05 .wdfox-nested-downloads .label{font-weight:700;margin:0 0 2px}
        #daniel-freund-email-2026-10-05 .wdfox-nested-downloads a{display:inline-block;padding:8px 11px;border:1px solid #cfcfcf;border-radius:7px;background:#fff;color:#0b57d0;font-weight:700;text-decoration:none;cursor:pointer}
      </style>
      <hr class="evidence-divider">
      <p class="update-date">Aktualisiert am: 05.10.2026</p>
      <h2>E-Mail an Daniel Freund – Ergänzende Dokumentation zum Jobcenter-Fall</h2>
      <div class="outlook-card">
        <div class="outlook-card-title">📨 E-Mail an Daniel Freund – Ergänzende Dokumentation zu meinem Fall</div>
        <div class="outlook-card-note">Am 05.10.2026 per E-Mail an Herrn Daniel Freund übermittelt; weitere sichtbare Empfänger waren im Cc-Verteiler aufgeführt.</div><div class="wdfox-freund-recipient-meta" style="margin:10px 0;padding:10px 12px;border:1px solid #d9d9d9;border-radius:8px;background:#f5f7fa;line-height:1.35"><strong>Datum:</strong> 05.10.2026<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger (An):</strong> Daniel Freund – Mitglied des Europäischen Parlaments (daniel.freund@europarl.europa.eu)<br><strong>Betreff:</strong> Ergänzende Dokumentation zu meinem Fall – Jobcenter, Krankenversicherung, Existenzsicherung und Förderung meiner selbständigen Tätigkeit<details style="margin-top:8px"><summary style="cursor:pointer;font-weight:700">Sichtbare Empfängerliste (An / Cc) anzeigen / ausblenden</summary><div style="margin-top:6px"><div><strong>An:</strong> Daniel Freund – daniel.freund@europarl.europa.eu</div><div style="margin-top:5px"><strong>Cc:</strong></div><ul style="margin:3px 0 0;padding-left:22px"><li style="margin:0 0 2px">Amira Mohamed Ali – amira.mohamedali@bundestag.de</li><li style="margin:0 0 2px">Dietmar Bartsch – dietmar.bartsch@bundestag.de</li><li style="margin:0 0 2px">CSU-Landtagsfraktion – fraktion@csu-landtag.de</li><li style="margin:0 0 2px">Christian Lindner – christian.lindner@bundestag.de</li><li style="margin:0 0 2px">AfD – kontakt@afd.de</li><li style="margin:0 0 2px">Amtsgericht Landshut – poststelle@ag-la.bayern.de</li><li style="margin:0 0 2px">Sozialgericht Landshut – poststelle@sg-landshut.justiz.bayern.de</li><li style="margin:0 0 2px">Polizei / KPI Landshut – pp-nb.landshut.kpi@polizei.bayern.de</li><li style="margin:0 0 2px">Tino Chrupalla – tino.chrupalla@bundestag.de</li><li style="margin:0 0 2px">Tomáš Zdechovský – tomas.zdechovsky@europarl.europa.eu</li><li style="margin:0 0 2px">Alojz Hlina – alojz.hlina@nrsr.sk</li><li style="margin:0 0 2px">Demokrati – press@smedemokrati.sk</li><li style="margin:0 0 2px">Kabinett Maroš Šefčovič – cab-sefcovic-contact@ec.europa.eu</li><li style="margin:0 0 2px">European Commission / Simona Giorgini – simona.giorgini@ec.europa.eu</li><li style="margin:0 0 2px">Hnutie Republika – hovorca@hnutie-republika.sk</li><li style="margin:0 0 2px">Roman Pšenák – psenak.republika@gmail.com</li><li style="margin:0 0 2px">Hnutie Republika / Milan Uhrík – kontakt@hnutie-republika.sk</li><li style="margin:0 0 2px">Igor Matovič – igor.matovic@gmail.com</li><li style="margin:0 0 2px">Igor Matovič / Slovensko – kontakt@obycajniludia.sk</li><li style="margin:0 0 2px">Jozef Kmec – kmecj@centrum.sk</li><li style="margin:0 0 2px">Július Jakab – julius.jakab@nrsr.sk</li><li style="margin:0 0 2px">Peter Kmec – peter.kmec@nrsr.sk</li><li style="margin:0 0 2px">Lucia Plaváková – Lucia.Plavakova@nrsr.sk</li><li style="margin:0 0 2px">Mária Šubová – maria.subova@nrsr.sk</li><li style="margin:0 0 2px">Milan Majerský / KDH – sekretariat@kdh.sk</li><li style="margin:0 0 2px">Milan Mazurek – mazurek@hnutie-republika.sk</li><li style="margin:0 0 2px">NOVA – info@nova.sk</li><li style="margin:0 0 2px">NOVA – nova@nova.sk</li><li style="margin:0 0 2px">Progresívne Slovensko / Michal Šimečka – info@progresivne.sk</li><li style="margin:0 0 2px">Roman Mikulec – roman.mikulec@nrsr.sk</li><li style="margin:0 0 2px">Slovensko – press@obycajniludia.sk</li><li style="margin:0 0 2px">SMER – SD – tlacove@strana-smer.sk</li><li style="margin:0 0 2px">Monika Beňová – monika.benova@europarl.europa.eu</li><li style="margin:0 0 2px">Milan Uhrík – kontakt@milanuhrik.sk</li><li style="margin:0 0 2px">Veronika Remišová – veronika.remisova@nrsr.sk</li><li style="margin:0 0 2px">ZA ĽUDÍ – press@stranazaludi.sk</li><li style="margin:0 0 2px">Zuzana Šubová – zuzana.subova@nrsr.sk</li><li style="margin:0 0 2px">Tichys Einblick – kontakt@tichyseinblick.de</li><li style="margin:0 0 2px">Junge Freiheit – leserdienst@jungefreiheit.de</li><li style="margin:0 0 2px">konkret Magazin – verlag@konkret-magazin.de</li><li style="margin:0 0 2px">konkret Magazin – redaktion@konkret-magazin.de</li><li style="margin:0 0 2px">konkret Magazin – info@konkret-magazin.de</li><li style="margin:0 0 2px">Compact Magazin – verlag@compact-mail.de</li><li style="margin:0 0 2px">Manova – geschaeftsfuehrung@manova.news</li><li style="margin:0 0 2px">NachDenkSeiten – redaktion@nachdenkseiten.de</li><li style="margin:0 0 2px">Süddeutsche Zeitung – redaktion@sz.de</li><li style="margin:0 0 2px">Frankfurter Rundschau – chefredaktion@fr.de</li><li style="margin:0 0 2px">Frankfurter Rundschau – kundenservice@fr.de</li><li style="margin:0 0 2px">WAZ – politik@waz.de</li><li style="margin:0 0 2px">WAZ – redaktion.essen@waz.de</li><li style="margin:0 0 2px">WAZ – zentralredaktion@waz.de</li><li style="margin:0 0 2px">Assistentin eines Europaabgeordneten – veronika.blazejova@europarl.europa.eu</li></ul></div></details></div>
        <div class="outlook-view-body">
          <p>Sehr geehrter Herr Freund,</p>
          <p>im Anschluss an meine bisherige Korrespondenz übersende ich Ihnen im Anhang weitere aktuelle Unterlagen zu meinem Fall und zum Vorgehen des Jobcenters Landkreis Landshut.</p>
          <p>Das erste Dokument enthält meine Nachricht an das Jobcenter vom 05.10.2026, in der ich auf dessen Schreiben vom 29.09.2026 reagiere und insbesondere auf das weiterhin ungelöste Problem meines Kranken- und Pflegeversicherungsschutzes sowie darauf hinweise, dass über meinen Anspruch auf Grundsicherungsgeld noch immer nicht entschieden wurde.</p>
          <p>Das zweite Dokument enthält meine ausführliche Stellungnahme zur Existenzsicherung, zum Krankenversicherungsschutz und zur notwendigen zahnärztlichen Behandlung. Darin weise ich unter anderem auf die Möglichkeit einer vorläufigen Entscheidung nach § 41a SGB II, eines Vorschusses nach § 42 SGB I sowie im Falle weiterer Untätigkeit auf die Möglichkeit hin, beim Sozialgericht vorläufigen Rechtsschutz nach § 86b Abs. 2 SGG zu beantragen.</p>
          <p>Ich möchte zugleich ausdrücklich hervorheben, dass dieser Fall nach meiner Auffassung unmittelbar Bereiche Ihrer Tätigkeit und Ihres Mandats im Europäischen Parlament berührt, insbesondere Fragen der Rechtsstaatlichkeit, der Transparenz, der Kontrolle staatlichen Handelns, der Korruptionsbekämpfung und des Schutzes der Rechte von Bürgerinnen und Bürgern der Europäischen Union.</p>
          <p>Zugleich halte ich es für legitim darauf hinzuweisen, dass die Ausübung Ihres öffentlichen Mandats aus öffentlichen Mitteln der Europäischen Union finanziert wird, zu deren Finanzierung über Steuern und öffentliche Haushalte auch die Bürgerinnen und Bürger der Mitgliedstaaten beitragen – einschließlich meiner Person. Gerade deshalb halte ich es für berechtigt zu verlangen, dass ein konkreter und umfassend dokumentierter Fall eines EU-Bürgers, der unmittelbar Bereiche Ihrer politischen und parlamentarischen Tätigkeit betrifft, ordnungsgemäß geprüft und weder ignoriert noch beiseitegeschoben wird.</p>
          <p>Ich wende mich an Sie daher nicht lediglich wegen eines sozialen oder individuellen Konflikts mit dem Jobcenter. Ich ersuche Sie um Prüfung, ob das Vorgehen der öffentlichen Stellen in meinem Fall Anzeichen für ein weitergehendes Problem im Hinblick auf die Achtung der Rechte eines EU-Bürgers, die Grundsätze der Rechtsstaatlichkeit, eine ordnungsgemäße Ausübung öffentlicher Gewalt und die tatsächliche Erfüllung des Zwecks des Systems der sozialen und beruflichen Integration aufweist.</p>
          <p>Als besonders schwerwiegend empfinde ich, dass das System der öffentlichen Förderung von Beschäftigung, sozialer Integration und der Aufnahme einer selbständigen Erwerbstätigkeit aus öffentlichen Mitteln finanziert wird und auf Ebene der Europäischen Union auch durch Instrumente wie den Europäischen Sozialfonds Plus unterstützt wird. Der ESF Plus ist seiner Zielsetzung nach unter anderem auf die Unterstützung arbeitsloser Menschen, soziale Inklusion, berufliche Integration und Unternehmertum ausgerichtet. Damit geht es gerade um Bereiche, die auch meine Situation unmittelbar betreffen: Ich versuche, durch eigene unternehmerische Tätigkeit meine existenzielle Abhängigkeit vom Sozialsystem zu überwinden.</p>
          <p>Zur Finanzierung nationaler und europäischer öffentlicher Haushalte tragen Bürgerinnen und Bürger durch Steuern und weitere öffentliche Abgaben bei, einschließlich meiner Person. Umso absurder empfinde ich eine Situation, in der das öffentliche System über finanzielle Instrumente zur sozialen Eingliederung, zur Rückkehr in den Arbeitsmarkt und zur Förderung selbständiger Erwerbstätigkeit verfügt, während mir das Jobcenter trotz meiner wiederholten Anträge weder die finanzielle Sicherung meiner grundlegenden Existenz noch die finanzielle Unterstützung gewährt hat, die ich ordnungsgemäß beantragt habe und die die Rechtsordnung ausdrücklich als Instrument zur Förderung der Aufnahme einer selbständigen Erwerbstätigkeit vorsieht.</p>
          <p>Die deutsche Rechtsordnung legt den Zweck dieses Systems eindeutig fest. Nach § 14 SGB II sollen die zuständigen Leistungsträger erwerbsfähige Personen bei ihrer Eingliederung in Arbeit und bei der Überwindung ihrer Hilfebedürftigkeit unterstützen. Daraus folgt, dass die Aufgabe des Jobcenters nicht lediglich in einer passiven administrativen Bearbeitung einer Akte bestehen darf, sondern in einer aktiven Unterstützung mit dem Ziel der wirtschaftlichen Selbständigkeit der betroffenen Person.</p>
          <p>Gerade die Aufnahme einer eigenen selbständigen Erwerbstätigkeit erkennt das Gesetz ausdrücklich als Weg zur Überwindung der Hilfebedürftigkeit an. Nach § 16b Abs. 1 SGB II kann einer erwerbsfähigen Person bei Aufnahme einer selbständigen Erwerbstätigkeit Einstiegsgeld gewährt werden, wenn dies zur Eingliederung in den allgemeinen Arbeitsmarkt erforderlich ist. Ziel dieses Instruments ist die Überwindung der Hilfebedürftigkeit. Nach § 16b Abs. 2 SGB II kann Einstiegsgeld während der Ausübung der Tätigkeit für höchstens 24 Monate erbracht werden.</p>
          <p>Ebenso ermöglicht § 16c Abs. 1 SGB II ausdrücklich, einer erwerbsfähigen Person, die eine selbständige hauptberufliche Tätigkeit aufnimmt oder ausübt, Darlehen oder Zuschüsse für die Beschaffung von Sachgütern zu gewähren, die für diese Tätigkeit notwendig und angemessen sind. Die Höhe eines Zuschusses kann nach dem Gesetz bis zu 5.000 Euro betragen. Im Rahmen des § 16c SGB II ist außerdem die wirtschaftliche Tragfähigkeit der selbständigen Tätigkeit sowie deren Eignung zu prüfen, die Hilfebedürftigkeit innerhalb eines angemessenen Zeitraums dauerhaft zu überwinden oder zu verringern.</p>
          <p>Ich behaupte nicht, dass § 16b oder § 16c SGB II einen automatischen Anspruch auf Auszahlung einer von mir konkret beantragten Summe begründet. Gerade deshalb verlange ich aber eine ordnungsgemäße, individuelle, sachliche und gesetzeskonforme Prüfung meines Antrags und nicht dessen faktisches Hinauszögern, Ignorieren oder die Reduzierung auf allgemeine Verwaltungsantworten.</p>
          <p>Ich verlange daher weder eine beliebige Vergünstigung noch ein außergewöhnliches Privileg oder Geld ohne Rechtsgrundlage. Ich verlange die Anwendung und ordnungsgemäße Prüfung jener Instrumente, die das deutsche Sozialrecht gerade für die Situation geschaffen hat, in der ein Mensch versucht, seine Abhängigkeit von Sozialleistungen durch eigene Arbeit und eine selbständige Erwerbstätigkeit zu überwinden. Rechtsgrundlage meines Begehrens sind insbesondere § 14 SGB II, § 16b SGB II und § 16c SGB II.</p>
          <p>Umso schwerwiegender bewerte ich die Tatsache, dass mir das Jobcenter trotz meiner wiederholten und ausdrücklichen Anträge nicht einmal eine finanzielle Leistung zur Sicherstellung meines Internetanschlusses gewährt hat, obwohl dieser in meiner derzeitigen Situation ein zentrales Arbeits- und Kommunikationsmittel darstellt. Dieses Vorgehen empfinde ich als maximal kaltblütig und gefühllos gegenüber meiner existenziellen Situation.</p>
          <p>Ein Internetanschluss ist für mich kein Luxus. Er ist ein grundlegendes Mittel zur Kommunikation mit dem Jobcenter, mit weiteren Behörden, Gesundheitseinrichtungen und Gerichten und zugleich eine der grundlegenden technischen Voraussetzungen meiner geplanten selbständigen Tätigkeit im Bereich Webseitenerstellung und digitaler Dienstleistungen.</p>
          <p>Wenn der Internetanschluss objektiv eine notwendige technische Voraussetzung für die geplante selbständige Tätigkeit darstellt, muss seine Erforderlichkeit auch im Zusammenhang mit § 16c Abs. 1 SGB II geprüft werden, der die Förderung notwendiger und angemessener Sachmittel im Zusammenhang mit einer selbständigen Erwerbstätigkeit ermöglicht. Ob eine konkrete Position sämtliche Voraussetzungen des § 16c SGB II erfüllt, muss das Jobcenter individuell prüfen. Es kann jedoch deren Bedeutung für den Geschäftsplan nicht ignorieren und zugleich von mir erwarten, eine selbständige Tätigkeit erfolgreich aufzubauen.</p>
          <p>Gleichzeitig handelt es sich um ein Mittel, ohne das ich heute faktisch nicht in der Lage bin, elektronische Anträge effektiv einzureichen, umfangreiche Unterlagen zu übermitteln, elektronische Mitteilungen zu empfangen, rechtliche Informationen zu recherchieren oder meine Rechte wirksam wahrzunehmen.</p>
          <p>Ich halte es deshalb für einen untragbaren Widerspruch, wenn eine Behörde von mir Kommunikation, die Vorlage von Unterlagen und die Erfüllung von Pflichten verlangt, von denen ein erheblicher Teil heute elektronisch erfolgt, zugleich meine finanzielle Notlage kennt und mir dennoch keine wirksame Lösung zur Sicherstellung eines technischen Mittels bietet, ohne das diese Kommunikation und der Aufbau meiner selbständigen Tätigkeit erheblich erschwert bis praktisch unmöglich gemacht werden.</p>
          <p>Wenn eine Behörde meine finanzielle Situation kennt, weiß, dass ich derzeit über kein Einkommen verfüge, von meinen gesundheitlichen Problemen Kenntnis hat und zugleich weiß, dass ich das Internet für die Kommunikation mit ihr selbst und mit weiteren öffentlichen Stellen benötige, dann werte ich ein solches Vorgehen als Ausdruck eines völligen Mangels an tatsächlichem Interesse an einer Lösung meiner Situation.</p>
          <p>Meine Situation ist das genaue Gegenteil von Passivität. Mein Ziel ist es, mich aus der Abhängigkeit vom Sozialsystem zu lösen, eigenes Einkommen zu erwirtschaften und meinen Lebensunterhalt durch eigene Arbeit zu finanzieren. Genau diesem Ziel entsprechen § 14, § 16b und § 16c SGB II sowie die grundlegende Ausrichtung europäischer Instrumente zur Förderung von Beschäftigung, sozialer Eingliederung und Unternehmertum.</p>
          <p>Stattdessen befinde ich mich in einer Situation, in der ich versuche, mich durch eigene Tätigkeit aus der existenziellen Abhängigkeit zu befreien, während die Behörde, deren gesetzliche Aufgabe darin besteht, meine Eingliederung in das Arbeitsleben und die Überwindung meiner Hilfebedürftigkeit zu unterstützen, mir weder eine grundlegende existenzielle Sicherheit noch eine wirksame Unterstützung bei der Schaffung der Voraussetzungen für einen selbständigen Lebensunterhalt gewährt.</p>
          <p>In Verbindung damit, dass über meinen Antrag auf Grundsicherungsgeld weiterhin nicht entschieden wurde und mein Krankenversicherungsstatus nach wie vor ungeklärt ist, führt dieses Vorgehen zu einer Situation, in der ich gezwungen bin, selbst um die Aufrechterhaltung der elementaren Voraussetzungen für die Kommunikation mit dem Staat zu kämpfen. Meine existenzielle und gesundheitliche Situation bleibt dabei akut.</p>
          <p>Gerade diesen Widerspruch sehe ich als einen der Gründe dafür, weshalb mein Fall nicht auf einen gewöhnlichen individuellen Streit über eine Sozialleistung reduziert werden kann. Es geht um die Frage, ob Instrumente, die zur Förderung sozialer Eingliederung, beruflicher Integration und wirtschaftlicher Selbständigkeit von Bürgerinnen und Bürgern geschaffen und finanziert wurden, im konkreten Fall ihren gesetzlichen und öffentlichen Zweck tatsächlich erfüllen.</p>
          <p>Ich fordere Sie daher auf, meinen umfassend dokumentierten Fall im Zusammenhang mit Ihrem Mandat und den Bereichen, für die Sie als Mitglied des Europäischen Parlaments politische Verantwortung tragen, zu prüfen.</p>
          <p>Bitte betrachten Sie die beigefügten Unterlagen als weitere Ergänzung der Dokumentation meines Falls.</p>
          <p>Vielen Dank für die Kenntnisnahme der Unterlagen. Ich erwarte Ihre Reaktion.</p>
          <p>Mit freundlichen Grüßen<br>Peter Ferenc<br>Kumhausen, Deutschland</p>

          <div class="wdfox-nested-downloads" data-freund-download-count="3">
            <div class="label">Anhänge / Downloads (3)</div>
            <a href="${FREUND_EMAIL_KRANKEN_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_EMAIL_KRANKEN_PDF_URL,'DRINGEND – Existenzsicherung Krankenversicherung.pdf')">⬇️ DRINGEND – Existenzsicherung Krankenversicherung.pdf herunterladen</a>
            <a href="${FREUND_EMAIL_SK_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_EMAIL_SK_PDF_URL,'Text tela emailu_SK.pdf')">⬇️ Text tela emailu_SK.pdf herunterladen</a>
            <a href="${FREUND_EMAIL_POSTFACH_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_EMAIL_POSTFACH_PDF_URL,'postfachnachricht-05.10.2026 10_16.pdf')">⬇️ postfachnachricht-05.10.2026 10_16.pdf herunterladen</a>
          </div>
        </div>
      </div>`;
    var health = document.getElementById('jobcenter-krankenversicherung-2026-10-05');
    if (health && health.parentNode) health.insertAdjacentElement('beforebegin', section);
    else {
      var firstEvidence = document.querySelector('section.attachment.evidence-section');
      if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section); else document.body.appendChild(section);
    }
    return true;
  }

  function addKrankenversicherungMessage(){
    if (document.getElementById('jobcenter-krankenversicherung-2026-10-05')) return true;
    var section = document.createElement('section');
    section.id = 'jobcenter-krankenversicherung-2026-10-05';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '18px';
    section.innerHTML = `
      <style>
        #jobcenter-krankenversicherung-2026-10-05 .outlook-view-body{padding:10px 14px!important;display:block!important;white-space:normal!important;line-height:1.3!important}
        #jobcenter-krankenversicherung-2026-10-05 .outlook-view-body p{margin:0 0 4px!important;padding:0!important;min-height:0!important;line-height:1.3!important}
        #jobcenter-krankenversicherung-2026-10-05 .outlook-view-body ul{margin:1px 0 4px!important;padding-left:24px!important}
        #jobcenter-krankenversicherung-2026-10-05 .outlook-view-body li{margin:0 0 2px!important;line-height:1.3!important}
        #jobcenter-krankenversicherung-2026-10-05 .jc-compact-title{font-weight:700;margin:0 0 5px}
        #jobcenter-krankenversicherung-2026-10-05 .jc-compact-separator{font-family:monospace;color:#666;overflow:hidden;white-space:nowrap;margin:2px 0}
        #jobcenter-krankenversicherung-2026-10-05 .jc-pdf-label{font-weight:700;margin:0 0 5px}
      </style>
      <hr class="evidence-divider">
      <p class="update-date">Aktualisiert am: 05.10.2026 | 10:16</p>
      <h2>Krankenversicherung und notwendige zahnärztliche Behandlung – Nachricht an das Jobcenter</h2>
      <div class="outlook-card" style="border:2px solid #1877F2;background:#f7fbff">
        <div class="outlook-card-title">📨 Reaktion auf Ihr Schreiben vom 29.09.2026</div>
        <div class="outlook-card-note">Am 05.10.2026 um 10:16 Uhr an das Jobcenter Landkreis Landshut übermittelt.</div>
        <details class="outlook-details">
          <summary class="outlook-summary">📄 Schreiben im Browser anzeigen / ausblenden</summary>
          <div class="outlook-view">
            <div class="outlook-view-head"><div class="outlook-view-meta"><strong>Datum:</strong> 05.10.2026 | 10:16<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Jobcenter Landkreis Landshut<br><strong>Betreff:</strong> Reaktion auf Ihr Schreiben vom 29.09.2026</div></div>
            <div class="outlook-view-body" style="padding:10px 14px;line-height:1.3;text-align:justify;text-justify:inter-word;hyphens:auto;white-space:normal">
              <div class="jc-compact-title">postfachnachricht-05.10.2026 10_16</div>
              <p>Sehr geehrte Damen und Herren,</p>
              <p>in Bezug auf Ihr Schreiben vom 29.09.2026 übersende ich Ihnen in der Anlage meine aktuelle Stellungnahme zu meiner existenziellen Situation, meinem Krankenversicherungsschutz und der notwendigen zahnärztlichen Behandlung.</p>
              <p>Ich reagiere damit insbesondere auf Ihren Hinweis zur Kranken- und Pflegeversicherung für den Zeitraum, in dem über meinen Anspruch auf Grundsicherungsgeld noch nicht entschieden wurde. <a href="${JC_SCHREIBEN_2909_URL}" target="_blank" rel="noopener noreferrer" style="color:#0b57d0;text-decoration:underline">20260929_080455_SCHREIBEN</a></p>
              <p>Es ist nicht ausreichend, mich lediglich an die AOK Bayern zu verweisen, wenn der Grund dafür, dass mein Krankenversicherungsschutz über das Jobcenter bislang nicht zustande gekommen ist, darin liegt, dass über meinen Antrag auf Grundsicherungsgeld noch immer nicht entschieden wurde. Das Jobcenter selbst muss unverzüglich über meinen Anspruch entscheiden und im Falle der Bewilligung der Leistung meinen Kranken- und Pflegeversicherungsschutz sicherstellen. Die AOK allein kann die Entscheidung des Jobcenters über meinen Anspruch auf Grundsicherungsgeld nicht ersetzen.</p>
              <p>Zugleich möchte ich Sie darauf hinweisen, dass das Textfeld in Ihrem elektronischen Kommunikationssystem kein standardmäßiges Verfassen und Formatieren längerer Nachrichten ermöglicht. Bei Überschreitung des zulässigen Umfangs erscheint folgende Fehlermeldung:</p>
              <p>„Der Inhalt überschreitet die Anzahl der erlaubten Zeichen. Der Text wurde auf 5000 Zeichen gekürzt.“</p>
              <p>Aus diesem Grund bin ich gezwungen, ausführlichere Stellungnahmen und Mitteilungen als PDF-Dokumente im Anhang zu übermitteln, damit deren Inhalt nicht automatisch gekürzt wird und der vollständige Wortlaut meiner Eingaben erhalten bleibt.</p>
              <p>Ich bitte Sie daher, das beigefügte PDF-Dokument als vollständigen Bestandteil dieser Nachricht zu betrachten und dessen Inhalt in vollem Umfang zur Kenntnis zu nehmen.</p>
              <p>Ich bitte um unverzügliche Kenntnisnahme des beigefügten Dokuments und um eine konkrete schriftliche Stellungnahme ohne weitere Verzögerung.</p>
              <p style="margin-bottom:6px!important">Mit freundlichen Grüßen<br>Peter Ferenc<br>Kumhausen, Deutschland</p>
              <div class="jc-compact-separator">======================================================</div>
              <div class="jc-pdf-label">pdf Anhang: DRINGEND – Existenzsicherung Krankenversicherung.pdf</div>
              <p>Sehr geehrte Damen und Herren,</p>
              <p>Ihr Hinweis, dass ich in der Zeit, in der ich kein Grundsicherungsgeld erhalte, nicht durch den zuständigen Leistungsträger kranken- und pflegeversichert werde, löst meine tatsächliche Situation nicht. In Ihrem eigenen Schreiben führen Sie aus, dass während eines Zeitraums ohne Bezug von Grundsicherungsgeld die Kranken- und Pflegeversicherung nicht über den zuständigen Leistungsträger erfolgt und dass ich mich an meine Krankenkasse wenden soll.</p>
              <p>Meinen Antrag auf Grundsicherungsgeld habe ich bereits am 02.09.2026 gestellt. Das Jobcenter hat erfasst, dass ich derzeit über kein Einkommen verfüge und dass mein Leistungsanspruch weiterhin geprüft wird.</p>
              <p>Zugleich habe ich Ihnen bereits mitgeteilt, dass ich mein Gewerbe derzeit nicht aktiv ausübe. In Ihrem eigenen Schreiben führen Sie aus, dass es in diesem Fall genügt, Ihnen dies mitzuteilen, und dass dann keine weiteren Unterlagen erforderlich sind.</p>
              <p>Bereits in meinem ursprünglichen Antrag habe ich Sie darüber informiert, dass ich mich in einer akuten finanziellen Notlage befinde, nicht über ausreichende Mittel zur Sicherung meiner grundlegenden Lebensbedürfnisse verfüge und erhebliche Zahnprobleme habe.</p>
              <p>Am 24.09.2026 habe ich Sie darüber hinaus ausdrücklich und gesondert um die unverzügliche Sicherstellung meines Krankenversicherungsschutzes bei der AOK Bayern gebeten. Ich habe Sie darüber informiert, dass ich bereits eine zahnärztliche Untersuchung hatte, dass bei mir wiederholt Zahnfleischentzündungen auftreten, mehrere Zähne locker sind, ich Schmerzen habe und eine weitere zahnärztliche Behandlung dringend erforderlich ist. Ebenso habe ich ausdrücklich darauf hingewiesen, dass ich für die notwendige Behandlung dringend einen bestehenden Krankenversicherungsschutz benötige.</p>
              <p>Das Problem der Sicherstellung meines Krankenversicherungsschutzes kann daher nicht ungelöst bleiben, nur weil das Jobcenter über meinen Antrag auf Grundsicherungsgeld noch nicht entschieden hat. Meine gesundheitlichen Bedürfnisse und die notwendige zahnärztliche Behandlung können nicht bis zum Abschluss des Verwaltungsverfahrens und bis zur Bewilligung des Grundsicherungsgeldes warten.</p>
              <p>Wenn die abschließende Entscheidung über meinen Antrag mehr Zeit in Anspruch nimmt, fordere ich Sie auf, die gesetzlichen Möglichkeiten einer vorläufigen Sicherung meines Anspruchs unverzüglich zu prüfen und anzuwenden.</p>
              <p>Nach § 41a SGB II kann unter den gesetzlichen Voraussetzungen eine vorläufige Entscheidung über Leistungen getroffen werden, wenn die abschließende Feststellung des Anspruchs oder seiner Höhe noch nicht unmittelbar möglich ist. Der Zweck einer solchen Regelung besteht gerade darin, zu verhindern, dass ein Mensch während der Prüfung seines Anspruchs ohne die zur Sicherung seines Existenzminimums erforderlichen Mittel bleibt.</p>
              <p>Zugleich verweise ich auf § 42 SGB I, der die Möglichkeit eines Vorschusses auf eine Geldleistung vorsieht, wenn ein Anspruch dem Grunde nach besteht, die Feststellung seiner genauen Höhe oder die abschließende Entscheidung jedoch weitere Zeit in Anspruch nimmt. In meinem Fall ist seit der Antragstellung am 02.09.2026 jedoch bereits mehr als ein Monat vergangen, und das Jobcenter hatte ausreichend Zeit, meine Situation zu prüfen. Daher bin ich der Auffassung, dass kein angemessener Grund für eine weitere Verzögerung der Entscheidung oder dafür besteht, meine existenzielle und gesundheitliche Situation weiterhin ungelöst zu lassen.</p>
              <p>Bereits in meinem ursprünglichen Antrag habe ich ausdrücklich darum gebeten, im Falle einer längeren Bearbeitungsdauer zu prüfen, ob eine vorläufige Entscheidung oder die Gewährung eines Vorschusses möglich ist, damit mein notwendiger Lebensunterhalt bis zur abschließenden Entscheidung gesichert wird.</p>
              <p>Der Krankenversicherungsschutz von Personen, die Leistungen nach dem SGB II beziehen, steht zudem im Zusammenhang mit der gesetzlichen Pflichtversicherung nach § 5 Abs. 1 Nr. 2a SGB V. Es ist daher nicht hinnehmbar, dass die Folge einer langwierigen Bearbeitung meines Antrags faktisch darin besteht, dass ich ohne tatsächlich gesicherten Zugang zu notwendiger medizinischer und zahnärztlicher Versorgung bleibe.</p>
              <p>Sollte das Jobcenter trotz meiner nachgewiesenen finanziellen und gesundheitlichen Notlage nicht rechtzeitig entscheiden oder keine angemessene vorläufige Lösung sicherstellen, werde ich gezwungen sein, mich an das zuständige Sozialgericht zu wenden und vorläufigen Rechtsschutz nach § 86b Abs. 2 SGG zu beantragen, soweit dies erforderlich ist, um weitere erhebliche Nachteile und gesundheitliche Folgen abzuwenden.</p>
              <p>Ich fordere Sie daher auf,</p>
              <ul>
                <li>unverzüglich über meinen Antrag auf Grundsicherungsgeld zu entscheiden,</li>
                <li>unverzüglich die Sicherstellung meines Krankenversicherungsschutzes bei der AOK Bayern zu klären,</li>
                <li>sofern eine abschließende Entscheidung weiterhin nicht möglich sein sollte, sofort eine vorläufige Entscheidung nach § 41a SGB II beziehungsweise die Gewährung eines Vorschusses nach § 42 SGB I zu prüfen,</li>
                <li>mir schriftlich mitzuteilen, welche konkrete Maßnahme Sie zur Sicherung meiner grundlegenden Lebensbedürfnisse und meines Zugangs zu notwendiger medizinischer und zahnärztlicher Versorgung ergreifen werden.</li>
              </ul>
              <p>Es ist für mich nicht hinnehmbar, dass ich trotz eines ordnungsgemäß gestellten und weiterhin nicht entschiedenen Antrags ohne Einkommen, ohne ausreichende Mittel zur Ernährung und zugleich ohne tatsächlich gesicherten Zugang zu notwendiger zahnärztlicher Behandlung bleibe.</p>
              <p>Aufgrund meiner akuten existenziellen und gesundheitlichen Situation fordere ich eine sofortige Bearbeitung dieser Angelegenheit und eine schriftliche Antwort ohne weitere Verzögerung.</p>
              <p>Mit freundlichen Grüßen<br>Peter Ferenc<br>Kumhausen, Deutschland</p>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin:7px 0 0">
                <a href="${KRANKEN_POSTFACH_PDF_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:9px 12px;border:1px solid #1877F2;border-radius:8px;background:#fff;color:#0b57d0;font-weight:700;text-decoration:none">📄 postfachnachricht-05.10.2026 10_16.pdf öffnen</a>
                <a href="${KRANKEN_ANHANG_PDF_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:9px 12px;border:1px solid #1877F2;border-radius:8px;background:#fff;color:#0b57d0;font-weight:700;text-decoration:none">📄 DRINGEND – Existenzsicherung Krankenversicherung.pdf öffnen</a>
              </div>
            </div>
          </div>
        </details>
      </div>`;
    var existenz = document.getElementById('jobcenter-existenz-message-2026-10-04');
    if (existenz && existenz.parentNode) existenz.insertAdjacentElement('beforebegin', section);
    else {
      var firstEvidence = document.querySelector('section.attachment.evidence-section');
      if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section); else document.body.appendChild(section);
    }
    return true;
  }

  function addDanielFreundLetter(){
    if (document.getElementById('daniel-freund-letter-2026-10-04')) return true;
    var section = document.createElement('section');
    section.id = 'daniel-freund-letter-2026-10-04';
    section.className = 'attachment evidence-section';
    section.style.marginTop = '34px';
    section.innerHTML = `
      <hr class="evidence-divider">
      <p class="update-date">Aktualisiert am: 04.10.2026</p>
      <h2>Schreiben an Daniel Freund, Mitglied des Europäischen Parlaments</h2>
      <div class="outlook-card" style="border:2px solid #ff5a00;background:#fffaf6">
        <div class="outlook-card-title">📨 Antrag auf Einschreiten und Prüfung einer möglichen Verletzung der Rechte eines EU-Bürgers in Deutschland nach Meldung eines Verdachts auf Kartellbetrug</div>
        <div class="outlook-card-note">Dokumentation meines Schreibens an den Europaabgeordneten Daniel Freund vom 04.10.2026.</div>
        <details class="outlook-details">
          <summary class="outlook-summary">📄 Schreiben im Browser anzeigen</summary>
          <div class="outlook-view">
            <div class="outlook-view-head"><div class="outlook-view-meta"><strong>Datum:</strong> 04.10.2026<br><strong>Absender:</strong> Peter Ferenc<br><strong>Adressat:</strong> Daniel Freund, MdEP<br><strong>Kopie (CC):</strong> Tomáš Zdechovský (tomas.zdechovsky@europarl.europa.eu); Amtsgericht Landshut (poststelle@ag-la.bayern.de); Sozialgericht Landshut (poststelle@sg-landshut.justiz.bayern.de); Bundesamt für Justiz (hinweisgeberstelle@bfj.bund.de)</div></div>
            <div class="outlook-view-body" style="padding:18px;line-height:1.65;text-align:justify;text-justify:inter-word;hyphens:auto">
              <p><strong>Betreff: Antrag auf Einschreiten und Prüfung einer möglichen Verletzung der Rechte eines EU-Bürgers in Deutschland nach Meldung eines Verdachts auf Kartellbetrug</strong></p>
              <p>Sehr geehrter Herr Abgeordneter Freund,</p>
              <p>ich wende mich an Sie als Bürger der Europäischen Union mit Wohnsitz in Deutschland und zugleich an Sie als Mitglied des Europäischen Parlaments, das sich seit Jahren mit Korruptionsbekämpfung, Rechtsstaatlichkeit, Transparenz staatlichen Handelns und dem Schutz der finanziellen Interessen der Europäischen Union befasst.</p>
              <p>Ich möchte Sie über eine Situation informieren, die bei mir die ernsthafte Sorge auslöst, dass ich nach der Meldung eines Verdachts auf einen Kartellbetrug im Telekommunikationssektor und nach Hinweisen auf ein mögliches Versagen oder eine mögliche Beteiligung deutscher öffentlicher Stellen mit Maßnahmen und Abläufen konfrontiert bin, die meinen Zugang zur Justiz, zu grundlegenden öffentlichen Leistungen und inzwischen auch zu einer ordnungsgemäßen Gesundheitsversorgung erheblich erschweren. In meinem Fall besteht aktuell ein dringender zahnmedizinischer Behandlungsbedarf.</p>
              <p>Zur Untermauerung meiner Angaben verfüge ich über umfangreiche Unterlagen und Beweismittel, die ich Ihnen für eine unabhängige Prüfung zur Verfügung stellen kann. Einen Teil der Dokumentation veröffentliche ich fortlaufend unter <a href="https://www.foxprof.club/jobcenter/" target="_blank" rel="noopener">https://www.foxprof.club/jobcenter/</a>. Ergänzend dokumentiere ich den Fall auch in einem <a href="${FACEBOOK_POST_URL}" target="_blank" rel="noopener">Facebook-Beitrag</a>.</p>
              <p>Die Tatsache, dass in der Sache bislang keine rechtskräftige Entscheidung vorliegt, kann aus meiner Sicht nicht als Beweis dafür angesehen werden, dass meine Hinweise unbegründet wären, insbesondere dann nicht, wenn gerade das Verhalten öffentlicher Stellen Gegenstand meiner Beanstandung ist und nach meiner Auffassung eine wirksame Untersuchung sowie den Zugang zur Justiz erschwert.</p>
              <p>Wenn eine Person oder Institution, die öffentlich den Kampf gegen Korruption, den Schutz der Rechtsstaatlichkeit und die Kontrolle staatlicher Macht vertritt, sich weigern würde, konkrete Beweismittel eines EU-Bürgers überhaupt sachlich zu prüfen, würde dies für mich einen erheblichen Widerspruch zwischen dem öffentlich erklärten Anspruch und dem praktischen Umgang mit einem konkreten Fall darstellen.</p>
              <p>Ich verlange nicht, dass Sie meine Angaben ungeprüft übernehmen. Ich bitte Sie jedoch, sie angesichts ihrer Schwere zu prüfen und zu beurteilen, ob das Vorgehen deutscher Stellen mir gegenüber mit den Grundsätzen der Rechtsstaatlichkeit, Gleichbehandlung und dem Schutz der Grundrechte eines Unionsbürgers vereinbar ist.</p>
              <p>Ich habe in Deutschland fünf Jahre gearbeitet und nach meinen Unterlagen mehr als 130.000 EUR an Steuern und Sozialabgaben gezahlt. Nun befinde ich mich in einer existenziellen Notlage. Seit mehr als einem Monat erhalte ich vom Jobcenter im Wesentlichen Gutscheine im Wert von 25 EUR für Lebensmittel, ohne dass bislang eine reguläre finanzielle Leistung zur Deckung meiner übrigen grundlegenden Lebenshaltungskosten erfolgt ist.</p>
              <p>Am 02.09.2026 habe ich Leistungen zur Sicherung des Lebensunterhalts beantragt. Das Jobcenter Landkreis Landshut hat selbst bestätigt, dass mein Antrag an diesem Tag begonnen wurde und geprüft wird, ob und in welcher Höhe ein Leistungsanspruch besteht.</p>
              <p>In meinem Antrag habe ich erklärt, dass ich derzeit ohne Beschäftigung und ohne Einkommen bin, meine eigenen Ersparnisse aufgebraucht sind und ich meine grundlegenden Lebensbedürfnisse nicht mehr aus eigenen Mitteln decken kann. Gleichzeitig habe ich um Prüfung einer Unterstützung nach dem SGB II sowie um Unterstützung beim geplanten Aufbau einer selbständigen Tätigkeit gebeten.</p>
              <p>Das Jobcenter hat später selbst festgehalten, dass ich nach meinen Angaben derzeit kein Einkommen habe und lediglich um Klärung gebeten, ob mein früher angemeldetes Gewerbe tatsächlich aktiv ausgeübt wird. Für den Fall, dass keine aktive Ausübung vorliegt, heißt es in dem Schreiben des Jobcenters, dass keine weiteren Unterlagen erforderlich seien.</p>
              <p>Trotzdem liegt auch nach mehr als einem Monat noch keine abschließende Entscheidung über eine angemessene finanzielle Unterstützung vor. Auf meine existenzielle Situation habe ich das Jobcenter wiederholt hingewiesen und um eine ordnungsgemäße, faire und unverzügliche Entscheidung gebeten.</p>
              <p>Die Situation wirkt sich inzwischen unmittelbar auf meine Gesundheit aus. Bereits am 24.09.2026 habe ich das Jobcenter dringend aufgefordert, meinen Krankenversicherungsschutz bei der AOK Bayern zu klären, da ich erhebliche Zahn- und Zahnfleischprobleme, Schmerzen und weiteren Behandlungsbedarf habe.</p>
              <p>Meine Situation ist damit nicht mehr nur eine Frage einer verspäteten Sozialleistung. Es geht um das Zusammentreffen mehrerer Umstände, die meine grundlegenden Rechte berühren können: Zugang zur Existenzsicherung, Zugang zur Gesundheitsversorgung, die Möglichkeit, eine eigene Einkommensgrundlage aufzubauen, und vor allem die Möglichkeit, meine Rechte wirksam geltend zu machen.</p>
              <p>Ich bin der Auffassung, dass das Verhalten öffentlicher Stellen mir gegenüber auch im Zusammenhang mit meinen früheren Meldungen über den Verdacht eines Kartellbetrugs und über ein mögliches Versagen öffentlicher Stellen bei dessen Aufklärung geprüft werden sollte.</p>
              <p>Ich verlange keine Sonderprivilegien. Ich verlange, dass ich als Bürger der Europäischen Union nach Recht und Gesetz behandelt werde, ohne nachteilige Folgen wegen der Meldung eines möglichen rechtswidrigen Verhaltens und ohne administrative Hindernisse, die mir den Zugang zu grundlegenden öffentlichen Leistungen oder zu meinen Grundrechten faktisch nehmen.</p>
              <p>Ich bitte Sie daher, meinen Fall unter dem Gesichtspunkt des Schutzes der Rechte eines Unionsbürgers, der Rechtsstaatlichkeit und eines möglichen vergeltenden oder diskriminierenden Vorgehens öffentlicher Stellen zu prüfen; zu erwägen, ob eine Befassung der zuständigen deutschen Stellen, der Europäischen Kommission oder anderer einschlägiger europäischer Institutionen angezeigt ist; nach Möglichkeit eine Erklärung dazu einzuholen, warum trotz dokumentierter existenzieller Not auch nach mehr als einem Monat noch nicht abschließend über meine grundlegende soziale Absicherung entschieden wurde; zu prüfen, ob mir dadurch faktisch auch der Zugang zur Gesundheitsversorgung erschwert wird; und zu prüfen, ob ein Zusammenhang zwischen dem Vorgehen öffentlicher Stellen mir gegenüber und meinen früheren Meldungen über mögliche Kartell- oder Korruptionsvorgänge besteht.</p>
              <p>Ich bin bereit, Ihnen die vollständige Chronologie des Falls, meine Korrespondenz mit deutschen Behörden, die Unterlagen des Jobcenters, Nachweise zu meiner finanziellen Situation sowie weitere Beweismittel zur Verfügung zu stellen.</p>
              <p>Mein Ziel ist kein politischer Konflikt mit Deutschland. Mein Ziel ist, dass meine Rechte als Bürger der Europäischen Union respektiert werden und staatliche Stellen rechtmäßig, transparent und ohne sachwidrige Behinderungen handeln.</p>
              <p>Bitte teilen Sie mir mit, ob Sie sich mit meinem Fall befassen werden und auf welchem Weg ich Ihnen die vollständige Dokumentation übermitteln soll.</p>
              <p>Mit freundlichen Grüßen<br>Peter Ferenc<br>Kumhausen, Deutschland</p>
              <img src="${POSTER_URL}" alt="Jahrelange Arbeit – und dann?" style="display:block;width:100%;height:auto;margin:26px auto 0;border:0;border-radius:10px;box-shadow:0 3px 16px rgba(0,0,0,.2)">
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
                <a href="${GUTSCHEIN_URL}" onclick="event.preventDefault();downloadFile(GUTSCHEIN_URL,'Gutschein.jpg')" style="display:inline-block;padding:10px 14px;border:1px solid #cfcfcf;border-radius:8px;background:#fff;color:#111;font-weight:700;text-decoration:none;cursor:pointer">⬇️ Gutschein.jpg herunterladen</a>
                <a href="${FREUND_SK_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_SK_PDF_URL,'Freund Daniel_list_SK.pdf')" style="display:inline-block;padding:10px 14px;border:1px solid #cfcfcf;border-radius:8px;background:#fff;color:#111;font-weight:700;text-decoration:none;cursor:pointer">⬇️ Freund Daniel_list_SK.pdf herunterladen</a>
              </div>
            </div>
          </div>
        </details>
      </div>`;
    var firstEvidence = document.querySelector('section.attachment.evidence-section');
    if (firstEvidence && firstEvidence.parentNode) firstEvidence.insertAdjacentElement('beforebegin', section); else document.body.appendChild(section);
    return true;
  }

  function addStandalonePoster(){
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
    img.style.cssText = 'display:block;width:100%;height:auto;max-width:1672px;margin:0 auto;border:0;border-radius:10px;box-shadow:0 3px 16px rgba(0,0,0,.2)';
    var linkWrap = document.createElement('div');
    linkWrap.style.cssText = 'display:flex;justify-content:center;margin:18px 0 0';
    var fb = document.createElement('a');
    styleFacebookIcon(fb, 52);
    linkWrap.appendChild(fb);
    poster.appendChild(img);
    poster.appendChild(linkWrap);
    document.body.appendChild(poster);
    return true;
  }

  function groupFreundWithKranken05Oct(){
    var krank = document.getElementById('jobcenter-krankenversicherung-2026-10-05');
    var freund = document.getElementById('daniel-freund-email-2026-10-05');
    if (!krank || !freund) return false;
    if (freund.parentElement === krank && freund.getAttribute('data-wdfox-same-day') === '1') return true;

    // The 05.10 Jobcenter message and the 05.10 Freund email belong to one visual day block.
    // Keep one top orange divider/date and move the Freund card below the first 05.10 message.
    Array.from(freund.querySelectorAll(':scope > .evidence-divider, :scope > .update-date')).forEach(function(el){ el.remove(); });
    freund.className = 'wdfox-same-day-followup';
    freund.setAttribute('data-wdfox-same-day', '1');
    freund.style.marginTop = '22px';
    freund.style.pageBreakBefore = 'auto';
    freund.style.breakBefore = 'auto';
    var heading = freund.querySelector(':scope > h2');
    if (heading) heading.style.marginTop = '0';
    krank.appendChild(freund);
    return true;
  }


  function moveRecentMessagesBelowMainText(){
    var documentsHeading = Array.from(document.querySelectorAll('h2')).find(function(el){
      return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise';
    });
    if (!documentsHeading) return false;

    var anchor = documentsHeading.closest('section') || documentsHeading;
    var ids = [
      'jobcenter-personal-visit-2026-10-07',
      'jobcenter-regionaldirektion-beschwerde-2026-10-06',
      'jobcenter-sozialgericht-ea-2026-10-06',
      'jobcenter-freund-warnung-2026-10-06',
      'jobcenter-krankenversicherung-2026-10-05',
      'daniel-freund-email-2026-10-05',
      'jobcenter-existenz-message-2026-10-04',
      'daniel-freund-letter-2026-10-04'
    ];

    ids.forEach(function(id){
      var node = document.getElementById(id);
      if (node && anchor.parentNode) anchor.parentNode.insertBefore(node, anchor);
    });

    var freund04 = document.getElementById('daniel-freund-letter-2026-10-04');
    if (freund04) {
      Array.from(freund04.children).forEach(function(child){
        if (child.classList && (child.classList.contains('evidence-divider') || child.classList.contains('update-date'))) child.remove();
      });
      freund04.style.marginTop = '16px';
    }

    return true;
  }

  function run(){
    addTopFacebookIcon();
    addRegionaldirektionBeschwerde20261006();
    addJobcenterPersonalVisit20261007();
    addSozialgerichtEA20261006();
    addFreundWarnung20261006();
    addDanielFreundEmail20261005();
    addDanielFreundLetter();
    addKrankenversicherungMessage();
    groupFreundWithKranken05Oct();
    addExistenzMessage();
    addPostfachCards();
    addStandalonePoster();
    moveRecentMessagesBelowMainText();
    setTimeout(function(){ addTopFacebookIcon(); addRegionaldirektionBeschwerde20261006(); addJobcenterPersonalVisit20261007(); addSozialgerichtEA20261006(); addFreundWarnung20261006(); addDanielFreundEmail20261005(); addDanielFreundLetter(); addKrankenversicherungMessage(); groupFreundWithKranken05Oct(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); groupFreundWithKranken05Oct(); }, 1200);
    setTimeout(function(){ moveRecentMessagesBelowMainText(); }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true}); else run();
})();