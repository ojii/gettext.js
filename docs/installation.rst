Installation
############

Dependencies
============

Compiler
--------

* `Python 3.5`_ or higher

Javascript runtime
------------------

* No dependencies
  

Installation
============

Compiler
--------

``pip3 install gettextjs``

Javascript runtime
------------------

You can install gettext.js via npm or download the file from the ``dist`` folder
in the repository. The npm package includes the ``jsnext:main`` key, so the
library can be included via `rollupjs`_ and the node-resolve plugin if you're
building an ES6 project. For node project, there is also a common-js file. If
you wish to use gettext.js in the browser, make sure to use the
``gettext.iife.js`` file.

.. _Python 3.5: https://www.python.org/downloads/release/python-350/
.. _rollupjs: http://rollupjs.org/