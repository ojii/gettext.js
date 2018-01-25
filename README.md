[![Build Status](https://travis-ci.org/ojii/gettext.js.svg?branch=master)](https://travis-ci.org/ojii/gettext.js)

[![Documentation Status](https://readthedocs.org/projects/gettextjs/badge/?version=latest)](http://gettextjs.readthedocs.io/en/latest/?badge=latest)

gettext.js
==========

gettext.js provides a GNU gettext like interface for use in browsers.

gettext.js is distributed as a library only for easy integration into your build
toolchain.

Full Docs: <http://gettextjs.readthedocs.org/>

Usage
-----

### load

```js

import {load} from 'gettextjs';

load('/url/to/file.mo').then(locale => locale.gettext('hello world'));
```

### parse

```js
import Gettext, {parse} from 'gettextjs';

const gettext = new Gettext(parse(ArrayBufferOfMOFile));
gettext.gettext('hello world');
gettext.ngettext('singular', 'plural', num);
```
