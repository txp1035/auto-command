import { getCode } from './index';

test('getCode', () => {
  expect(getCode('partner.depotnextdoor.com')).toEqual('d94cd395390c9b72ed33667c613aad4e');
});
