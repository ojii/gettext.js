.. image:: https://travis-ci.org/ojii/gettext.js.svg?branch=master
    :target: https://travis-ci.org/ojii/gettext.js

.. image:: https://readthedocs.org/projects/gettextjs/badge/?version=latest
    :target: http://gettextjs.readthedocs.org/en/latest/?badge=latest
    :alt: Documentation Status

gettext.js
##########


GNU gettext in Javascript. Compile your mo files to JSON/JS and then use them
directly from Javascript in your browser.

Demo: https://cdn.rawgit.com/ojii/gettext.js/master/demo/index.html

Docs: http://gettextjs.readthedocs.org/


Usage
=====

Compiling
---------

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

.. code-block::

    var gettext = require('gettextjs');
    var catalog = require('locale/en/LC_MESSAGES/messages.mo.json');

    gettext.set_catalog(catalog);

    var translated = gettext.gettext('msgid');


Local
~~~~~

.. code-block::

    var gettext = require('gettextjs');
    var catalog = require('locale/en/LC_MESSAGES/messages.mo.json');

    var g = new gettext.Gettext(catalog);

    var translated = g.gettext('msgid');
