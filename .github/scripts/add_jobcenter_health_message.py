from pathlib import Path

p = Path('public/jobcenter-poster-fix.js')
s = p.read_text(encoding='utf-8')

var_marker = "  var FREUND_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Freund%20Daniel_list_SK.pdf';\n"
if "KRANKEN_POSTFACH_PDF_URL" not in s:
    addition = (
        "  var KRANKEN_POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-05.10.2026%2010_16.pdf';\n"
        "  var KRANKEN_ANHANG_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/DRINGEND%20%E2%80%93%20Existenzsicherung%20Krankenversicherung.pdf';\n"
        "  var JC_SCHREIBEN_2909_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/20260929_080455_SCHREIBEN.pdf';\n"
    )
    if var_marker not in s:
        raise SystemExit('variable marker not found')
    s = s.replace(var_marker, var_marker + addition, 1)

if "function addKrankenversicherungMessage()" not in s:
    marker = "  function addDanielFreundLetter(){\n"
    if marker not in s:
        raise SystemExit('function marker not found')
    block = r'''
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

'''
    s = s.replace(marker, block + marker, 1)

if "    addKrankenversicherungMessage();\n    addExistenzMessage();" not in s:
    s = s.replace("    addDanielFreundLetter();\n    addExistenzMessage();", "    addDanielFreundLetter();\n    addKrankenversicherungMessage();\n    addExistenzMessage();", 1)

if "setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage();" not in s:
    s = s.replace(
        "setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); }, 1200);",
        "setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); }, 1200);",
        1,
    )

p.write_text(s, encoding='utf-8')
print('jobcenter health message patch applied')
