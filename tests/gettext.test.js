import gettext from '../src/gettext';
import {readCatalog, withServer} from './utils';

const en = new gettext.Gettext(readCatalog('en.mo'));
const ja = new gettext.Gettext(readCatalog('ja.mo'));
const nc = new gettext.Gettext();


describe('global api', () => {
  test('null', () => {
    gettext.set_catalog();
    expect(gettext.gettext('simple-string')).toBe('simple-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 0)).toBe('plural-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 1)).toBe('singular-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 2)).toBe('plural-string');
  });
  test('nc', () => {
    gettext.set_catalog(nc);
    expect(gettext.gettext('simple-string')).toBe('simple-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 0)).toBe('plural-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 1)).toBe('singular-string');
    expect(gettext.ngettext('singular-string', 'plural-string', 2)).toBe('plural-string');
  });
  test('en', () => {
    gettext.set_catalog(en);
    expect(gettext.gettext('simple-string')).toBe('A simple string');
    expect(gettext.ngettext('singular-string', 'plural-string', 0)).toBe('Plural form!');
    expect(gettext.ngettext('singular-string', 'plural-string', 1)).toBe('Singular form!');
    expect(gettext.ngettext('singular-string', 'plural-string', 2)).toBe('Plural form!');
  });
  test('ja', () => {
    gettext.set_catalog(ja);
    expect(gettext.gettext('simple-string')).toBe('簡単なストリング');
    expect(gettext.ngettext('singular-string', 'plural-string', 0)).toBe('日本語には複数形がありません。');
    expect(gettext.ngettext('singular-string', 'plural-string', 1)).toBe('日本語には複数形がありません。');
    expect(gettext.ngettext('singular-string', 'plural-string', 2)).toBe('日本語には複数形がありません。');
  });
});

describe('object api', () => {
  test('null', () => {
    expect(nc.gettext('simple-string')).toBe('simple-string');
    expect(nc.ngettext('singular-string', 'plural-string', 0)).toBe('plural-string');
    expect(nc.ngettext('singular-string', 'plural-string', 1)).toBe('singular-string');
    expect(nc.ngettext('singular-string', 'plural-string', 2)).toBe('plural-string');
  });
  test('en', () => {
    expect(en.gettext('simple-string')).toBe('A simple string');
    expect(en.ngettext('singular-string', 'plural-string', 0)).toBe('Plural form!');
    expect(en.ngettext('singular-string', 'plural-string', 1)).toBe('Singular form!');
    expect(en.ngettext('singular-string', 'plural-string', 2)).toBe('Plural form!');
  });
  test('ja', () => {
    expect(ja.gettext('simple-string')).toBe('簡単なストリング');
    expect(ja.ngettext('singular-string', 'plural-string', 0)).toBe('日本語には複数形がありません。');
    expect(ja.ngettext('singular-string', 'plural-string', 1)).toBe('日本語には複数形がありません。');
    expect(ja.ngettext('singular-string', 'plural-string', 2)).toBe('日本語には複数形がありません。');
  });
});

describe('load', () => {
  test('load-en', async () => {
    await withServer(async getURL => {
      const loaded = await gettext.load(getURL('/en.mo'));
      expect(loaded.messages).toEqual(en.messages);
    });
  });
});
