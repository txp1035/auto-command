import { transformRange } from '../utils';

test('数量和空格测试', () => {
  expect(
    transformRange([
      '1',
      '2',
      '3',
      '4',
      '5',
      { start: '1', end: '10', step: '' },
      '11',
      '23',
      '22',
      { start: '25', end: '29', step: '' },
    ]),
  ).toEqual([22, 23, { start: 1, end: 11 }, { start: 25, end: 29 }]);
});
