import google from './google';
import youdao from './youdao';

export type TTranslator = 'google' | 'youdao';

export function checkCode(code: string, type: TTranslator) {
  if (type === 'google' && !google.find((item) => item.code === code)) {
    throw new Error('google翻译没有这个code');
  }
  if (type === 'youdao' && !youdao.find((item) => item.code === code)) {
    throw new Error('youdao翻译没有这个code');
  }
}
