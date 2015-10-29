Reference
#########

CLI
===

.. program:: gettextjs

.. option:: locale_dir

    Location of your locale directory with your ``.mo`` files. Must be in
    the standard ``<locale>/LC_MESSAGES/<domain>.mo`` structure.

.. option:: out_dir

    Output directory. Defaults to the same as :option:`locale_dir`.

.. option:: -i, --indent

    Indent the generated JSON/JS.

.. option:: -v, --verbose

    Print what files have been compiled.

.. option:: --js

    Generate JS files instead of JSON files.


Javascript
==========

.. js:class:: Gettext(catalog)

    .. js:function:: gettext(msgid)

        :param string msgid: Message ID to look up.
        :returns: Translated string (or input string if not found).

    .. js:function:: ngettext(msgid, msgid_plural, count)

        :param string msgid: Message ID for the singular string.
        :param string msgid_plural: Message ID for the plural string.
        :param number count: Used to detect whether plural or singular form should be used.
        :returns: Translated string (or one of the input strings if not found).


.. js:function:: Gettext.load(base_url, locale, domain)

    :param string base_url: Base URL of your locale files.
    :param string locale: Locale to load.
    :param string domain: Message domain to load.
    :returns: A ``Promise`` object calling the success function with a :js:class:`Gettext` instance.