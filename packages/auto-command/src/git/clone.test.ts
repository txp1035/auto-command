import { urlTransition, getSourceUrl } from './clone';

test('urlTransition', () => {
  const https = 'https://github.com/txp1035/umi.git';
  const ssh = 'git@github.com:txp1035/umi.git';
  const url = 'https://github.com/txp1035/umi';
  const name = 'umi';
  expect(urlTransition(https)).toEqual({ url, name });
  expect(urlTransition(ssh)).toEqual({ url, name });
  expect(() => {
    urlTransition('');
  }).toThrow('请检查你的url');
});
test('getSourceUrl', async () => {
  const url = 'https://github.com/txp1035/umi';
  const sourceUrl = 'https://github.com/umijs/umi';
  const res = await getSourceUrl(url);
  expect(res).toBe(sourceUrl);
});
