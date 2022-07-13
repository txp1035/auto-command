import googleTranslate from './google';
import youdaoTranslate from './youdao';
import type { IGoogleConfig } from './google';
import type { IYouDaoConfig } from './youdao';

export type TTranslator = 'google' | 'youdao';
export interface Ilanguage {
  from: string;
  to: string;
}
export interface ITranslateOptions {
  language: Ilanguage;
  translatorType: TTranslator;
  google?: IGoogleConfig;
  youdao?: IYouDaoConfig;
}

export default async (
  content: string,
  { translatorType, language, youdao, google }: ITranslateOptions,
) => {
  let res;
  if (translatorType === 'google') {
    res = await googleTranslate(content, { language, config: google });
  }
  if (translatorType === 'youdao') {
    res = await youdaoTranslate(content, { language, config: youdao });
  }
  return res;
};
