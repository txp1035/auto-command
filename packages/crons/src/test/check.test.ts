import { checkString } from '../check';

test('数量和空格测试', () => {
  expect(checkString('1 2 3 4 5')).toBe(true);
  expect(checkString('1 2 3 4 5 6')).toBe(true);
  expect(checkString('1 2 3 4 5 6 *')).toBe(true);
  expect(checkString(' 1 2 3 4 5 6 7')).toBe(false);
  expect(checkString('1 2 3 4 5 6 7 ')).toBe(false);
  expect(checkString('1 2 3 4  5 6 7')).toBe(false);
  expect(checkString('1 2 3 4')).toBe(false);
});
