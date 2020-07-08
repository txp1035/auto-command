import translate from '../translate';

test('translate', () => {
  // 每天的18点到23点的0分的1到6秒，7到9秒每隔1秒执行。
  expect(translate('1,2,3,4-6,7-9/2 0 18-23 * * ? *')).toBe(
    '18点到23点的0分的1秒到6秒，7秒到9秒每隔1秒',
  );
});
