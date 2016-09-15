import io
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from contextlib import contextmanager

try:
    from pyflakes import api
    from pyflakes.reporter import Reporter
    pyflakes = True
except ImportError:
    pyflakes = False

import gettextjs


GETTEXT_PY_FILE = os.path.abspath(gettextjs.__file__)
BASE_DIR = os.path.dirname(GETTEXT_PY_FILE)
GETTEXT_JS_FILE = os.path.join(
    BASE_DIR,
    '..',
    'js',
    'gettext.js',
)
GETTEXT_JS_COMPILED_FILE = os.path.join(
    BASE_DIR,
    '..',
    '..',
    'dist',
    'gettext.js',
)
THIS_FILE = os.path.abspath(__file__)
THIS_DIR = os.path.dirname(THIS_FILE)
TESTDATA_DIR = os.path.join(
    THIS_DIR,
    '..',
    'test_data',
)


@contextmanager
def tempdir():
    dirname = tempfile.mkdtemp()
    try:
        yield dirname
    finally:
        shutil.rmtree(dirname)


class IntegrationTests(unittest.TestCase):
    def test_compile_to_json(self):
        with tempdir() as workspace:
            gettextjs.main(['--json', TESTDATA_DIR, workspace])
            en_json_path = os.path.join(
                workspace,
                'en',
                'LC_MESSAGES',
                'messages.mo.json'
            )
            with open(en_json_path) as fobj:
                en_data = json.load(fobj)
                self.assertIn('plural', en_data)
                self.assertEqual(en_data['plural'], '(n != 1)')
                self.assertIn('catalog', en_data)
                self.assertEqual(en_data['catalog'], {
                    'simple-string': 'A simple string',
                    'singular-string': [
                        'Singular form!',
                        'Plural form!'
                    ]
                })

            ja_json_path = os.path.join(
                workspace,
                'ja',
                'LC_MESSAGES',
                'messages.mo.json'
            )
            with open(ja_json_path) as fobj:
                ja_data = json.load(fobj)
                self.assertIn('plural', ja_data)
                self.assertEqual(ja_data['plural'], None)
                self.assertIn('catalog', ja_data)
                self.assertEqual(ja_data['catalog'], {
                    'simple-string': '簡単なストリング',
                    'singular-string': '日本語には複数形がありません。'
                })

    def test_compile_to_js(self):
        with tempdir() as workspace:
            gettextjs.main([TESTDATA_DIR, workspace])
            en_js_path = os.path.join(
                workspace,
                'en',
                'LC_MESSAGES',
                'messages.mo.js'
            )
            with open(en_js_path) as fobj:
                en_content = fobj.read()
            prefix_en = '(function (exports) {\n    exports.EN_MESSAGES = '
            suffix_en = ';\n})(this);'
            self.assertTrue(en_content.startswith(prefix_en))
            self.assertTrue(en_content.endswith(suffix_en))
            en_data = json.loads(en_content[len(prefix_en):-len(suffix_en)])
            self.assertIn('plural', en_data)
            self.assertEqual(en_data['plural'], '(n != 1)')
            self.assertIn('catalog', en_data)
            self.assertEqual(en_data['catalog'], {
                'simple-string': 'A simple string',
                'singular-string': [
                    'Singular form!',
                    'Plural form!'
                ]
            })

            ja_js_path = os.path.join(
                workspace,
                'ja',
                'LC_MESSAGES',
                'messages.mo.js'
            )
            with open(ja_js_path) as fobj:
                ja_content = fobj.read()
            prefix_ja = '(function (exports) {\n    exports.JA_MESSAGES = '
            suffix_ja = ';\n})(this);'
            self.assertTrue(ja_content.startswith(prefix_ja))
            self.assertTrue(ja_content.endswith(suffix_ja))
            ja_data = json.loads(ja_content[len(prefix_ja):-len(suffix_ja)])
            self.assertIn('plural', ja_data)
            self.assertEqual(ja_data['plural'], None)
            self.assertIn('catalog', ja_data)
            self.assertEqual(ja_data['catalog'], {
                'simple-string': '簡単なストリング',
                'singular-string': '日本語には複数形がありません。'
            })


class CodeQualityTests(unittest.TestCase):
    @unittest.skipIf(not pyflakes, 'pyflakes not installed')
    def test_pyflakes(self):
        files = [
            GETTEXT_PY_FILE,
        ]
        out = io.StringIO()
        reporter = Reporter(out, out)
        errors = sum(map(lambda f: api.checkPath(f, reporter), files))
        self.assertEqual(errors, 0, '\n' + out.getvalue())

    @unittest.skipIf(not shutil.which('eslint'), "eslint not installed")
    def test_eslint(self):
        process = subprocess.Popen(
            ['eslint', GETTEXT_JS_FILE],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        messages, _ = process.communicate(timeout=5)
        self.assertEqual(process.returncode, 0, '\n' + messages.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
