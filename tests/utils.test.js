// @flow

import {enumerate, range} from '../src/utils';

describe('enumerate', () => {
  test('empty', () => {
    expect(Array.from(enumerate([]))).toEqual([]);
  });
  test('generator', () => {
    function *gen() {
      yield 'a';
      yield 'b';
    }
    expect(Array.from(enumerate(gen()))).toEqual([[0, 'a'], [1, 'b']]);
  });
  test('array', () => {
    expect(Array.from(enumerate(['a', 'b']))).toEqual([[0, 'a'], [1, 'b']]);
  });
});

describe('range', () => {
  test('empty', () => {
    expect(Array.from(range(0))).toEqual([]);
  });
  test('3', () => {
    expect(Array.from(range(3))).toEqual([0, 1, 2]);
  });
});
