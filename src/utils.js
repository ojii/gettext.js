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

export function res2ab(res: Response): Promise<ArrayBuffer> {
  return res.arrayBuffer ? res.arrayBuffer() : res.buffer().then(buf => b2ab(buf));
}

export function b2ab(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}
