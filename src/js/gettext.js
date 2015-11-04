/*jshint strict:true, latedef:true, noempty:true, noarg:true, unused:vars, evil:true, esnext:true, indent:4, eqeqeq:true, nocomma:true, quotmark:single, nonbsp:true, browser:true, bitwise:true, curly:true, undef:true, globalstrict:true, nonew:true, forin:true */
'use strict';

class Gettext {
    constructor(catalog) {
        if (catalog === undefined) {
            catalog = {
                'catalog': {},
                'plural': null
            };
        }
        if (!catalog.hasOwnProperty('catalog')) {
            catalog.catalog = {};
        }
        this.catalog = catalog.catalog;
        if (catalog.plural) {
            this.pluralidx = (n) => {
                return (eval(catalog.plural)) * 1;
            };
        } else {
            this.pluralidx = (n) => {
                return (n === 1) ? 0 : 1;
            };
        }
    }

    gettext(msgid) {
        let value = this.catalog[msgid];
        if (typeof(value) === 'undefined') {
            return msgid;
        } else {
            return (typeof(value) === 'string') ? value : value[0];
        }
    }

    ngettext(singular, plural, count) {
        let value = this.catalog[singular];
        let type = typeof(value);
        if (type === 'undefined') {
            return [singular, plural][this.pluralidx(count)];
        } else if (type === 'string') {
            return value;
        } else {
            return value[this.pluralidx(count)];
        }
    }
}

Gettext.load = function (locale_path, locale, domain) {
    if (locale_path.endsWith('/')) {
        locale_path = locale_path.substr(0, locale_path.length - 1);
    }
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            resolve(new Gettext(JSON.parse(xhr.response)));
        });
        xhr.addEventListener('error', () => {
            reject(xhr.statusText);
        });
        xhr.open('GET', `${locale_path}/${locale}/LC_MESSAGES/${domain}.mo.json`);
        xhr.send();
    });
};
