import { clearObjNull } from './handelObj';

test('clearObjNull', () => {
  expect(clearObjNull({ a: 123, b: null })).toEqual({ a: 123 });
});
