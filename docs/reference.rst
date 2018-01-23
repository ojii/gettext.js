Reference
#########

.. js:function:: load(url)

    :param string url: URL from which to load an MO file.
    :returns: An Promise of :js:class:`Gettext` instance.

.. js:function:: parse(buf)

    :param ArrayBuffer buf: An ArrayBuffer holding an MO file.
    :returns: An instance of :js:class:`Catalog`.

.. js:class:: Gettext(catalog)

    :param Catalog catalog: Catalog object. Can be created using :js:func:`parse`.

    .. js:method:: gettext(msgid)

        :param string msgid: Message ID to look up.
        :returns: Translated string (or input string if not found).

    .. js:method:: ngettext(msgid, msgid_plural, count)

        :param string msgid: Message ID for the singular string.
        :param string msgid_plural: Message ID for the plural string.
        :param number count: Used to detect whether plural or singular form should be used.
        :returns: Translated string (or one of the input strings if not found).


.. js:function:: set_catalog(catalog)

    :param Gettext catalog:

    Set a catalog as the currently active, global translation catalog.

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

.. js::class:: Catalog

    Holds the parsed information from an MO file. Use :js:func:`parse` to create
    it.
