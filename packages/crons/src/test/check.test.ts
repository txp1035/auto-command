import check from '../check';

test('check', () => {
  // not cron
  expect(check('1 2 3 4 5 6 7 8')).toBe(false);
  // linux cron、common
  expect(check('1 2-5,3-5/2 4 4 4')).toBe(true);
  // spring cron
  expect(check('* * * * * *')).toBe(true);
  // quartz cron、day L、week ?
  expect(check('* * * L * ? *')).toBe(true);
  // day 2W
  expect(check('* * * 2W * ? *')).toBe(true);
  // day ? and week 1#2
  expect(check('* * * ? * 1#2 *')).toBe(true);
  // week 1L
  expect(check('* * * * * 1L *')).toBe(true);
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
  // error cron more Day
  expect(check('* * * 51W * * *')).toEqual({
    day: false,
    hour: true,
    minute: true,
    moth: true,
    second: true,
    week: true,
    year: true,
  });
});
