import {readCatalog} from './utils';

test('parse en mo', () => {
  const catalog = readCatalog('en.mo');
  expect(catalog.messages.size).toBe(3);
  expect(catalog.headers.size).toBe(8);
});

test('parse ja mo', () => {
  const catalog = readCatalog('ja.mo');
  expect(catalog.messages.size).toBe(3);
  expect(catalog.headers.size).toBe(8);
});
