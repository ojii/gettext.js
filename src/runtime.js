// @flow
import Immutable from 'immutable';

export type Plural = number => number;
export type Headers =Immutable.Map<string, string>;
export type Messages = Immutable.Map<string, Immutable.List<string>>;

const defaultPlural: Plural = n => n !== 1 ? 1 : 0;

class Translations {
  constructor(headers: ?Headers, messages: ?Messages, plural: ?Plural) {
    this.headers = headers || Immutable.Map();
    this.messages = messages || Immutable.Map();
    this.plural = plural || defaultPlural;
  }

  gettext(msgid: string): string {
    if (!this.messages.has(msgid)) return msgid;
    return this.messages.get(msgid).get(0);
  }

  ngettext(singular: string, plural: string, count: number): string {
    if (!this.messages.has(singular)) return [singular, plural][this.plural(count)];
    return this.messages.get(singular).get(this.plural(count));
  }
}
let GLOBAL: Translations = new Translations();

function set_catalog(locale: ?Translations) {
  GLOBAL = locale || new Translations();
}

function gettext(msgid: string): string {
  return GLOBAL.gettext(msgid);
}

function ngettext(singular: string, plural: string, count: number): string {
  return GLOBAL.ngettext(singular, plural, count);
}

export default {
  Translations: Translations,
  set_catalog: set_catalog,
  gettext: gettext,
  ngettext: ngettext
};
