"""Fail deployment if Tawk is missing/duplicated on home or present on a tool page."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen

LOCALES = ('sk', 'de', 'en', 'hr', 'fr', 'it', 'pl', 'es', 'sv')
HOME_PAGES = {f'{lang}/index.html' for lang in LOCALES}
CHAT_FILES = ('tawk-language-loader.js', 'tawk-native-force.js', 'tawk-avatar-fix.js')


class Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []
        self.inline = []
        self.in_script = False

    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            self.in_script = True
            self.sources.append(dict(attrs).get('src', ''))

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_script = False

    def handle_data(self, text):
        if self.in_script:
            self.inline.append(text)


def validate_page(path, html, version=None):
    scripts = Scripts()
    scripts.feed(html)
    chat_sources = [s for s in scripts.sources if 'tawk' in s.lower()]
    inline_chat = any(marker in text for text in scripts.inline
                      for marker in ('embed.tawk.to', 'Tawk_API', 'fox-tawk-launcher'))
    if path not in HOME_PAGES:
        if chat_sources or inline_chat:
            raise ValueError(f'Tawk forbidden outside home: {path}')
    else:
        for filename in CHAT_FILES:
            expected = f'/{filename}'
            matches = [s for s in chat_sources if s.split('?')[0] == expected]
            if len(matches) != 1:
                raise ValueError(f'{path}: expected one {filename}, got {len(matches)}')
            if version and matches[0] != f'{expected}?v={version}':
                raise ValueError(f'{path}: stale chat asset: {matches[0]}')
        if len(chat_sources) != len(CHAT_FILES) or inline_chat:
            raise ValueError(f'{path}: unexpected extra chat initialization')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='dist')
    parser.add_argument('--live')
    parser.add_argument('--version')
    args = parser.parse_args()
    if args.live:
        paths = {f'{lang}/index.html': f'/{lang}/' for lang in LOCALES}
        paths.update({'index.html': '/', 'analyzer/index.html': '/analyzer/',
                      'analyzer/embed.html': '/analyzer/?embed=1&lang=sk',
                      'jobcenter/index.html': '/jobcenter/',
                      'privat/jobcenter-predproduction/index.html': '/privat/jobcenter-predproduction/'})
        for path, route in paths.items():
            separator = '&' if '?' in route else '?'
            url = args.live.rstrip('/') + route + separator + 'chat_scope=' + (args.version or 'check')
            with urlopen(url, timeout=30) as response:
                validate_page(path, response.read().decode('utf-8'), args.version)
        print(f'LIVE_TAWK_HOME_ONLY=OK ({len(paths)} pages)')
    else:
        root = Path(args.directory)
        files = list(root.rglob('*.html'))
        found = {p.relative_to(root).as_posix() for p in files}
        missing = HOME_PAGES - found
        if missing or 'analyzer/index.html' not in found:
            raise ValueError(f'Missing required pages: {missing}; analyzer required')
        for path in files:
            validate_page(path.relative_to(root).as_posix(), path.read_text(encoding='utf-8'), args.version)
        print(f'BUILD_TAWK_HOME_ONLY=OK ({len(files)} pages)')


if __name__ == '__main__':
    main()
