from pathlib import Path
import re

p = Path('public/jobcenter-poster-fix.js')
s = p.read_text(encoding='utf-8')

start_marker = '  function addDanielFreundEmail20261005(){\n'
end_marker = '  function addKrankenversicherungMessage(){\n'
if start_marker not in s or end_marker not in s:
    raise SystemExit('Freund email function markers not found')
start = s.index(start_marker)
end = s.index(end_marker, start)
block = s[start:end]

visible_cc = [
    'Amira Mohamed Ali – amira.mohamedali@bundestag.de',
    'Dietmar Bartsch – dietmar.bartsch@bundestag.de',
    'CSU-Landtagsfraktion – fraktion@csu-landtag.de',
    'Christian Lindner – christian.lindner@bundestag.de',
    'AfD – kontakt@afd.de',
    'Amtsgericht Landshut – poststelle@ag-la.bayern.de',
    'Sozialgericht Landshut – poststelle@sg-landshut.justiz.bayern.de',
    'Polizei / KPI Landshut – pp-nb.landshut.kpi@polizei.bayern.de',
    'Tino Chrupalla – tino.chrupalla@bundestag.de',
    'Tomáš Zdechovský – tomas.zdechovsky@europarl.europa.eu',
    'Alojz Hlina – alojz.hlina@nrsr.sk',
    'Demokrati – press@smedemokrati.sk',
    'Kabinett Maroš Šefčovič – cab-sefcovic-contact@ec.europa.eu',
    'European Commission / Simona Giorgini – simona.giorgini@ec.europa.eu',
    'Hnutie Republika – hovorca@hnutie-republika.sk',
    'Roman Pšenák – psenak.republika@gmail.com',
    'Hnutie Republika / Milan Uhrík – kontakt@hnutie-republika.sk',
    'Igor Matovič – igor.matovic@gmail.com',
    'Igor Matovič / Slovensko – kontakt@obycajniludia.sk',
    'Jozef Kmec – kmecj@centrum.sk',
    'Július Jakab – julius.jakab@nrsr.sk',
    'Peter Kmec – peter.kmec@nrsr.sk',
    'Lucia Plaváková – Lucia.Plavakova@nrsr.sk',
    'Mária Šubová – maria.subova@nrsr.sk',
    'Milan Majerský / KDH – sekretariat@kdh.sk',
    'Milan Mazurek – mazurek@hnutie-republika.sk',
    'NOVA – info@nova.sk',
    'NOVA – nova@nova.sk',
    'Progresívne Slovensko / Michal Šimečka – info@progresivne.sk',
    'Roman Mikulec – roman.mikulec@nrsr.sk',
    'Slovensko – press@obycajniludia.sk',
    'SMER – SD – tlacove@strana-smer.sk',
    'Monika Beňová – monika.benova@europarl.europa.eu',
    'Milan Uhrík – kontakt@milanuhrik.sk',
    'Veronika Remišová – veronika.remisova@nrsr.sk',
    'ZA ĽUDÍ – press@stranazaludi.sk',
    'Zuzana Šubová – zuzana.subova@nrsr.sk',
    'Tichys Einblick – kontakt@tichyseinblick.de',
    'Junge Freiheit – leserdienst@jungefreiheit.de',
    'konkret Magazin – verlag@konkret-magazin.de',
    'konkret Magazin – redaktion@konkret-magazin.de',
    'konkret Magazin – info@konkret-magazin.de',
    'Compact Magazin – verlag@compact-mail.de',
    'Manova – geschaeftsfuehrung@manova.news',
    'NachDenkSeiten – redaktion@nachdenkseiten.de',
    'Süddeutsche Zeitung – redaktion@sz.de',
    'Frankfurter Rundschau – chefredaktion@fr.de',
    'Frankfurter Rundschau – kundenservice@fr.de',
    'WAZ – politik@waz.de',
    'WAZ – redaktion.essen@waz.de',
    'WAZ – zentralredaktion@waz.de',
    'Assistentin eines Europaabgeordneten – veronika.blazejova@europarl.europa.eu',
]
cc_html = ''.join('<li style="margin:0 0 2px">' + item.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;') + '</li>' for item in visible_cc)
new_head = (
    '<div class="outlook-view-head"><div class="outlook-view-meta">'
    '<strong>Datum:</strong> 05.10.2026<br>'
    '<strong>Absender:</strong> Peter Ferenc<br>'
    '<strong>Empfänger (An):</strong> Daniel Freund – Mitglied des Europäischen Parlaments (daniel.freund@europarl.europa.eu)<br>'
    '<strong>Betreff:</strong> Ergänzende Dokumentation zu meinem Fall – Jobcenter, Krankenversicherung, Existenzsicherung und Förderung meiner selbständigen Tätigkeit'
    '<details style="margin-top:8px"><summary style="cursor:pointer;font-weight:700">Sichtbare Empfängerliste (An / Cc) anzeigen / ausblenden</summary>'
    '<div style="margin-top:6px"><div><strong>An:</strong> Daniel Freund – daniel.freund@europarl.europa.eu</div>'
    '<div style="margin-top:5px"><strong>Cc:</strong></div><ul style="margin:3px 0 0;padding-left:22px">' + cc_html + '</ul></div></details>'
    '</div></div>'
)
block, n = re.subn(r'<div class="outlook-view-head"><div class="outlook-view-meta">.*?</div></div>', new_head, block, count=1, flags=re.S)
if n != 1:
    raise SystemExit('Freund email metadata block not replaced')

block, n = re.subn(
    r'<div class="outlook-card-note">.*?</div>',
    '<div class="outlook-card-note">Am 05.10.2026 per E-Mail an Herrn Daniel Freund übermittelt; weitere sichtbare Empfänger waren im Cc-Verteiler aufgeführt.</div>',
    block,
    count=1,
    flags=re.S,
)
if n != 1:
    raise SystemExit('Freund email note not replaced')

block, n = re.subn(
    r'<div class="outlook-card-title">.*?</div>',
    '<div class="outlook-card-title">📨 E-Mail an Daniel Freund – Ergänzende Dokumentation zu meinem Fall</div>',
    block,
    count=1,
    flags=re.S,
)
if n != 1:
    raise SystemExit('Freund email title not replaced')

# Privacy guard: these hidden-recipient addresses must never appear in the public Freund section.
for forbidden in ('advokat@advokatpeli.sk','ferencandrej97@gmail.com','jozefk09@gmail.com','pravnik@sbdtn.sk','mr.majka@gmail.com','cg.munich@mzv.sk'):
    if forbidden in block:
        raise SystemExit('Privacy guard failed: hidden recipient found')

if 'Daniel Freund – Mitglied des Europäischen Parlaments' not in block:
    raise SystemExit('Daniel Freund recipient metadata missing')
if 'Sichtbare Empfängerliste (An / Cc)' not in block:
    raise SystemExit('Visible recipient list missing')
if 'tomas.zdechovsky@europarl.europa.eu' not in block:
    raise SystemExit('Visible Cc verification failed')

s = s[:start] + block + s[end:]
# Historical Jobcenter portal message must remain correctly identified as sent to Jobcenter.
health_start = s.index(end_marker)
health_end = s.find('  function addDanielFreundLetter(){', health_start)
health_block = s[health_start:health_end if health_end != -1 else len(s)]
if 'Jobcenter Landkreis Landshut' not in health_block:
    raise SystemExit('Historical Jobcenter recipient evidence was unexpectedly altered')

p.write_text(s, encoding='utf-8')
print('Freund email recipient metadata and visible To/Cc list corrected.')
