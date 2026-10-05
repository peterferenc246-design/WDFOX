from pathlib import Path

p = Path('src/pages/jobcenter/index.astro')
s = p.read_text(encoding='utf-8')

old_version = '2026-10-04-0815'
new_version = '2026-10-05-1338'
if old_version in s:
    s = s.replace(old_version, new_version, 1)
elif new_version not in s:
    raise SystemExit('Jobcenter version marker not found')

marker = "html = html.replace(\n  '</style>',"
if marker not in s:
    raise SystemExit('Expected style injection marker not found')

inject = "\n\n// Force the current Jobcenter runtime helper to load from the latest committed version.\nhtml = html.replace(\n  '</body>',\n  '<script src=\"/jobcenter-poster-fix.js?v=2026-10-05-1338\"></script></body>'\n);\n"

if '/jobcenter-poster-fix.js?v=2026-10-05-1338' not in s:
    # Insert immediately before the final return/export area by appending to frontmatter code.
    front_end = s.rfind('---')
    if front_end <= 3:
        raise SystemExit('Astro frontmatter closing marker not found')
    s = s[:front_end] + inject + s[front_end:]

# Safety guards: the runtime file itself must already expose exactly three Freund links.
runtime = Path('public/jobcenter-poster-fix.js').read_text(encoding='utf-8')
start = runtime.index('function addDanielFreundEmail20261005')
end = runtime.index('function addKrankenversicherungMessage', start)
block = runtime[start:end]
required = [
    'DRINGEND – Existenzsicherung Krankenversicherung.pdf',
    'Text tela emailu_SK.pdf',
    'postfachnachricht-05.10.2026 10_16.pdf',
]
for item in required:
    if item not in block:
        raise SystemExit(f'Missing required Freund attachment: {item}')
if 'data-freund-download-count="3"' not in block:
    raise SystemExit('Expected Freund three-download marker missing')

p.write_text(s, encoding='utf-8')
print('Forced latest Jobcenter runtime with cache-busting version 2026-10-05-1338.')
