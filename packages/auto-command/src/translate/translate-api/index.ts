import googleTranslate from './google';
import youdaoTranslate from './youdao';
import type { ApiOptions } from './types';

export default async function api(
  content: string,
  { translatorType = 'youdao', language, youdao, google }: ApiOptions,
) {
  let res;
  if (translatorType === 'google') {
    res = await googleTranslate(content, { language, config: google });
  }
  if (translatorType === 'youdao') {
    res = await youdaoTranslate(content, { language, config: youdao });
  }
  return res;
}
