import gettext
import os
import tempfile
import threading
import unittest
from contextlib import contextmanager
from wsgiref.simple_server import make_server

import subprocess

import sys

import shutil
from flask import Flask
from flask import render_template
from flask import send_from_directory
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait

THIS_DIR = os.path.join(os.path.dirname(__file__))
DIST_FOLDER = os.path.abspath(os.path.join(THIS_DIR, '..', '..', 'dist', 'browser'))
TEST_DATA_DIR = os.path.abspath(os.path.join(THIS_DIR, '..', 'test_data'))
GETTEXTJS_PY = os.path.join(THIS_DIR, '..', 'py', 'gettextjs.py')

LOCALES = {
    'null': gettext.NullTranslations(),
    'en': gettext.translation('messages', TEST_DATA_DIR, ['en']),
    'ja': gettext.translation('messages', TEST_DATA_DIR, ['ja']),
}

app = Flask(__name__)
app.locale_dir = TEST_DATA_DIR


@app.route('/render/<path:path>')
def index(path):
    return render_template(path)


@app.route('/dist/<path:path>')
def dist(path):
    return send_from_directory(DIST_FOLDER, path)


@app.route('/locale/<path:path>')
def locale(path):
    return send_from_directory(app.locale_dir, path)


@contextmanager
def tempdir():
    dirname = tempfile.mkdtemp()
    try:
        yield dirname
    finally:
        shutil.rmtree(dirname)


class Server(threading.Thread):
    def __init__(self, app):
        self.app = app
        self.port = None
        self.is_ready = threading.Event()
        self.error = None
        super().__init__()

    def run(self):
        try:
            self.httpd = make_server('localhost', 0, self.app)
            self.port = self.httpd.server_port
            self.is_ready.set()
            self.httpd.serve_forever()
        except Exception as exc:
            self.error = exc
            self.is_ready.set()

    def terminate(self):
        if hasattr(self, 'httpd'):
            # Stop the WSGI server
            self.httpd.shutdown()


class JavascriptError(Exception):
    def __init__(self, message, source, lineno, colno, error):
        self.message = message
        self.source = source
        self.lineno = lineno
        self.colno = colno
        self.error = error
        super(JavascriptError, self).__init__(message)


def wait_for_results(driver, expected, timeout=10):
    def until(driver):
        result = driver.execute_script('return window.GETTEXT_TESTS_FINISHED;')
        if result == -1:
            raise JavascriptError(
                **driver.execute_script('return window.GETTEXT_ERROR;')
            )
        else:
            return result == expected
    WebDriverWait(driver, timeout).until(until)


class LiveServerTestCase(unittest.TestCase):
    timeout = 10

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.server = Server(app)
        cls.server.start()
        cls.server.is_ready.wait(cls.timeout)
        if cls.server.error:
            raise cls.server.error

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'server'):
            cls.server.terminate()
            cls.server.join(cls.timeout)
        super().tearDownClass()

    @contextmanager
    def get_driver(self):
        driver_class = os.environ.get('SELENIUM_WEBDRIVER', None)
        if driver_class is None:
            raise unittest.SkipTest('SELENIUM_WEBDRIVER not set')
        klass = getattr(webdriver, driver_class, None)
        if klass is None:
            raise unittest.SkipTest("WebDriver %s not found" % driver_class)
        driver = klass()
        try:
            yield driver
        except:
            if os.environ.get('SELENIUM_DEBUG', False):
                for entry in driver.get_log('browser'):
                    if entry['level'] != 'INFO':
                        print(entry['message'])
                driver.save_screenshot('%s.png' % self.id())
                with open('%s.html' % self.id(), 'w') as fobj:
                    fobj.write(driver.page_source)
            raise
        finally:
            driver.quit()

    @contextmanager
    def compiled(self, json=False):
        with tempdir() as workspace:
            old = app.locale_dir
            try:
                app.locale_dir = workspace
                command = [sys.executable, GETTEXTJS_PY]
                if json:
                    command.append('--json')
                command.append(TEST_DATA_DIR)
                command.append(workspace)
                subprocess.check_call(command)
                yield
            finally:
                app.locale_dir = old

    def build_url(self, path):
        return 'http://localhost:%s%s' % (self.server.port, path)

    def test_simple(self):
        with self.compiled(), self.get_driver() as driver:
            driver.get(self.build_url('/render/simple.html'))
            wait_for_results(driver, 3)
            for locale, g in LOCALES.items():
                self.assertEqual(
                    driver.find_element_by_id('%s-simple' % locale).text,
                    g.gettext('simple-string'),
                    locale
                )
                for n in [1, 2]:
                    self.assertEqual(
                        driver.find_element_by_id('%s-plural-%s' % (locale, n)).text,
                        g.ngettext('singular-string', 'plural-string', n),
                        (locale, n)
                    )

    def test_json(self):
        with self.compiled(True), self.get_driver() as driver:
            driver.get(self.build_url('/render/ajax.html'))
            wait_for_results(driver, 3)
            for locale, g in LOCALES.items():
                self.assertEqual(
                    driver.find_element_by_id('%s-simple' % locale).text,
                    g.gettext('simple-string'),
                    locale
                )
                for n in [1, 2]:
                    self.assertEqual(
                        driver.find_element_by_id('%s-plural-%s' % (locale, n)).text,
                        g.ngettext('singular-string', 'plural-string', n),
                        (locale, n)
                    )

if __name__ == '__main__':
    unittest.main()
