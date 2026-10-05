from pathlib import Path

p = Path('public/jobcenter-poster-fix.js')
s = p.read_text(encoding='utf-8')
old = '''          <div class=\"wdfox-nested-downloads\">\n            <div class=\"label\">Anhänge / Downloads</div>\n            <a href=\"${FREUND_EMAIL_SK_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_SK_PDF_URL,'Text tela emailu_SK.pdf')\">⬇️ Text tela emailu_SK.pdf herunterladen</a>\n            <a href=\"${FREUND_EMAIL_KRANKEN_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_KRANKEN_PDF_URL,'DRINGEND – Existenzsicherung Krankenversicherung.pdf')\">⬇️ DRINGEND – Existenzsicherung Krankenversicherung.pdf herunterladen</a>\n            <a href=\"${FREUND_EMAIL_POSTFACH_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_POSTFACH_PDF_URL,'postfachnachricht-05.10.2026 10_16.pdf')\">⬇️ postfachnachricht-05.10.2026 10_16.pdf herunterladen</a>\n          </div>'''
new = '''          <div class=\"wdfox-nested-downloads\" data-freund-download-count=\"3\">\n            <div class=\"label\">Anhänge / Downloads (3)</div>\n            <a href=\"${FREUND_EMAIL_KRANKEN_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_KRANKEN_PDF_URL,'DRINGEND – Existenzsicherung Krankenversicherung.pdf')\">⬇️ DRINGEND – Existenzsicherung Krankenversicherung.pdf herunterladen</a>\n            <a href=\"${FREUND_EMAIL_SK_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_SK_PDF_URL,'Text tela emailu_SK.pdf')\">⬇️ Text tela emailu_SK.pdf herunterladen</a>\n            <a href=\"${FREUND_EMAIL_POSTFACH_PDF_URL}\" onclick=\"event.preventDefault();downloadFile(FREUND_EMAIL_POSTFACH_PDF_URL,'postfachnachricht-05.10.2026 10_16.pdf')\">⬇️ postfachnachricht-05.10.2026 10_16.pdf herunterladen</a>\n          </div>'''
if old not in s:
    raise SystemExit('Target Freund attachment block not found exactly; no changes made')
s = s.replace(old, new, 1)
# Guard: exactly one three-link block for this Freund email section.
start = s.index('function addDanielFreundEmail20261005')
end = s.index('function addKrankenversicherungMessage', start)
block = s[start:end]
for name in [
    'DRINGEND – Existenzsicherung Krankenversicherung.pdf',
    'Text tela emailu_SK.pdf',
    'postfachnachricht-05.10.2026 10_16.pdf',
]:
    if name not in block:
        raise SystemExit(f'Missing required attachment: {name}')
if 'data-freund-download-count="3"' not in block:
    raise SystemExit('Three-attachment marker missing')
p.write_text(s, encoding='utf-8')
print('Freund attachment block fixed to exactly three visible download links.')
