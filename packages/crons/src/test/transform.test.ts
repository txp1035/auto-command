import { transformFrequency, transformBase } from '../transform';

test('转换频率测试', () => {
  expect(transformFrequency('* * * * * * *')).toEqual({
    second: '*',
    minute: '*',
    hour: '*',
    day: '*',
    moth: '*',
    week: '*',
    year: '*',
  });
  expect(
    transformFrequency({
      second: '*',
      minute: '*',
      hour: '*',
      day: '*',
      moth: '*',
      week: '*',
      year: '*',
    }),
  ).toBe('* * * * * * *');
  expect(transformFrequency('15 14 1 * *')).toEqual({
    minute: '15',
    hour: '14',
    day: '1',
    moth: '*',
    week: '*',
  });
  expect(
    transformFrequency({
      minute: '15',
      hour: '14',
      day: '1',
      moth: '*',
      week: '*',
    }),
  ).toBe('15 14 1 * *');
});
test('转换基础字符测试', () => {
  //有步长的情况
  expect(transformBase('1,2,3,4,2-5/1')).toEqual({
    isCommon: false,
    list: ['1', '2', '3', '4', { start: '2', end: '5', step: '1' }],
  });
  //没有步长的情况
  expect(transformBase('1,2,3,4,2-5')).toEqual({
    start: '2',
    end: '5',
    step: '',
    list: ['1', '2', '3', '4'],
  });
  //复杂情况
  expect(transformBase('1,2,3,4,1-2,2-5,1#4,L')).toEqual({
    start: '2',
    end: '5',
    step: '',
    list: ['1', '2', '3', '4'],
  });
  //有步长的情况
  expect(
    transformBase({
      start: '2',
      end: '5',
      step: '1',
      list: ['1', '2', '3', '4'],
    }),
  ).toBe('1,2,3,4,2-5/1');
  //没有步长的情况
  expect(
    transformBase({
      start: '2',
      end: '5',
      step: '',
      list: ['1', '2', '3', '4'],
    }),
  ).toBe('1,2,3,4,2-5');
});
