Usage
#####

Workflow
========

#. Create your po files using your current workflow.
#. Create your mo files using your current workflow.
#. Use ``gettextjs`` to compile those mo files to ``.mo.js`` or ``.mo.json`` files.
#. Serve the output directory of the ``gettextjs`` call in your web app.
#. Use the Javascript runtime to translate your web app.

The only thing that really changes from your current workflow is that after
compiling the mo files, you then compile them into something that can be used
in Javascript.


Compiler
========

Let's assume you have the following directory tree::

    /app/
    └── locale
    ├── en
        └── LC_MESSAGES
            ├── messages.mo
            └── messages.po


The compiler takes a locale directory as created by gettext (
``<locale>/LC_MESSAGES/<domain>.mo``) as input, and writes the result to an
output directory (``<locale>/LC_MESSAGES/<domain>.mo.<json|js>``). This output
directory should be served by your web server if you use ``json`` files. If you
use ``js`` files you can host them anywhere you want, as you'll be responsible
for loading them on your page.

In it's most basic form, you simply use ``gettextjs /app/locale/``. Your directory
tree now looks like this::

    /app/
    └── locale
    ├── en
        └── LC_MESSAGES
            ├── messages.mo
            ├── messages.mo.json
            └── messages.po


To instead generate JS files, use the ``--js`` flag. The JS files will have a
single variable in them: ``<locale>_<domain>``, with both of those values in
upper-case. So the English ``messages.mo`` file will become a variable called
``EN_MESSAGES``.

For debugging, you can use the ``-v/--verbose`` flag for some more feedback on
what is going on. The ``-i/--indent`` flag can be used to indent the JSON/JS file
being generated.

You may optionally provide a separate directory for the resulting compiled
files.


Runtime
=======

This section assumes you have the locale directory containing the files compiled
by ``gettextjs`` available at ``https://example.com/locale/``. So for example the
English ``messages.mo.json`` is available via
``https://example.com/locale/en/LC_MESSAGES/messages.mo.json``.

Loading (JSON)
--------------

.. highlight:: javascript

To load a catalog from a JSON file, use :js:func:`Gettext.load`, so for example
to load the English ``messages`` domain, you would use the following::

    Gettext.load('https://example.com/locale', 'en', 'messages').then(function(gettext){
        // start using gettext
    }, function(error){
        // handle the error
    });


Loading (JS)
------------

.. highlight:: html

Simply load the file via a script tag::

    <script src="https://example.com/locale/en/LC_MESSAGES/messages.mo.js"></script>


Using
-----

gettextjs exposed two methods on the :js:class:`Gettext` class:
:js:func:`gettext` and :js:func:`ngettext`. They're equivalent to `gettext(3)`_
and `ngettext(3)`_. :js:func:`gettext` takes a single ``msgid`` and returns the
translation for it, if it finds one, or the ``msgid``. :js:func:`ngettext` is
used for translations which may have plurals.

.. highlight:: javascript

Here's an example usage::

    Gettext.load('https://example.com/locale', 'en', 'messages').then(function(gettext){
        gettext.gettext("Hello world!");
        gettext.gettext("I know %(number)s language", "I know %(number)s languages", 1);
        gettext.gettext("I know %(number)s language", "I know %(number)s languages", 2);
    });


String interpolation
--------------------

gettext.js does not provide string interpolation. Use libraries like
`sprintf.js`_ to do this. When doing string interpolation, make sure you call
the approprate gettext.js function first. You should **always use named
arguments** when internationalizing strings, as different languages may have
different word orders.

The example above would become::

    sprintf(gettext.gettext("I know %(number)s language", "I know %(number)s languages", 2), {'number': 2});



.. _gettext(3): http://linux.die.net/man/3/gettext
.. _ngettext(3): http://linux.die.net/man/3/ngettext
.. _sprintf.js: https://www.npmjs.com/package/sprintf-js