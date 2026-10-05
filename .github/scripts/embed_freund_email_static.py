from pathlib import Path
import re

src = Path('public/jobcenter-source.html')
js = Path('public/jobcenter-poster-fix.js')
html = src.read_text(encoding='utf-8')
script = js.read_text(encoding='utf-8')

section_id = 'daniel-freund-email-2026-10-05'
if f'id="{section_id}"' in html:
    print('Static Freund section already present.')
    raise SystemExit(0)

start = script.index('function addDanielFreundEmail20261005')
end = script.index('function addKrankenversicherungMessage', start)
block = script[start:end]
m = re.search(r"section\.innerHTML\s*=\s*`(.*?)`;", block, re.S)
if not m:
    raise SystemExit('Could not extract Freund section innerHTML from runtime script')
inner = m.group(1)
replacements = {
    '${FREUND_EMAIL_SK_PDF_URL}': 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Text%20tela%20emailu_SK.pdf',
    '${FREUND_EMAIL_KRANKEN_PDF_URL}': 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/DRINGEND%20%E2%80%93%20Existenzsicherung%20Krankenversicherung.pdf',
    '${FREUND_EMAIL_POSTFACH_PDF_URL}': 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/postfachnachricht-05.10.2026%2010_16.pdf',
}
for old, new in replacements.items():
    inner = inner.replace(old, new)

# Remove onclick handlers so the static links work even if client JS does not execute.
inner = re.sub(r'\s+onclick="[^"]*"', '', inner)
section = f'\n<section id="{section_id}" class="attachment evidence-section" style="margin-top:34px">{inner}</section>\n'
if '</body>' not in html:
    raise SystemExit('Missing </body> in jobcenter-source.html')
html = html.replace('</body>', section + '</body>', 1)

required = [
    'DRINGEND – Existenzsicherung Krankenversicherung.pdf',
    'Text tela emailu_SK.pdf',
    'postfachnachricht-05.10.2026 10_16.pdf',
]
for item in required:
    if item not in section:
        raise SystemExit(f'Missing required attachment in static section: {item}')
if 'data-freund-download-count="3"' not in section:
    raise SystemExit('Static section does not contain the 3-download marker')

src.write_text(html, encoding='utf-8')
print('Embedded Daniel Freund email statically into public/jobcenter-source.html')
