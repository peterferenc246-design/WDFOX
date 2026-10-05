from pathlib import Path

p = Path('public/jobcenter-poster-fix.js')
s = p.read_text(encoding='utf-8')

section_id = 'daniel-freund-email-2026-10-05'

var_marker = "  var JC_SCHREIBEN_2909_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/20260929_080455_SCHREIBEN.pdf';\n"
if 'FREUND_EMAIL_SK_PDF_URL' not in s:
    addition = (
        "  var FREUND_EMAIL_SK_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Text%20tela%20emailu_SK.pdf';\n"
        "  var FREUND_EMAIL_KRANKEN_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/DRINGEND%20%E2%80%93%20Existenzsicherung%20Krankenversicherung.pdf';\n"
        "  var FREUND_EMAIL_POSTFACH_PDF_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-05.10.2026%2010_16.pdf';\n"
    )
    if var_marker not in s:
        raise SystemExit('URL variable marker not found')
    s = s.replace(var_marker, var_marker + addition, 1)

if 'function addDanielFreundEmail20261005()' not in s:
    marker = "  function addKrankenversicherungMessage(){\n"
    if marker not in s:
        raise SystemExit('function insertion marker not found')

    block = r'''
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
        <div class="outlook-card-title">📨 Ergänzende Dokumentation zu meinem Fall – Jobcenter, Krankenversicherung, Existenzsicherung und Förderung meiner selbständigen Tätigkeit</div>
        <div class="outlook-card-note">Nachrichtentext der am 05.10.2026 übermittelten E-Mail. Veröffentlicht wird ausschließlich der Nachrichtentext; Empfängerlisten und E-Mail-Adressen werden nicht veröffentlicht.</div>
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

          <div class="wdfox-nested-downloads">
            <div class="label">Anhänge / Downloads</div>
            <a href="${FREUND_EMAIL_SK_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_EMAIL_SK_PDF_URL,'Text tela emailu_SK.pdf')">⬇️ Text tela emailu_SK.pdf herunterladen</a>
            <a href="${FREUND_EMAIL_KRANKEN_PDF_URL}" onclick="event.preventDefault();downloadFile(FREUND_EMAIL_KRANKEN_PDF_URL,'DRINGEND – Existenzsicherung Krankenversicherung.pdf')">⬇️ DRINGEND – Existenzsicherung Krankenversicherung.pdf herunterladen</a>
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

'''
    s = s.replace(marker, block + marker, 1)

run_marker = "    addDanielFreundLetter();\n"
if "    addDanielFreundEmail20261005();\n" not in s:
    if run_marker not in s:
        raise SystemExit('run insertion marker not found')
    s = s.replace(run_marker, "    addDanielFreundEmail20261005();\n" + run_marker, 1)

timeout_old = "    setTimeout(function(){ addTopFacebookIcon(); addDanielFreundLetter();"
timeout_new = "    setTimeout(function(){ addTopFacebookIcon(); addDanielFreundEmail20261005(); addDanielFreundLetter();"
if timeout_new not in s:
    if timeout_old not in s:
        raise SystemExit('timeout insertion marker not found')
    s = s.replace(timeout_old, timeout_new, 1)

p.write_text(s, encoding='utf-8')
print('patched', p)
