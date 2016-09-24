Changelog
#########

1.1
====

Release date: In development

* Made the JavaScript runtime an NPM package.
* Removed the `Gettext.load` API. If you want to load catalogs via AJAX, please
  use the AJAX libary of your choice.
* Added "global" APIs :js:func:`set_catalog`, :js:func:`gettext` and
  :js:func:`ngettext`.
* Removed docopt as a dependency for the compiler. The compiler now only depends
  on Python 3.5.

1.0
====

Release date: Dec 25, 2015

* Initial release.
