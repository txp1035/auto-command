import { transformRange } from '../utils';

test('transformRange', () => {
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
  expect(
    transformRange([
      { start: '1', end: '10', step: '' },
      { start: '2', end: '15', step: '' },
      { start: '25', end: '29', step: '' },
    ]),
  ).toEqual([
    { start: 1, end: 15 },
    { start: 25, end: 29 },
  ]);
});
