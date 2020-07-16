import check from '../check';

test('check', () => {
  // not cron
  expect(check('1 2 3 4 5 6 7 8')).toBe(false);
  // is cron
  expect(check('* * * * *')).toBe(true);
  expect(check('* * * * * *')).toBe(true);
  expect(check('1 1 2-5,3-5/2 L 4 ? *')).toBe(true);
  // week 2W
  expect(check('1 1 2-5,3-5/2 2W 4 1#2 *')).toBe(true);
  // ?
  expect(check('1 1 2-5,3-5/2 ? 4 1 *')).toBe(true);
  // day week
  expect(check('1 1 2-5,3-5/2 1 4 1L *')).toBe(true);
  // error cron
  expect(check('99 99 99 1W,2 0-1,9-13/22 3#1,1 99')).toEqual({
    day: false,
    hour: false,
    minute: false,
    moth: false,
    second: false,
    week: false,
    year: false,
  });
  expect(check('99 99 99 51W 0-1,9-13/22 3#1,1 99')).toEqual({
    day: false,
    hour: false,
    minute: false,
    moth: false,
    second: false,
    week: false,
    year: false,
  });
});
