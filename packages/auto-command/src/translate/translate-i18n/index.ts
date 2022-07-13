import type { ApiOptions, Translator } from '../translate-api/types';
import translate from '../translate-api/index';
import type { Code, I18nOptions } from './types';
import antd from './languages/antd';
export function getCode(code: Code, type: Translator) {
  let newCode;
  try {
    newCode = antd[code][`${type}Code`];
  } catch (error) {
    throw new Error('code或者type错误');
  }
  return newCode;
}

function handelCode(code: Code, type: Translator, separator: string | undefined): string {
  let newCode: string = code;
  if (type === 'google') {
    newCode = getCode(code, 'google');
  }
  if (type === 'youdao') {
    newCode = getCode(code, 'youdao');
  }
  if (separator) {
    newCode = newCode.replace(separator, '-');
  }
  return newCode;
}

export default async function i18n(content: string, options: I18nOptions) {
  const obj: ApiOptions = {
    ...options,
  };
  if (options.language.from) {
    obj.language.from = handelCode(
      options.language.from,
      options.translatorType,
      options.separator,
    );
  }
  if (options.language.to) {
    obj.language.to = handelCode(options.language.to, options.translatorType, options.separator);
  }
  const res = await translate(content, obj);
  return res;
}
