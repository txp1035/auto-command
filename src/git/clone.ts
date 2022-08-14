import { crossSpawn } from '@txpjs/utils-node';
import { axios, logger, fetch } from '@txpjs/utils-node';
import * as cheerio from 'cheerio';
import { join } from 'path';

export function urlTransition(preUrl: string): { url: string; name: string } {
  const httpsReg = /^(?<str>https.*\/(?<name>[^\/]*))\.git$/;
  const sshReg = /^git\@github\.com\:(?<str>.*\/(?<name>[^\/]*))\.git$/;
  let obj;
  if (httpsReg.test(preUrl)) {
    obj = {
      url: `${httpsReg.exec(preUrl)?.groups?.str}`,
      name: `${httpsReg.exec(preUrl)?.groups?.name}`,
    };
  }
  if (sshReg.test(preUrl)) {
    obj = {
      url: `https://github.com/${sshReg.exec(preUrl)?.groups?.str}`,
      name: `${sshReg.exec(preUrl)?.groups?.name}`,
    };
  }
  if (obj === undefined) {
    throw new Error('请检查你的url');
  }
  return obj;
}

export async function getSourceUrl(url: string) {
  let res;
  try {
    fetch(url, {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'max-age=0',
        'if-none-match': 'W/"d042cbe5c0406cce0d0094c4db7009ee"',
        'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });
    res = await axios.get(url);
  } catch (error) {
    logger.error('网络请求失败');
    throw error;
  }
  const html = res.data;
  const $ = cheerio.load(html);
  const title = $('span.text-small.lh-condensed-ultra.no-wrap.mt-1 a').html();
  return `https://github.com/${title}`;
}

export default async (url: string) => {
  logger.wait(`git clone ${url}`);
  crossSpawn.sync('git', ['clone', url], {
    stdio: 'inherit',
  });
  const { url: newUrl, name } = urlTransition(url);
  const clonePath = join(process.cwd(), name);
  logger.info(`your respository: ${clonePath}`);
  logger.wait('getSourceUrl');
  const sourceUrl = await getSourceUrl(newUrl);
  logger.event(`git remote add source ${sourceUrl}`);
  crossSpawn.sync('git', ['remote', 'add', 'source', sourceUrl], {
    stdio: 'inherit',
    cwd: clonePath,
  });
};
