// @flow

export function *enumerate<T>(iter: Iterable<T>): Iterable<[number, T]> {
  let index = 0;
  for (let item of iter) {
    yield [index++, item];
  }
}

export function *range(until: number): Iterable<number> {
  let num = 0;
  while (num < until) {
    yield num++;
  }
}

export function b2ab(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

