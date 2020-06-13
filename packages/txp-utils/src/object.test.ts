import { filterObj, getChainObj } from './object';

test('filterObj', () => {
  expect(filterObj({ a: NaN, b: null, c: undefined, d: '', e: false, f: 0 })).toEqual({
    d: '',
    e: false,
    f: 0,
  });
  expect(filterObj({ a: NaN, b: null, c: undefined, d: '', e: false, f: 0 }, () => true)).toEqual({
    a: NaN,
    b: null,
    c: undefined,
    d: '',
    e: false,
    f: 0,
  });
});
test('getChainObj', () => {
  expect(getChainObj({ a: 123, b: null }, 'obj.as.bc')).toBe('');
  expect(getChainObj({ a: 123, b: null }, 'obj.a')).toBe(123);
  expect(getChainObj({ a: 123, b: null }, 'obj.a.b')).toBe('');
});
