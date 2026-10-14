#!/usr/bin/env python3
"""Install the approved Tawk bundle into an Astro dist directory.

Run as part of every build, including local preview and Pages.
The Jobcenter predproduction wrapper intentionally stays Tawk-free.
"""
import os
import re
from pathlib import Path

sha = os.environ.get("GITHUB_SHA", "local-build")

legacy_ui = re.compile(
    r'<style\b[^>]*id=["\']fox-tawk-button-style["\'][^>]*>.*?</style\s*>\s*'
    r'<div\b[^>]*id=["\']fox-tawk-button["\'][^>]*>.*?</div\s*>\s*'
    r'<script\b[^>]*id=["\']fox-tawk-lazy["\'][^>]*>.*?</script\s*>',
    re.I | re.S,
)
external_tawk = re.compile(
    r'<script\b[^>]*src=["\'][^"\']*(?:embed\.tawk\.to|tawk-language-loader\.js|tawk-native-force\.js|tawk-avatar-fix\.js|tawk-preview-[^"\']+\.js)[^"\']*["\'][^>]*>\s*</script\s*>',
    re.I | re.S,
)
inline_scripts = re.compile(r'<script\b[^>]*>.*?</script\s*>', re.I | re.S)

def clean(text: str) -> str:
    text = legacy_ui.sub('', text)
    text = external_tawk.sub('', text)

    def keep(match):
        block = match.group(0)
        markers = (
            'embed.tawk.to',
            'Tawk_API',
            'fox-tawk-launcher',
            'fox-tawk-button',
            'tawk-language-loader',
            'tawk-native-force',
            'tawk-avatar-fix',
            'tawk-preview-',
        )
        return '' if any(marker in block for marker in markers) else block

    return inline_scripts.sub(keep, text)

avatar_exists = Path('dist/tawk-avatar-fix.js').is_file()
evidence_exists = Path('dist/jobcenter-vodafone-evidence.js').is_file()
poster_fix_exists = Path('dist/jobcenter-poster-fix.js').is_file()
snippet = (
    f'<script id="fox-tawk-language-loader" src="/tawk-language-loader.js?v={sha}"></script>\n'
    f'<script id="fox-tawk-native-force" src="/tawk-native-force.js?v={sha}"></script>'
)
if avatar_exists:
    snippet += f'\n<script id="fox-tawk-avatar-fix" src="/tawk-avatar-fix.js?v={sha}"></script>'
if evidence_exists:
    snippet += f'\n<script id="wdfox-jobcenter-vodafone-evidence" src="/jobcenter-vodafone-evidence.js?v={sha}"></script>'
if poster_fix_exists:
    snippet += f'\n<script id="wdfox-jobcenter-poster-fix" src="/jobcenter-poster-fix.js?v={sha}"></script>'

files = list(Path('dist').rglob('*.html'))
if not files:
    raise SystemExit('No built HTML files found in dist')

preview_wrapper = Path('dist/privat/jobcenter-predproduction/index.html')

for path in files:
    text = clean(path.read_text(encoding='utf-8'))
    if '</body>' not in text:
        raise SystemExit(f'Missing </body> in {path}')

    # The predproduction wrapper embeds the real /jobcenter/ page in an iframe.
    # It must NOT receive its own Tawk package, otherwise two chat launchers appear:
    # one on the wrapper and one inside the Jobcenter iframe.
    if path == preview_wrapper:
        path.write_text(text, encoding='utf-8')
        continue

    text = text.replace('</body>', snippet + '\n</body>', 1)
    path.write_text(text, encoding='utf-8')

for required in ('dist/tawk-language-loader.js', 'dist/tawk-native-force.js', 'dist/jobcenter-vodafone-evidence.js', 'dist/jobcenter-poster-fix.js'):
    if not Path(required).is_file():
        raise SystemExit(f'Missing production asset: {required}')

