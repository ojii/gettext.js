import io
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from contextlib import contextmanager

from flask import Flask
from nose.tools import nottest
from pyflakes import api
from pyflakes.reporter import Reporter
from slimit import ast
from viceroy.api import build_test_case
from viceroy.constants import VICEROY_STATIC_ROOT
from viceroy.contrib.flask import ViceroyFlaskTestCase
from viceroy.contrib.qunit import QUnitScanner

import gettextjs


GETTEXT_PY_FILE = os.path.abspath(gettextjs.__file__)
BASE_DIR = os.path.dirname(GETTEXT_PY_FILE)
JSHINT_RC = os.path.join(
    BASE_DIR,
    '..',
    '..',
    '.jshintrc'
)
GETTEXT_JS_FILE = os.path.join(
    BASE_DIR,
    '..',
    'js',
    'gettext.js',
)
GETTEXT_JS_COMPILED_FILE = os.path.join(
    BASE_DIR,
    '..',
    'js',
    'gettext-compiled.js',
)
THIS_FILE = os.path.abspath(__file__)
THIS_DIR = os.path.dirname(THIS_FILE)
TESTS_JS_FILE = os.path.join(THIS_DIR, 'tests.js')
TESTDATA_DIR = os.path.join(
    THIS_DIR,
    'data',
)
LOCALE_PATH = os.path.join(
    TESTDATA_DIR,
    'locale',
)


class FixedQUnitScanner(QUnitScanner):
    def visit_FunctionCall(self, node):
        if isinstance(node.identifier, ast.DotAccessor):
            if isinstance(node.identifier.node, ast.Identifier):
                if node.identifier.node.value == 'QUnit':
                    if node.identifier.identifier.value in ['test', 'asyncTest']:
                        yield self.extract_name(node.args[0])


@contextmanager
def tempdir():
    dirname = tempfile.mkdtemp()
    try:
        yield dirname
    finally:
        shutil.rmtree(dirname)


app = Flask(__name__)


@app.route('/')
def index():
    return """<html>
    <head>
        <script src='/gettext.js'></script>
        <script src='/viceroy/viceroy.js'></script>
        <script src='/data/qunit.js'></script>
        <script src='/viceroy/qunit-bridge.js'></script>
        <script src='/locale/en/LC_MESSAGES/messages.mo.js'></script>
        <script src='/locale/ja/LC_MESSAGES/messages.mo.js'></script>
        <link rel='stylesheet' href='/data/qunit.css'>
    </head>
    <body>
        <div id='qunit'></div>
        <div id='qunit-fixture'></div>
        <script src='/tests.js'></script>
    </body>
</html>"""


@app.route('/gettext.js')
def static_gettext():
    with open(GETTEXT_JS_COMPILED_FILE) as fobj:
        return fobj.read()


@app.route('/tests.js')
def static_tests():
    with open(TESTS_JS_FILE) as fobj:
        return fobj.read()


@app.route('/data/<filename>')
def static_data(filename):
    with open(os.path.join(TESTDATA_DIR, filename)) as fobj:
        return fobj.read()


@app.route('/viceroy/<filename>')
def static_viceroy(filename):
    with open(os.path.join(VICEROY_STATIC_ROOT, filename)) as fobj:
        return fobj.read()


@app.route('/locale/<locale>/LC_MESSAGES/<filename>')
def message_catalog(locale, filename):
    path = os.path.join(app.locale_dir, locale, 'LC_MESSAGES', filename)
    with open(path) as fobj:
        return fobj.read()


class IntegrationTests(unittest.TestCase):
    def test_compile_to_json(self):
        with tempdir() as workspace:
            gettextjs.cli([LOCALE_PATH, workspace])
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
            gettextjs.cli(['--js', LOCALE_PATH, workspace])
            en_js_path = os.path.join(
                workspace,
                'en',
                'LC_MESSAGES',
                'messages.mo.js'
            )
            with open(en_js_path) as fobj:
                en_content = fobj.read()

            self.assertTrue(en_content.startswith('var EN_MESSAGES = '))
            self.assertTrue(en_content.endswith(';'))
            en_data = json.loads(en_content[len('var EN_MESSAGES = '):-1])
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
            self.assertTrue(ja_content.startswith('var JA_MESSAGES = '))
            self.assertTrue(ja_content.endswith(';'))
            ja_data = json.loads(ja_content[len('var JA_MESSAGES = '):-1])
            self.assertIn('plural', ja_data)
            self.assertEqual(ja_data['plural'], None)
            self.assertIn('catalog', ja_data)
            self.assertEqual(ja_data['catalog'], {
                'simple-string': '簡単なストリング',
                'singular-string': '日本語には複数形がありません。'
            })


class CodeQualityTests(unittest.TestCase):
    def test_pyflakes(self):
        files = [
            GETTEXT_PY_FILE,
            THIS_FILE,
        ]
        out = io.StringIO()
        reporter = Reporter(out, out)
        errors = sum(map(lambda f: api.checkPath(f, reporter), files))
        self.assertEqual(errors, 0, '\n' + out.getvalue())

    @unittest.skipIf(not shutil.which('jshint'), "jshint not installed")
    def test_jshint(self):
        files = [
            GETTEXT_JS_FILE,
            TESTS_JS_FILE
        ]
        process = subprocess.Popen(
            ['jshint', '-c', JSHINT_RC] + files,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        messages, _ = process.communicate(timeout=5)
        self.assertEqual(process.returncode, 0, '\n' + messages.decode('utf-8'))


class JSTestsBase(ViceroyFlaskTestCase):
    viceroy_flask_app = app

    @classmethod
    def setUpClass(cls):
        app.locale_dir = tempfile.mkdtemp()
        gettextjs.compile_locale_path(
            LOCALE_PATH,
            app.locale_dir,
            gettextjs.JS_MODE
        )
        gettextjs.compile_locale_path(
            LOCALE_PATH,
            app.locale_dir,
            gettextjs.JSON_MODE
        )
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(app.locale_dir)
        super().tearDownClass()


JSTests = nottest(build_test_case)(
    'ViceroySuccessTests',
    TESTS_JS_FILE,
    FixedQUnitScanner,
    JSTestsBase
)
