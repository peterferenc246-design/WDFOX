from pathlib import Path

path = Path('public/jobcenter-source.html')
text = path.read_text(encoding='utf-8')
section_id = 'daniel-freund-email-2026-10-05'
start = text.find(f'<section id="{section_id}"')
if start < 0:
    raise SystemExit('Daniel Freund section not found')
end = text.find('</section>', start)
if end < 0:
    raise SystemExit('Daniel Freund section closing tag not found')
end += len('</section>')
section = text[start:end]

# Idempotent: if already collapsible, leave as-is.
if 'id="wdfox-freund-email-details"' in section:
    print('Freund email section is already collapsible.')
    raise SystemExit(0)

needle = '<div class="outlook-card">'
idx = section.find(needle)
if idx < 0:
    raise SystemExit('Freund outlook card not found')

replacement = '''<details class="outlook-details wdfox-freund-email-details" id="wdfox-freund-email-details">
        <summary class="outlook-summary" style="cursor:pointer;font-weight:700;padding:12px 14px;border:2px solid #1877F2;border-radius:10px;background:#f7fbff;margin:0 0 10px">✉️ E-Mail anzeigen / ausblenden</summary>
        <div class="outlook-card">'''
section = section[:idx] + section[idx:].replace(needle, replacement, 1)

# Close the outer collapsible immediately before the section closes.
close_idx = section.rfind('</section>')
section = section[:close_idx] + '      </details>\n' + section[close_idx:]

# The email must be collapsed initially: no `open` attribute on the details element.
if '<details class="outlook-details wdfox-freund-email-details" id="wdfox-freund-email-details" open' in section:
    raise SystemExit('Freund email details unexpectedly open by default')

text = text[:start] + section + text[end:]
path.write_text(text, encoding='utf-8')
print('Wrapped Daniel Freund email in a closed details/summary control.')
