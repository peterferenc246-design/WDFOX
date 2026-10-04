/* WDFOX Jobcenter poster, evidence and Daniel Freund letter */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20%E2%80%93%20und%20dann_de.png';
  var FACEBOOK_URL = 'https://www.facebook.com/photo?fbid=980105415133071&set=a.858080437335570';
  var POSTFACH_1222_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2012_22.pdf';
  var POSTFACH_1430_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-03.10.2026%2014_30.1.pdf';
  var GUTSCHEIN_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Gutschein.jpg';
  var FREUND_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Freund%20Daniel_list_SK.pdf';

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
    textView.style.cssText = 'padding:18px 6px;line-height:1.6;min-height:220px;background:#fff;text-align:justify;text-justify:inter-word';
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
              <p>Zur Untermauerung meiner Angaben verfüge ich über umfangreiche Unterlagen und Beweismittel, die ich Ihnen für eine unabhängige Prüfung zur Verfügung stellen kann. Einen Teil der Dokumentation veröffentliche ich fortlaufend unter <a href="https://www.foxprof.club/jobcenter/" target="_blank" rel="noopener">https://www.foxprof.club/jobcenter/</a>. Ergänzend dokumentiere ich den Fall auch in einem <a href="${FACEBOOK_URL}" target="_blank" rel="noopener">Facebook-Beitrag</a>.</p>
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

  function removeStandalonePoster(){
    var existing = document.getElementById('jobcenter-social-poster-2026-10-03');
    if (existing) existing.remove();
    return true;
  }

  function run(){
    addTopFacebookIcon();
    addDanielFreundLetter();
    addPostfachCards();
    removeStandalonePoster();
    setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter(); addPostfachCards(); removeStandalonePoster(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true}); else run();
})();