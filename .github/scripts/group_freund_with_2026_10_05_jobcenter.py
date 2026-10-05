from pathlib import Path
import re

path = Path('public/jobcenter-source.html')
text = path.read_text(encoding='utf-8')

freund_id = 'daniel-freund-email-2026-10-05'
freund_start = text.find(f'<section id="{freund_id}"')
if freund_start < 0:
    raise SystemExit('Freund section not found')
freund_end = text.find('</section>', freund_start)
if freund_end < 0:
    raise SystemExit('Freund section closing tag not found')
freund_end += len('</section>')
freund_section = text[freund_start:freund_end]

# Remove the standalone Freund section from its old position first.
text_wo = text[:freund_start] + text[freund_end:]

# Keep the Freund content/card, but remove its separate day divider/date wrapper so
# both 05.10.2026 messages live in the same visual day block.
inner_start = freund_section.find('>') + 1
inner = freund_section[inner_start:]
if inner.endswith('</section>'):
    inner = inner[:-len('</section>')]
inner = re.sub(r'\s*<hr class="evidence-divider">\s*', '\n', inner, count=1)
inner = re.sub(r'\s*<p class="update-date">Aktualisiert am:\s*05\.10\.2026</p>\s*', '\n', inner, count=1)
inner = inner.strip()

# Find the 05.10.2026 Jobcenter message section by its exact visible heading.
target_heading = 'Krankenversicherung und notwendige zahnärztliche Behandlung – Nachricht an das Jobcenter'
heading_pos = text_wo.find(target_heading)
if heading_pos < 0:
    raise SystemExit('05.10.2026 Krankenversicherung heading not found')

target_start = text_wo.rfind('<section', 0, heading_pos)
if target_start < 0:
    raise SystemExit('Target section start not found')
target_end = text_wo.find('</section>', heading_pos)
if target_end < 0:
    raise SystemExit('Target section end not found')

# Avoid accidental duplicate insertion.
if freund_id in text_wo[target_start:target_end]:
    raise SystemExit('Freund content already grouped with 05.10.2026 section')

# Insert immediately before the target section closes. No extra orange divider and no
# second update-date line: this makes the two 05.10 messages one grouped day block.
insert = '\n<div id="daniel-freund-email-2026-10-05" class="wdfox-same-day-followup" style="margin-top:24px">\n' + inner + '\n</div>\n'
text_new = text_wo[:target_end] + insert + text_wo[target_end:]

# Sanity checks.
if text_new.count('id="daniel-freund-email-2026-10-05"') != 1:
    raise SystemExit('Unexpected Freund section count after regrouping')
chunk_start = text_new.find(target_heading)
chunk_end = text_new.find('</section>', chunk_start)
chunk = text_new[chunk_start:chunk_end]
if 'daniel-freund-email-2026-10-05' not in chunk:
    raise SystemExit('Freund email was not inserted into the 05.10 section')
if chunk.count('Aktualisiert am: 05.10.2026') > 1:
    raise SystemExit('Duplicate 05.10 update-date line remains inside grouped section')

path.write_text(text_new, encoding='utf-8')
print('Grouped Daniel Freund email with the 05.10.2026 Jobcenter message under one day block.')
