import {readFileSync} from 'fs';
import {join} from 'path';
import parse from '../src/parser';

export function readFile(name) {
  return readFileSync(join(__dirname, 'data', name));
}

export function readArrayBuffer(name) {
  const buf = readFile(name);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export function readCatalog(name) {
  return parse(readArrayBuffer(name));
}
