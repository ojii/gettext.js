import {readCatalog} from './utils';

test('parse en mo', () => {
  const [headers, messages, plural] = readCatalog('en.mo');
  expect(messages.size).toBe(3);
  expect(headers.size).toBe(8);
});

test('parse ja mo', () => {
  const [headers, messages, plural] = readCatalog('ja.mo');
  expect(messages.size).toBe(3);
  expect(headers.size).toBe(8);
});
