import Gettext, {gettext, ngettext, set_catalog, load} from '../src/gettext';
import {readCatalog, readFile} from './utils';
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;

const en = new Gettext(readCatalog('en.mo'));
const ja = new Gettext(readCatalog('ja.mo'));
const nc = new Gettext();


describe('global api', () => {
  test('null', () => {
    set_catalog();
    expect(gettext('simple-string')).toBe('simple-string');
    expect(ngettext('singular-string', 'plural-string', 0)).toBe('plural-string');
    expect(ngettext('singular-string', 'plural-string', 1)).toBe('singular-string');
    expect(ngettext('singular-string', 'plural-string', 2)).toBe('plural-string');
  });
  test('nc', () => {
    set_catalog(nc);
    expect(gettext('simple-string')).toBe('simple-string');
    expect(ngettext('singular-string', 'plural-string', 0)).toBe('plural-string');
    expect(ngettext('singular-string', 'plural-string', 1)).toBe('singular-string');
    expect(ngettext('singular-string', 'plural-string', 2)).toBe('plural-string');
  });
  test('en', () => {
    set_catalog(en);
    expect(gettext('simple-string')).toBe('A simple string');
    expect(ngettext('singular-string', 'plural-string', 0)).toBe('Plural form!');
    expect(ngettext('singular-string', 'plural-string', 1)).toBe('Singular form!');
    expect(ngettext('singular-string', 'plural-string', 2)).toBe('Plural form!');
  });
  test('ja', () => {
    set_catalog(ja);
    expect(gettext('simple-string')).toBe('簡単なストリング');
    expect(ngettext('singular-string', 'plural-string', 0)).toBe('日本語には複数形がありません。');
    expect(ngettext('singular-string', 'plural-string', 1)).toBe('日本語には複数形がありません。');
    expect(ngettext('singular-string', 'plural-string', 2)).toBe('日本語には複数形がありません。');
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
  test('load-en', () => {
    fetch.mockResponseOnce(readFile('en.mo'));
    load('/en.mo').then(locale => expect(locale).toEqual(en));
  });
});
