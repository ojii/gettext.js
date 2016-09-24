.. image:: https://travis-ci.org/ojii/gettext.js.svg?branch=master
    :target: https://travis-ci.org/ojii/gettext.js

.. image:: https://readthedocs.org/projects/gettextjs/badge/?version=latest
    :target: http://gettextjs.readthedocs.org/en/latest/?badge=latest
    :alt: Documentation Status

gettext.js
##########

gettext.js provides a GNU gettext like interface for use in browsers. For better
performance and compatibility, mo files are compiled into JSON or JavaScript files
using a Python command line tool. These files can then be used in the browser to
provide internationalization capabilities.

Full Docs: http://gettextjs.readthedocs.org/


Usage
=====

Compiling
---------

Install using `pip3 install gettextjs`

.. code-block::

    Usage:
        gettextjs [-i] [-v] [--json] <locale-path> [<out-dir>]

    Options:
        -h --help       Show this screen.
        --version       Show version.
        -i --indent     Indent JSON file.
        -v --verbose    Print stuff while doing work.
        --json          Compile to JSON instead of JS.


Javascript
----------

Global
~~~~~~

HTML
****

.. code-block::

    <script src="dist/browser/gettext.iief.js"></script>
    <script src="locale/en/LC_MESSAGES/messages.js"></script>
    <script>
        gettext.set_catalog(EN_MESSAGES);
        var translated = gettext.gettext('msgid');
    </script>

Node
****

.. code-block::

    var gettext = require('gettextjs');
    var catalog = require('locale/en/LC_MESSAGES/messages.mo.json');

    gettext.set_catalog(catalog);

    var translated = gettext.gettext('msgid');


Local
~~~~~

HTML
****

.. code-block::

    <script src="dist/browser/gettext.iief.js"></script>
    <script src="locale/en/LC_MESSAGES/messages.js"></script>
    <script>
        var g = new gettext.Gettext(EN_MESSAGES);
        var translated = g.gettext('msgid');
    </script>

Node
****

.. code-block::

    var gettext = require('gettextjs');
    var catalog = require('locale/en/LC_MESSAGES/messages.mo.json');

    var g = new gettext.Gettext(catalog);

    var translated = g.gettext('msgid');
