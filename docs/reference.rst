Reference
#########

.. js:class:: Translations(headers, messages, plural)

    :param Immutable.Map<string, string> headers: MO headers.
    :param Immutable.Map<string, Immutable.List<string>> messages: The translations.
    :param (number) => number plural: Function to resolve plural forms.

    Usually this class should not be created manually.

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

    Set a translation as the currently active, global translations.

.. js:function:: gettext(msgid)

    :param string msgid: Message ID to look up.
    :returns: Translated string (or input string if not found).

    Uses the translations set by :js:func:`set_catalog` to translate a message ID.

.. js:function:: ngettext(msgid, msgid_plural, count)

    :param string msgid: Message ID for the singular string.
    :param string msgid_plural: Message ID for the plural string.
    :param number count: Used to detect whether plural or singular form should be used.
    :returns: Translated string (or one of the input strings if not found).

    Uses the translations set by :js:func:`set_catalog` to translate a message ID.
