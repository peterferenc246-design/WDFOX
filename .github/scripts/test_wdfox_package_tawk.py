#!/usr/bin/env python3
"""Offline regression tests for the shared Tawk artifact packager."""
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

PACKAGER = Path(__file__).resolve().with_name("wdfox_package_tawk.py")
LANGS = ("sk", "de", "en", "hr", "fr", "it", "pl", "es", "sv")


class TawkPackageTests(unittest.TestCase):
    def test_nine_languages_and_wrapper(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            dist = root / "dist"
            dist.mkdir()
            for lang in LANGS:
                folder = dist / lang
                folder.mkdir()
                (folder / "index.html").write_text(
                    '<html><body><script src="/tawk-language-loader.js?v=old"></script></body></html>',
                    encoding="utf-8",
                )
            wrapper = dist / "privat" / "jobcenter-predproduction"
            wrapper.mkdir(parents=True)
            (wrapper / "index.html").write_text(
                '<html><body><iframe id="jobcenter-preview"></iframe></body></html>',
                encoding="utf-8",
            )
            for asset in (
                "tawk-language-loader.js", "tawk-native-force.js",
                "jobcenter-vodafone-evidence.js", "jobcenter-poster-fix.js",
            ):
                (dist / asset).write_text("// fixture", encoding="utf-8")
            env = dict(os.environ, GITHUB_SHA="testsha123")
            result = subprocess.run(
                [sys.executable, str(PACKAGER)],
                cwd=root, env=env, text=True, capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            for lang in LANGS:
                html = (dist / lang / "index.html").read_text(encoding="utf-8")
                self.assertEqual(html.count('id="fox-tawk-language-loader"'), 1)
                self.assertEqual(html.count('id="fox-tawk-native-force"'), 1)
                self.assertIn('/tawk-language-loader.js?v=testsha123', html)
                self.assertIn('/tawk-native-force.js?v=testsha123', html)
                self.assertNotIn('?v=old', html)
            wrapper_html = (wrapper / "index.html").read_text(encoding="utf-8")
            self.assertNotIn('fox-tawk-language-loader', wrapper_html)
            self.assertNotIn('fox-tawk-native-force', wrapper_html)

    def test_missing_asset_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "dist").mkdir()
            (root / "dist" / "index.html").write_text(
                "<html><body></body></html>", encoding="utf-8"
            )
            result = subprocess.run(
                [sys.executable, str(PACKAGER)],
                cwd=root, text=True, capture_output=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Missing production asset", result.stderr + result.stdout)


if __name__ == "__main__":
    unittest.main()
