import md5 from 'md5';
import axios from 'axios';
import type { Ilanguage } from './index';
import { checkCode } from './languages';

interface ITranslateOptions {
  language?: Ilanguage;
  config?: IYouDaoConfig;
}
export interface IYouDaoConfig {
  key: string;
  secret: string;
}
async function translate(content: string, options: ITranslateOptions) {
  if (options?.language?.from) {
    checkCode(options?.language?.from, 'youdao');
  }
  if (options?.language?.to) {
    checkCode(options?.language?.to, 'youdao');
  }
  const {
    // 申请的key和secret
    config = { key: '5721fbb81d578037', secret: 'Kzz4NP0B9rxjncsvyyLXZWz70AvxpGZB' },
    language = { from: 'zh-CN', to: 'en-US' },
    // 参数
  } = options;
  const newFrom = language.from;
  const newTo = language.to;
  const { key, secret } = config;
  // 随机数
  const salt = Math.random();
  // 生成签名
  const sign = md5(key + content + salt + secret);
  const params = {
    from: newFrom,
    to: newTo,
    appKey: key,
    salt,
    sign,
    q: content,
  };
  // 发送http GET请求
  const res = await axios.get('http://openapi.youdao.com/api', { params });
  const result = res?.data?.translation[0];
  return result;
}

export default translate;
