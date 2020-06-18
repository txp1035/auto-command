import { checkString, checkHour } from '../check';

test('checkString', () => {
  expect(checkString('1 2 3 4 5')).toBe(true);
  expect(checkString('1 2 3 4 5 6')).toBe(true);
  expect(checkString('1 2 3 4 5 6 *')).toBe(true);
  expect(checkString(' 1 2 3 4 5 6 7')).toBe(false);
  expect(checkString('1 2 3 4 5 6 7 ')).toBe(false);
  expect(checkString('1 2 3 4  5 6 7')).toBe(false);
  expect(checkString('1 2 3 4')).toBe(false);
});
test('common', () => {
  expect(checkString('0 0 0 1 2 2 *')).toBe(true);
  expect(checkString('0 0 * L * 1L *')).toBe(true);
  expect(checkString('0 0 * ? * ? *')).toBe(true);
  expect(checkString('0 0 * 1W * 3#1 *')).toBe(true);
  expect(checkString('0 0 * 1W,2 * 3#1,1 *')).toEqual({
    day: false,
    hour: true,
    minute: true,
    moth: true,
    second: true,
    week: false,
    year: true,
  });
  expect(checkHour('0')).toBe(true);
  expect(checkHour('00')).toBe(false);
  expect(checkHour('')).toBe(false);
});
