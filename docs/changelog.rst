Changelog
#########

2.0
===

Release data: January 24, 2018

* Re-wrote library to be pure JS (can now load MO files directly)
* Removed `eval`/`new Function`.
* Only distributed as un-processed library.
* Added new `load` function.


1.2
===

Release date: January 20, 2017

* Removed `eval` from Javascript runtime.
* Use `yarn` for development Javascript dependencies.


1.1
====

Release date: September 24, 2016

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
