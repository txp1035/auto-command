import main from './clearObjNull';

test('main', () => {
  expect(main({ a: 123, b: null })).toEqual({ a: 123 });
});
