import {readFileSync} from 'fs';
import {join} from 'path';
import parse from '../src/parser';
import {b2ab} from '../src/utils';

export function readFile(name) {
  return readFileSync(join(__dirname, 'data', name));
}

export function readArrayBuffer(name) {
  return b2ab(readFile(name));
}

export function readCatalog(name) {
  const [headers, messages, pluralstring] = parse(readArrayBuffer(name));
  return [headers, messages, new Function('n', `return (${pluralstring}) * 1;`)];
}
