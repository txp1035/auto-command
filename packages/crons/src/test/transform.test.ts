import transform from '../transform';

test('transform', () => {
  // common、week ?、day L
  const commonString = '2,1,3,5-8,12-13/2 * * L * ? *';
  const commonObject = {
    second: {
      isCommon: false,
      list: [
        '2',
        '1',
        '3',
        { start: '5', end: '8', step: undefined },
        { start: '12', end: '13', step: '2' },
      ],
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      isLastDay: true,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      isAppoint: true,
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(commonString)).toEqual(commonObject);
  expect(transform(commonObject)).toEqual(commonString);
  // day 1W
  const dayString = '* * * 1W * ? *';
  const dayObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      workingDays: '1',
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      isAppoint: true,
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(dayString)).toEqual(dayObject);
  expect(transform(dayObject)).toEqual(dayString);
  // day base
  const dayBaseString = '* * * 1 * ? *';
  const dayBaseObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      list: ['1'],
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      isAppoint: true,
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(dayBaseString)).toEqual(dayBaseObject);
  expect(transform(dayBaseObject)).toEqual(dayBaseString);
  // week base and day ?
  const weekBaseString = '* * * ? * 1 *';
  const weekBaseObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      isAppoint: true,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      list: ['1'],
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(weekBaseString)).toEqual(weekBaseObject);
  expect(transform(weekBaseObject)).toEqual(weekBaseString);
  // week 1#2
  const weekString = '* * * ? * 1#2 *';
  const weekObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      isAppoint: true,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      appointValue: {
        ranking: '2',
        week: '1',
      },
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(weekString)).toEqual(weekObject);
  expect(transform(weekObject)).toEqual(weekString);
  // week 1L
  const weekLastString = '* * * ? * 1L *';
  const weekLastObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: false,
      isAppoint: true,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      Last: '1',
    },
    year: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(weekLastString)).toEqual(weekLastObject);
  expect(transform(weekLastObject)).toEqual(weekLastString);
  // spring
  const springString = '* * * * * ?';
  const springObject = {
    second: {
      isCommon: true,
      list: undefined,
    },
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: true,
      list: undefined,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: false,
      isAppoint: true,
    },
  };
  expect(transform(springString)).toEqual(springObject);
  expect(transform(springObject)).toEqual(springString);
  // linux
  const linuxString = '* * * * *';
  const linuxObject = {
    minute: {
      isCommon: true,
      list: undefined,
    },
    hour: {
      isCommon: true,
      list: undefined,
    },
    day: {
      isCommon: true,
      list: undefined,
    },
    moth: {
      isCommon: true,
      list: undefined,
    },
    week: {
      isCommon: true,
      list: undefined,
    },
  };
  expect(transform(linuxString)).toEqual(linuxObject);
  expect(transform(linuxObject)).toEqual(linuxString);
  // not cron
  const fn = () => {
    transform(false);
  };
  expect(fn).toThrow('转换cron表达式错误');
});
