import { check } from '../check';

test('check', () => {
  // not cron
  expect(check('1 2 3 4 5 6 7 8')).toBe(false);
  // is cron
  expect(check('1 2 3 4 5 7')).toBe(true);
  // error cron
  expect(check('0 0 * 1W,2 * 3#1,1 *')).toEqual({
    day: false,
    hour: true,
    minute: true,
    moth: true,
    second: true,
    week: false,
    year: true,
  });
});
