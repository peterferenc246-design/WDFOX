import importlib.util
import os
from pathlib import Path
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / '.github/scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


scope = load('validate_tawk_scope')
sync = load('wdfox_tawk_sync')


class ScopeTests(unittest.TestCase):
    def test_real_deployment_injection_and_validation(self):
        workflow = (ROOT / '.github/workflows/deploy.yml').read_text(encoding='utf-8')
        step = workflow.split('      - name: Install approved production Tawk package')[1]
        code = textwrap.dedent(step.split("python - <<'PY'\n", 1)[1].split('\n          PY', 1)[0])
        paths = scope.HOME_PAGES | {'index.html', 'analyzer/index.html', 'jobcenter/index.html',
                                  'privat/jobcenter-predproduction/index.html', 'new-tool/index.html'}
        with tempfile.TemporaryDirectory() as tmp:
            previous = Path.cwd()
            try:
                os.chdir(tmp)
                dist = Path('dist')
                dist.mkdir()
                for filename in (*scope.CHAT_FILES, 'jobcenter-vodafone-evidence.js', 'jobcenter-poster-fix.js'):
                    (dist / filename).write_text('// asset')
                # Simulate a future layout accidentally reintroducing chat on every page.
                for path in paths:
                    target = dist / path
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text('<html><body><script src="/tawk-language-loader.js"></script>'
                                      '<script>window.Tawk_API = {};</script>'
                                      '<script src="/tool.js"></script></body></html>', encoding='utf-8')
                exec(compile(code, 'deploy.yml', 'exec'), {})
                for path in paths:
                    html = (dist / path).read_text(encoding='utf-8')
                    scope.validate_page(path, html)
                    self.assertIn('/tool.js', html)
            finally:
                os.chdir(previous)

    def test_duplicate_missing_and_forbidden_chat_fail(self):
        chat = ''.join(f'<script src="/{name}"></script>' for name in scope.CHAT_FILES)
        scope.validate_page('sk/index.html', chat)
        for path, html in [('sk/index.html', chat + chat), ('de/index.html', ''),
                           ('analyzer/index.html', chat), ('new-tool/index.html', '<script>Tawk_API={}</script>')]:
            with self.assertRaises(ValueError):
                scope.validate_page(path, html)

    def test_sync_preserves_home_only_scope(self):
        text = sync.restrict_to_home('  "use strict";\ninitialize();')
        self.assertIn(sync.HOME_ONLY_GUARD, text)
        self.assertLess(text.index(sync.HOME_ONLY_GUARD), text.index('initialize();'))


if __name__ == '__main__':
    unittest.main()
