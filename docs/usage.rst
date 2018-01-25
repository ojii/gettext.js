Usage
#####

Workflow
========

#. Create your po files using your current workflow.
#. Create your mo files using your current workflow.
#. Serve your mo files from your webserver.


Loading MO files
================

The easiest way to load translations is using `load`::

    import {load} from 'gettextjs';

    load('/url/to/mo/file.mo').then(locale => {
        ...
    });


Using
=====

gettextjs exposed two methods on the :js:class:`Gettext` class:
:js:func:`gettext` and :js:func:`ngettext`. They're equivalent to `gettext(3)`_
and `ngettext(3)`_. :js:func:`gettext` takes a single ``msgid`` and returns the
translation for it, if it finds one, or the ``msgid``. :js:func:`ngettext` is
used for translations which may have plurals.

.. highlight:: javascript

Here's an example usage::

    import {load} from 'gettextjs';
    load('/language.mo').then(gettext => {
        gettext.gettext("Hello world!");
        gettext.gettext("I know %(number)s language", "I know %(number)s languages", 1);
        gettext.gettext("I know %(number)s language", "I know %(number)s languages", 2);
    });


String interpolation
====================

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
