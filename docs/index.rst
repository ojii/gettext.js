.. gettext.js documentation master file, created by
   sphinx-quickstart on Thu Oct 29 12:14:53 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to gettext.js's documentation!
======================================


gettext.js provides a GNU gettext like interface for use in browsers. For better
performance and compatibility, mo files are compiled into JSON or JavaScript files
using a Python command line tool. These files can then be used in the browser to
provide internationalization capabilities.

While the tool to compile mo files to JavaScript or JSON is written in Python,
the runtime has no Python dependencies. The JavaScript runtime can be used in
either the browser or node.


.. toctree::
    :maxdepth: 2

    installation
    usage
    reference
    changelog


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

