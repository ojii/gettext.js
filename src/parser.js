// @flow
import Immutable from 'immutable';
import {TextDecoder} from 'text-encoding';
import {enumerate, range} from './utils';
import type {Headers, Messages} from './runtime';


const LE_MAGIC = 0x950412de;
const BE_MAGIC = 0xde120495;
const VERSIONS = Immutable.Set([0, 1]);
const defaultPlural = 'n !== 1 ? 1 : 0';

const UTF8Decoder = new TextDecoder('utf-8');

export type PluralString = string;

export default function parse(buf: ArrayBuffer): [Headers, Messages, PluralString] {
  const view = new DataView(buf);
  const magic = view.getUint32(0, true);
  let unpack: (ArrayBuffer) => Iterable<number>;
  if (magic === LE_MAGIC) {
    unpack = unpackUInt32LE;
  } else if (magic === BE_MAGIC) {
    unpack = unpackUInt32BE;
  } else {
    throw new Error(`Invalid magic number ${magic}`);
  }
  let plural = defaultPlural;
  let [version, msgcount, masteridx, transidx] = unpack(buf.slice(4, 20));
  const [major, minor] = _parseVersion(version);
  if (!VERSIONS.has(major)) {
    throw new Error(`Unsupported version ${major}.${minor}`);
  }
  let buflen = buf.byteLength;
  let headers: Immutable.Map<string, string> = Immutable.Map();
  let messages: Immutable.Map<string, Immutable.List<string>> = Immutable.Map();
  let decoder = UTF8Decoder;
  for (let index of range(msgcount)) {
    let [mlen, moff] = unpack(buf.slice(masteridx, masteridx + 8));
    let mend = moff + mlen;
    let [tlen, toff] = unpack(buf.slice(transidx, transidx + 8));
    let tend = toff + tlen;
    let msg, tmsg;
    if (mend < buflen && tend < buflen) {
      msg = readByteString(buf, moff, mend);
      tmsg = readByteString(buf, toff, tend);
    } else {
      throw new Error('corrupt file');
    }
    if (mlen === 0) {
      let lastk = null;
      for (let b_item of splitBinary(tmsg, '\n'.codePointAt(0))) {
        let item = UTF8Decoder.decode(b_item).trim();
        if (!item.length) {
          continue;
        }
        let k = null;
        let v = null;
        if (item.indexOf(':') !== -1) {
          [k, v] = item.split(':', 2);
          k = k.trim().toLowerCase();
          v = v.trim();
          headers = headers.set(k, v);
          lastk = k;
        } else if (lastk !== null) {
          headers.set(lastk, headers.get(lastk, '') + '\n' + item);
        }
        if (k === 'content-type' && v !== null) {
          decoder = new TextDecoder(v.split('charset=1')[1]);
        } else if (k === 'plural-forms' && v !== null) {
          plural = v.split(';')[1].split('plural=')[1];
        }
      }
    }
    if (msg.indexOf(0) !== -1) {
      let [msgid1] = splitBinary(msg, 0);
      messages = messages.set(decoder.decode(msgid1), Immutable.List(splitBinary(tmsg, 0)).map(val => decoder.decode(val)));
    } else {
      messages = messages.set(decoder.decode(msg), Immutable.List([decoder.decode(tmsg)]));
    }
    masteridx += 8;
    transidx += 8;
  }
  return [headers, messages, plural];
}

function readByteString(buf: ArrayBuffer, start: number, end: number): Uint8Array {
  return new Uint8Array(buf.slice(start, end));
}

function *splitBinary(buf: Uint8Array, split: number): Iterable<Uint8Array> {
  let start = 0;
  for (let [index, byte] of enumerate(new Uint8Array(buf))) {
    if (byte === split) {
      yield buf.slice(start, index);
      start = index + 1;
    }
  }
  yield buf.slice(start, buf.byteLength);
}

function *unpackUInt32(buf: ArrayBuffer, le: boolean): Iterable<number> {
  const length = buf.byteLength;
  const view = new DataView(buf);
  for (let offset = 0; offset < length; offset += 4) {
    yield view.getUint32(offset, le);
  }
}

const unpackUInt32LE: (ArrayBuffer) => Iterable<number> = buf => unpackUInt32(buf, true);
const unpackUInt32BE: (ArrayBuffer) => Iterable<number> = buf => unpackUInt32(buf, false);

function _parseVersion(version: number): [number, number] {
  return [(version >>> 16) >>> 0, (version & 0xffff) >>> 0];
}
