import { translate } from '../index';

test('translate', () => {
  // common、day common、week ?
  expect(translate('1,2,3,4-6,7-9/2,10-11/2 0 18-23 * * ? *')).toBe(
    '18点到23点的0分的1秒到6秒，7秒到11秒每隔1秒执行',
  );
  // day L
  expect(translate('* * * L * ? *')).toBe('本月最后一天执行');
  // day 1W
  expect(translate('* * * 1W * ? *')).toBe('离1日最近的工作日执行');
  // week 1#2 and day ?
  expect(translate('* * * ? * 1#2 *')).toBe('第2周的周1执行');
  // week 1L
  expect(translate('* * * ? * 1L *')).toBe('最后一周的周1执行');
  // week common
  expect(translate('* * * ? * 1 *')).toBe('周1执行');
  // not cron
  expect(translate('123')).toBe('cron表达式不合法');
  // Emum
  expect(translate('0 0 0 * * ? *')).toBe('每天');
  // bugs
  // expect(translate('1,2,3,4-6,7-9/2,9-11/2 0 18-23 * * ? *')).toBe(
  //   '18点到23点的0分的1秒到6秒，7秒到9秒每隔11秒执行',
  // );
});
