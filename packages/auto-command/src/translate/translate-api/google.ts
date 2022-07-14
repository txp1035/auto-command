import querystring from 'query-string';
import got from 'got';
import tunnel from 'tunnel';
import type { Language, GoogleConfig } from './types';
import { checkCode } from './languages';

function extract(key: any, res: any) {
  var re = new RegExp(`"${key}":".*?"`);
  var result = re.exec(res.body);
  if (result !== null) {
    return result[0].replace(`"${key}":"`, '').slice(0, -1);
  }
  return '';
}
interface Options {
  language?: Language;
  config?: GoogleConfig;
}

function translate(text: any, opts: any, gotopts: any) {
  if (opts.from) {
    checkCode(opts.from, 'google');
  }
  if (opts.to) {
    checkCode(opts.to, 'google');
  }
  opts = opts || {};
  gotopts = gotopts || {};
  opts.from = opts.from || 'auto';
  opts.to = opts.to || 'en';
  opts.tld = opts.tld || 'com';
  opts.autoCorrect = opts.autoCorrect === undefined ? false : Boolean(opts.autoCorrect);
  var url = 'https://translate.google.' + opts.tld;
  // 根据translate.google.com常量rpcid似乎有不同的值与不同的post体格式。
  // * MkEWBc - 返回翻译
  // * AVdN8 - 返回建议
  // * exi25c - 返回一些技术信息
  var rpcids = 'MkEWBc';
  return got(url, gotopts)
    .then(function (res: any) {
      var data = {
        rpcids: rpcids,
        'source-path': '/',
        'f.sid': extract('FdrFJe', res),
        bl: extract('cfb2h', res),
        hl: 'en-US',
        'soc-app': 1,
        'soc-platform': 1,
        'soc-device': 1,
        _reqid: Math.floor(1000 + Math.random() * 9000),
        rt: 'c',
      };
      return data;
    })
    .then(function (data: any) {
      url = url + '/_/TranslateWebserverUi/data/batchexecute?' + querystring.stringify(data);
      // === 以下频率的格式仅适用于 rpcids = MkEWBc ===
      var freq = [
        [
          [
            rpcids,
            JSON.stringify([[text, opts.from, opts.to, opts.autoCorrect], [null]]),
            null,
            'generic',
          ],
        ],
      ];
      gotopts.body = 'f.req=' + encodeURIComponent(JSON.stringify(freq)) + '&';
      gotopts.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      return got
        .post(url, gotopts)
        .then(function (res: any) {
          var json = res.body.slice(6);
          var length = '';
          var result = {
            text: '',
            pronunciation: '',
            from: {
              language: {
                didYouMean: false,
                iso: '',
              },
              text: {
                autoCorrected: false,
                value: '',
                didYouMean: false,
              },
            },
            raw: '',
          };
          try {
            length = (/^\d+/.exec(json) || [])[0];
            json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
            json = JSON.parse(json[0][2]);
            result.raw = json;
          } catch (e) {
            return result;
          }
          if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
            // 未找到翻译，可能是超链接或特定性别的翻译？
            result.text = json[1][0][0][0];
          } else {
            result.text = json[1][0][0][5]
              .map(function (obj: any) {
                return obj[0];
              })
              .filter(Boolean)
              // Google api 似乎通过 <dot><space> 分割每个句子的文本
              // 所以我们用空格连接文本。
              .join(' ');
          }
          result.pronunciation = json[1][0][0][1];
          if (json[0] && json[0][1] && json[0][1][1]) {
            result.from.language.didYouMean = true;
            result.from.language.iso = json[0][1][1][0];
          } else if (json[1][3] === 'auto') {
            result.from.language.iso = json[2];
          } else {
            result.from.language.iso = json[1][3];
          }
          if (json[0] && json[0][1] && json[0][1][0]) {
            var str = json[0][1][0][0][1];
            str = str.replace(/<b>(<i>)?/g, '[');
            str = str.replace(/(<\/i>)?<\/b>/g, ']');

            result.from.text.value = str;

            if (json[0][1][0][2] === 1) {
              result.from.text.autoCorrected = true;
            } else {
              result.from.text.didYouMean = true;
            }
          }

          return result;
        })
        .catch(function (err: any) {
          err.message += `\nUrl: ${url}`;
          if (err.statusCode !== undefined && err.statusCode !== 200) {
            err.code = 'BAD_REQUEST';
          } else {
            err.code = 'BAD_NETWORK';
          }
          throw err;
        });
    });
}

export default async (content: string, options: Options) => {
  let gotopts;
  if (options.config?.proxy) {
    gotopts = {
      agent: tunnel.httpsOverHttp({
        proxy: {
          ...options.config?.proxy,
          proxyAuth: 'user:pass',
          headers: {
            'User-Agent': 'Node',
          },
        },
      }),
    };
  }
  const res = await translate(content, options.language, gotopts);
  return res.text;
};
