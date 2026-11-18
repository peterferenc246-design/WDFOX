import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path


class JobcenterScriptScopeTests(unittest.TestCase):
    def test_deployment_scopes_and_deduplicates_scripts(self):
        workflow = (Path(__file__).resolve().parents[1] / '.github/workflows/deploy.yml').read_text()
        step = workflow.split('- name: Install approved production Tawk package', 1)[1]
        script = textwrap.dedent(step.split("python - <<'PY'", 1)[1].split('\n          PY', 1)[0])
        with tempfile.TemporaryDirectory() as temporary:
            dist = Path(temporary) / 'dist'
            dist.mkdir()
            for asset in ('tawk-language-loader.js', 'tawk-native-force.js', 'tawk-avatar-fix.js',
                          'jobcenter-vodafone-evidence.js', 'jobcenter-poster-fix.js'):
                (dist / asset).write_text('// fixture')
            duplicates = (
                '<script src="/jobcenter-poster-fix.js?v=old"></script>'
                '<script src="/jobcenter-poster-fix.js?v=other"></script>'
                '<script src="/jobcenter-vodafone-evidence.js?v=old"></script>'
            )
            paths = ['en/index.html', 'sk/index.html', 'analyzer/index.html',
                     'jobcenter/index.html', 'privat/jobcenter-predproduction/index.html']
            for name in paths:
                file = dist / name
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text('<html><body><h1>Keep this content</h1>' + duplicates + '</body></html>')
            # Running twice must not accumulate injected scripts.
            for _ in range(2):
                subprocess.run([sys.executable, '-c', script], cwd=temporary, check=True)
            for name in paths:
                html = (dist / name).read_text()
                self.assertIn('Keep this content', html)
                for asset in ('jobcenter-vodafone-evidence.js', 'jobcenter-poster-fix.js'):
                    self.assertEqual(html.count(asset), 1 if name == 'jobcenter/index.html' else 0, name)
                self.assertEqual(html.count('id="fox-tawk-language-loader"'),
                                 1 if name in ('en/index.html', 'sk/index.html') else 0, name)


if __name__ == '__main__':
    unittest.main()
