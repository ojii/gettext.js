import type {Headers, Messages} from './runtime';
import type {PluralString} from './parser';

export default function transpile(headers: Headers, messages: Messages, plural_string: PluralString): string {
  return `import gettext from 'gettextjs';
import Immutable from 'immutable';

const headers = Immutable.fromJS(${JSON.stringify(headers.toJS())});
const messages = Immutable.fromJS(${JSON.stringify(messages.toJS())});
const plural = n => (${plural_string}) * 1;

export default new gettext.Translations(headers, messages, plural);`;
}
