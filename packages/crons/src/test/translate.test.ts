import translate, { translateBase } from '../translate';

test('translateBase', () => {
  expect(translateBase('1,2,3,4,5,6,7,8,2-5,3-8,10-26,1-10/3,2-15/3,22-25/2')).toBe(
    '从1到8、从10到26;从22到25每2、从1到15每3;',
  );
});
test('translateBase', () => {
  expect(translateBase('0')).toBe('0;');
});
test('translate', () => {
  expect(translate('0 0 18-24 * * ? *')).toBe('0秒; 0分; 从18到24小时;');
});
