import { crossSpawn } from '@txpjs/utils-node';
import { axios, logger } from '@txpjs/utils-node';
import * as cheerio from 'cheerio';

export function urlTransition(url: string): { newUrl: string; name: string } {
  const httpsReg = /^(?<str>https.*\/(?<name>[^\/]*))\.git$/;
  const sshReg = /^git\@github\.com\:(?<str>.*\/(?<name>[^\/]*))\.git$/;
  let obj;
  if (httpsReg.test(url)) {
    obj = {
      newUrl: `${httpsReg.exec(url)?.groups?.str}`,
      name: `${httpsReg.exec(url)?.groups?.name}`,
    };
  }
  if (sshReg.test(url)) {
    obj = {
      newUrl: `https://github.com/${sshReg.exec(url)?.groups?.str}`,
      name: `${sshReg.exec(url)?.groups?.name}`,
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
    res = await axios.get(url);
  } catch (error) {
    throw new Error('网络请求失败');
  }
  const html = res.data;
  const $ = cheerio.load(html);
  const title = $('span.text-small.lh-condensed-ultra.no-wrap.mt-1 a').html();
  return `https://github.com/${title}`;
}

export default async (url: string) => {
  const { newUrl, name } = urlTransition(url);
  logger.wait(`git clone ${url}`);
  crossSpawn.sync('git', ['clone', url], {
    stdio: 'inherit',
  });
  logger.event(`cd ${name}`);
  crossSpawn.sync('cd', [name], {
    stdio: 'inherit',
  });
  logger.wait('getSourceUrl');
  const sourceUrl = await getSourceUrl(newUrl);
  logger.event(`git remote add source ${sourceUrl}`);
  crossSpawn.sync('git', ['remote', 'add', 'source', sourceUrl], {
    stdio: 'inherit',
  });
};
