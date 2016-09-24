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

.. option:: --json

    Generate JSON files instead of JS files.


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


.. js:function:: set_catalog(catalog)

    Set a catalog as the currently active, global translation catalog. This can
    be either an instance of `Gettext` or the JSON object produced by the
    compiler.

.. js:function:: gettext(msgid)

    :param string msgid: Message ID to look up.
    :returns: Translated string (or input string if not found).

    Uses the catalog set by :js:func:`set_catalog` to translate a message ID.

.. js:function:: ngettext(msgid, msgid_plural, count)

    :param string msgid: Message ID for the singular string.
    :param string msgid_plural: Message ID for the plural string.
    :param number count: Used to detect whether plural or singular form should be used.
    :returns: Translated string (or one of the input strings if not found).

    Uses the catalog set by :js:func:`set_catalog` to translate a message ID.
