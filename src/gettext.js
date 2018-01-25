// @flow
import parse, {makeCatalog} from './parser';
import type Catalog_ from './parser';
import es6promise from 'es6-promise';
es6promise.polyfill();
import 'isomorphic-fetch';
import {res2ab} from './utils';


export type CatalogType = Catalog_;

export class Gettext {
  constructor(catalog: ?CatalogType) {
    if (catalog) {
      this.catalog = catalog;
    } else {
      this.catalog = makeCatalog();
    }
  }

  gettext(msgid: string): string {
    if (!this.catalog.messages.has(msgid)) return msgid;
    return this.catalog.messages.get(msgid).get(0);
  }

  ngettext(singular: string, plural: string, count: number): string {
    if (!this.catalog.messages.has(singular)) return [singular, plural][this.catalog.plural(count)];
    return this.catalog.messages.get(singular).get(this.catalog.plural(count));
  }
}

export function load(url: str): Promise<Gettext> {
  return fetch(url).then(resp => res2ab(resp)).then(buf => parse(buf)).then(catalog => new Gettext(catalog));
}

let GLOBAL: Gettext = new Gettext();

export function set_catalog(gettext: ?Gettext) {
  if (!gettext) {
    GLOBAL = new Gettext();
  } else {
    GLOBAL = gettext
  }
}

export function gettext(msgid: string): string {
  return GLOBAL.gettext(msgid);
}

export function ngettext(singular: string, plural: string, count: number): string {
  return GLOBAL.ngettext(singular, plural, count);
}

export default {
  Gettext: Gettext,
  Catalog: makeCatalog,
  parse: parse,
  load: load,
  set_catalog: set_catalog,
  gettext: gettext,
  ngettext: ngettext
};
