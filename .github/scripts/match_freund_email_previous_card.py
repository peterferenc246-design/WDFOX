from pathlib import Path

path = Path('public/jobcenter-source.html')
text = path.read_text(encoding='utf-8')
section_id = 'daniel-freund-email-2026-10-05'
start = text.find(f'<section id="{section_id}"')
if start < 0:
    raise SystemExit('Freund section not found')
end = text.find('</section>', start)
if end < 0:
    raise SystemExit('Freund section end not found')
end += len('</section>')
section = text[start:end]

# Add card styles matching the previous Daniel Freund block.
style_marker = '#daniel-freund-email-2026-10-05 .outlook-card{border:2px solid #1877F2;background:#f7fbff}'
style_replacement = '''#daniel-freund-email-2026-10-05 .freund-email-shell{border:2px solid #ff5a00;border-radius:10px;padding:14px 16px;background:#fffaf7}\n        #daniel-freund-email-2026-10-05 .freund-email-shell-title{font-weight:700;margin:0 0 8px;line-height:1.35}\n        #daniel-freund-email-2026-10-05 .freund-email-shell-note{margin:0 0 12px;line-height:1.4}\n        #daniel-freund-email-2026-10-05 .freund-email-shell summary{display:inline-block;list-style:none;cursor:pointer;font-weight:700;padding:11px 16px;border:1px solid #cfcfcf;border-radius:8px;background:#fff;color:#111;box-shadow:0 1px 2px rgba(0,0,0,.08);margin:0}\n        #daniel-freund-email-2026-10-05 .freund-email-shell summary::-webkit-details-marker{display:none}\n        #daniel-freund-email-2026-10-05 .freund-email-shell details[open] > summary{margin-bottom:12px}\n        #daniel-freund-email-2026-10-05 .outlook-card{border:0;background:#fff;padding-top:2px}'''
if style_marker in section:
    section = section.replace(style_marker, style_replacement, 1)

old = '''<h2>E-Mail an Daniel Freund – Ergänzende Dokumentation zum Jobcenter-Fall</h2>\n      <details class="outlook-details wdfox-freund-email-details" id="wdfox-freund-email-details">\n        <summary class="outlook-summary" style="cursor:pointer;font-weight:700;padding:12px 14px;border:2px solid #1877F2;border-radius:10px;background:#f7fbff;margin:0 0 10px">✉️ E-Mail anzeigen / ausblenden</summary>\n        <div class="outlook-card">\n        <div class="outlook-card-title">📨 E-Mail an Daniel Freund – Ergänzende Dokumentation zu meinem Fall</div>\n        <div class="outlook-card-note">Am 05.10.2026 per E-Mail an Herrn Daniel Freund übermittelt; weitere sichtbare Empfänger waren im Cc-Verteiler aufgeführt.</div>'''
new = '''<h2>E-Mail an Daniel Freund – Ergänzende Dokumentation zum Jobcenter-Fall</h2>\n      <div class="freund-email-shell">\n        <div class="freund-email-shell-title">✉️ Ergänzende Dokumentation zu meinem Fall – Jobcenter, Krankenversicherung, Existenzsicherung und Förderung meiner selbständigen Tätigkeit</div>\n        <div class="freund-email-shell-note">Dokumentation meiner E-Mail an den Europaabgeordneten Daniel Freund vom 05.10.2026.</div>\n        <details class="outlook-details wdfox-freund-email-details" id="wdfox-freund-email-details">\n          <summary class="outlook-summary">📄 E-Mail im Browser anzeigen</summary>\n          <div class="outlook-card">'''
if old not in section:
    raise SystemExit('Expected Freund email header block not found')
section = section.replace(old, new, 1)

# Close the outer visual shell after the details element.
needle = '      </details>\n</section>'
replacement = '        </details>\n      </div>\n</section>'
if needle not in section:
    raise SystemExit('Expected Freund details closing block not found')
section = section.replace(needle, replacement, 1)

text = text[:start] + section + text[end:]
path.write_text(text, encoding='utf-8')
print('Freund email block now matches the previous orange-card layout.')
