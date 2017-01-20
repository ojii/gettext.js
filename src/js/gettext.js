'use strict';

export class Gettext {
    constructor(catalog) {
        if (!catalog) {
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
            this.pluralidx = new Function('n', `return ${catalog.plural} * 1;`);
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

let CATALOG = new Gettext();

export function set_catalog(catalog) {
    if (!(catalog instanceof Gettext)) {
        catalog = new Gettext(catalog);
    }
    CATALOG = catalog;
}

export function gettext(msgid) {
    return CATALOG.gettext(msgid);
}

export function ngettext(singular, plural, count) {
    return CATALOG.ngettext(singular, plural, count);
}
