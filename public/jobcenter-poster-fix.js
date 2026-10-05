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

  function run(){
    addTopFacebookIcon();
    addDanielFreundLetter();
    addKrankenversicherungMessage();
    addExistenzMessage();
    addPostfachCards();
    addStandalonePoster();
    setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true}); else run();
})();