(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  function mount(){
    if (document.getElementById('vodafone-outlook-2026-10-02')) return;
    var heading = Array.from(document.querySelectorAll('h2')).find(function(el){
      return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise';
    });
    if (!heading) return;

    if (!document.getElementById('vodafone-evidence-style')) {
      var style = document.createElement('style');
      style.id = 'vodafone-evidence-style';
      style.textContent = '.vodafone-card{display:block;padding:14px 16px;margin:12px 0;border:1px solid #d0d0d0;border-radius:10px;color:#111;background:#fafafa}.vodafone-title{font-weight:700;margin-bottom:6px}.vodafone-note{margin-bottom:12px}.vodafone-details{margin-top:10px}.vodafone-summary{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:8px;border:1px solid #cfcfcf;background:#fff;color:#111;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.06);cursor:pointer;list-style:none}.vodafone-summary::-webkit-details-marker{display:none}.vodafone-summary:hover{background:#f0f0f0}.vodafone-view{margin-top:14px;background:#fff;border:1px solid #d9d9d9;border-radius:10px;overflow:hidden}.vodafone-head{padding:16px;border-bottom:1px solid #e4e4e4;background:#f5f7fa}.vodafone-subject{font-weight:700;font-size:1.08rem;margin-bottom:8px}.vodafone-meta{font-size:.92rem;color:#555;line-height:1.5}.vodafone-body{padding:18px;line-height:1.6}.vodafone-body p{margin:0 0 12px}.vodafone-privacy{font-size:.9rem;color:#666;margin-top:14px}';
      document.head.appendChild(style);
    }

    var card = document.createElement('div');
    card.className = 'vodafone-card';
    card.id = 'vodafone-outlook-2026-10-02';
    card.innerHTML = `
      <div class="vodafone-title">✉️ Outlook-Nachricht vom 02.10.2026 – Vodafone-Rechnung / Zahlungsaufschub</div>
      <div class="vodafone-note">Dokumentation meiner Mitteilung an Vodafone über die weiterhin ausstehende Bürgergeld-Entscheidung und meine vorübergehende finanzielle Notlage.</div>
      <details class="vodafone-details">
        <summary class="vodafone-summary">✉️ Nachricht im Browser anzeigen</summary>
        <div class="vodafone-view">
          <div class="vodafone-head">
            <div class="vodafone-subject">FW: Mobilfunkanfrage zur Vodafone-Rechnung -Id:0FA26C3AK0EU3BX7_JC-09.00 Tr.Numer</div>
            <div class="vodafone-meta"><strong>Datum:</strong> 02.10.2026<br><strong>Absender:</strong> Peter Ferenc<br><strong>Empfänger:</strong> Kundenservice Vodafone</div>
          </div>
          <div class="vodafone-body">
            <p><strong>Sehr geehrte Damen und Herren, Vodafone</strong></p>
            <p>ich wende mich mit einer dringenden Bitte bezüglich meiner noch offenen Vodafone-Rechnung an Sie:</p>
            <p>Kundennummer: 122006926<br>Rechnungsnummer: 122573899939<br>Aktuell offener Gesamtbetrag: 132,98 Euro</p>
            <p>Vielen Dank für den bereits gewährten Zahlungsaufschub bis zum 2. Oktober 2026. Das Jobcenter hat über meinen Antrag auf Bürgergeld jedoch noch nicht entschieden. Abgesehen von Lebensmittelgutscheinen im Wert von 80 Euro habe ich bislang keine Geldleistung erhalten.</p>
            <p>Da die Lebensmittelgutscheine nicht zur Begleichung meiner Vodafone-Rechnung verwendet werden können, verfüge ich derzeit objektiv nicht über die finanziellen Mittel, um den offenen Betrag zu bezahlen. Ich habe das Jobcenter bereits dringend um die Auszahlung eines Vorschusses beziehungsweise um die unmittelbare Begleichung der Vodafone-Rechnung gebeten.</p>
            <p>Meine aktuelle Situation und die laufende Kommunikation mit dem Jobcenter dokumentiere ich außerdem auf folgender Webseite:</p>
            <p><a href="https://www.foxprof.club/jobcenter/" target="_blank" rel="noopener">https://www.foxprof.club/jobcenter/</a></p>
            <p>Auf dieser Seite sind Informationen und Unterlagen verfügbar, die belegen, dass ich meinen Antrag auf Bürgergeld und meine derzeitige finanzielle Notlage aktiv mit dem Jobcenter kläre.</p>
            <p>Gemäß § 61 Absatz 4 des Telekommunikationsgesetzes (TKG) darf ein Anbieter Telekommunikationsleistungen wegen Zahlungsverzugs eines Verbrauchers nur bei Erfüllung der gesetzlichen Voraussetzungen sperren. Die beabsichtigte Sperre muss dem Verbraucher mindestens zwei Wochen vorher schriftlich angedroht werden. Dabei muss der Verbraucher auch auf die Möglichkeit hingewiesen werden, Rechtsschutz vor den Gerichten zu suchen.</p>
            <p>Ich fordere Sie daher auf, meine Mobilfunk- und Internetdienste nicht zu sperren, ohne das gesetzlich vorgeschriebene Verfahren und die gesetzliche Zweiwochenfrist nachweislich einzuhalten.</p>
            <p>Falls mir bereits eine formelle schriftliche Sperrandrohung gemäß § 61 Absatz 4 TKG zugesandt wurde, bitte ich um Mitteilung des Datums und der Art der Zustellung sowie um Übersendung einer Kopie dieses Schreibens.</p>
            <p>Unabhängig von diesem gesetzlichen Schutz bitte ich Sie angesichts meiner nachgewiesenen vorübergehenden finanziellen Notlage:</p>
            <p>1. den Zahlungsaufschub mindestens bis zum 16. Oktober 2026 zu verlängern,<br>2. meine Mobilfunk- und Internetdienste bis zu diesem Zeitpunkt nicht zu sperren,<br>3. weitere Mahnmaßnahmen auszusetzen und keine zusätzlichen Kosten zu verursachen,<br>4. mir die Verlängerung des Zahlungsaufschubs schriftlich zu bestätigen,<br>5. zu bestätigen, dass Sie bei einer gegebenenfalls beabsichtigten Sperre das Verfahren und die Zweiwochenfrist gemäß § 61 Absatz 4 TKG einhalten werden,<br>6. mir mitzuteilen, ob und wann mir bereits eine formelle schriftliche Sperrandrohung zugestellt wurde, und mir gegebenenfalls eine Kopie davon zu übersenden.</p>
            <p>Meine Mobilfunk- und Internetverbindung ist in meiner derzeitigen Situation von besonderer Bedeutung. Ich benötige sie für die Kommunikation mit dem Jobcenter, der AOK, der Agentur für Arbeit und weiteren staatlichen Stellen sowie zur elektronischen Übermittlung angeforderter Unterlagen.</p>
            <p>Ich bestreite meine Verpflichtung zur Begleichung der Rechnung nicht. Es handelt sich um eine vorübergehende finanzielle Notlage, die dadurch entstanden ist, dass ich weiterhin auf die Entscheidung und die erste Geldleistung des Jobcenters warte. Sobald mir die erforderlichen finanziellen Mittel zur Verfügung stehen, werde ich den offenen Betrag begleichen.</p>
            <p>Gleichzeitig habe ich dem Jobcenter ausdrücklich gestattet, den Betrag von 132,98 Euro unmittelbar an Vodafone zu überweisen.</p>
            <p>Da der bisherige Zahlungsaufschub heute, am 2. Oktober 2026, endet, bitte ich um eine dringende Prüfung meines Anliegens und eine unverzügliche schriftliche Antwort.</p>
            <p>Vielen Dank im Voraus für Ihr Entgegenkommen.</p>
            <p>Mit freundlichen Grüßen<br>Peter Ferenc</p>
            <p class="vodafone-privacy">E-Mail-Adressen und nicht für die öffentliche Dokumentation erforderliche Adressdaten werden hier nicht veröffentlicht.</p>
          </div>
        </div>
      </details>`;

    heading.insertAdjacentElement('afterend', card);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();
