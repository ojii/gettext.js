[![Build Status](https://travis-ci.org/ojii/gettext.js.svg?branch=master)](https://travis-ci.org/ojii/gettext.js)

[![Documentation Status](https://readthedocs.org/projects/gettextjs/badge/?version=latest)](http://gettextjs.readthedocs.io/en/latest/?badge=latest)

gettext.js
==========

gettext.js provides a GNU gettext like interface for use in browsers, a MO file to
JS transpiler and a webpack loader for MO files.

Full Docs: <http://gettextjs.readthedocs.org/>

Usage
-----

### Webpack

```js
import English from 'locales/en/LC_MESSAGES/messages.mo';

English.gettext('hello world');
English.ngettext('bug', 'bugs', 4);
```

### Runtime

```js
import {gettext as _, ngettext, set_catalog} from "gettextjs";

set_catalog(...);

_("hello world");
ngettext("bug", "bugs", 4);
```

### Compile

`gettextjs <input> <output>` turns the input MO file int a JS file.
