from contextlib import contextmanager
import json
import os
import tempfile
import unittest
import shutil
from flask import Flask
import gettextjs
from nose.tools import nottest
from slimit import ast
from viceroy.api import build_test_case
from viceroy.constants import VICEROY_JS_PATH, VICEROY_STATIC_ROOT
from viceroy.contrib.flask import ViceroyFlaskTestCase
from viceroy.contrib.qunit import QUnitScanner


class FixedQUnitScanner(QUnitScanner):
    def visit_FunctionCall(self, node):
        if isinstance(node.identifier, ast.DotAccessor):
            if isinstance(node.identifier.node, ast.Identifier):
                if node.identifier.node.value == 'QUnit':
                    if node.identifier.identifier.value in ['test', 'asyncTest']:
                        yield self.extract_name(node.args[0])


LOCALE_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        '..',
        '..',
        'demo',
        'locale',
    )
)
GETTEXT_JS_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        '..',
        'js',
        'gettext-compiled.js',
    )
)
TESTDATA_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        'testdata',
    )
)


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
        <script src='/locale/en/LC_MESSAGES/messages.mo.js'></script>
        <script src='/locale/ja/LC_MESSAGES/messages.mo.js'></script>
        <link rel='stylesheet' href='/test/qunit.css'>
    </head>
    <body>
        <div id='qunit'></div>
        <div id='qunit-fixture'></div>
        <script src='/test/qunit.js'></script>
        <script src='/viceroy/qunit-bridge.js'></script>
        <script src='/test/tests.js'></script>
    </body>
</html>"""


@app.route('/gettext.js')
def static_gettext():
    with open(GETTEXT_JS_FILE) as fobj:
        return fobj.read()


@app.route('/test/<filename>')
def static_data(filename):
    with open(os.path.join(TESTDATA_DIR, filename)) as fobj:
        return fobj.read()


@app.route('/viceroy/<filename>')
def static_viceroy(filename):
    with open(os.path.join(VICEROY_STATIC_ROOT, filename)) as fobj:
        return fobj.read()


@app.route('/locale/<locale>/LC_MESSAGES/<filename>')
def message_catalog(locale, filename):
    with open(os.path.join(LOCALE_PATH, locale, 'LC_MESSAGES', filename)) as f:
        return f.read()


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


class JSTestsBase(ViceroyFlaskTestCase):
    viceroy_flask_app = app


JSTests = nottest(build_test_case)(
    'ViceroySuccessTests',
    os.path.join(TESTDATA_DIR, 'tests.js'),
    FixedQUnitScanner,
    JSTestsBase
)
