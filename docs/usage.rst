Usage
#####

Workflow
========

#. Create your po files using your current workflow.
#. Create your mo files using your current workflow.
#. Choose one of the following:
    #. Transpile your mo files to js files using `gettextjs`
    #. Import your mo files in js and use the webpack loader.


Transpile using CLI
===================

Transpile all your MO files to JS using `gettextjs <input> <output>`.

Note that the resulting code is ES7 code (including `import`) and needs to be
transpiled before used.


Webpack
=======

Add the `gettextjs/dist/loader` loader to your webpack config for mo files:

.. highlight:: javascript


        {
          test: /\.mo$/,
          use: [
            'babel-loader',
            'gettextjs/dist/loader'
          ]
        }

The `babel-loader` is needed because the gettextjs loader outputs ES7, but you can
use another loader to do the JS->JS transpilation.


Using transpiled files
======================

The transpiled files have a default export which is an instance of :js:class:`Translations`.
They can either be used directly or you can call :js:func:`set_catalog` with the instance.

.. highlight:: javascript


    import locale from 'path/to/file.mo';
    import gettext from 'gettextjs';

    locale.gettext('foo');
    locale.ngettext('foo', 'bar', n);

    gettext.set_locale(locale);
    gettext.gettext('foo');
    gettext.ngettext('foo', 'bar', n);


:js:func:`gettext` and :js:func:`ngettext` are equivalent to `gettext(3)`_
and `ngettext(3)`_. :js:func:`gettext` takes a single ``msgid`` and returns the
translation for it, if it finds one, or the ``msgid``. :js:func:`ngettext` is
used for translations which may have plurals.


.. _gettext(3): http://linux.die.net/man/3/gettext
.. _ngettext(3): http://linux.die.net/man/3/ngettext
