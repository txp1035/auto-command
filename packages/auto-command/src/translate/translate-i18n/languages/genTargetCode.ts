// 谷歌云api规范
//https://cloud.google.com/translate/docs/languages?hl=zh-cn
import google from '../../translate-api/languages/google';
// 有道api规范
// https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html
import youdao from '../../translate-api/languages/youdao';
// 和umi库的SelectLang对标 import {SelectLang} from 'umi';
import antd from './source/antd';
import { fsExtra } from '@txpjs/utils-node';

console.log('google', google.length);
console.log('youdao', youdao.length);
console.log('antd', Object.keys(antd).length);

// 通过这个函数拿到交集或者比较两个api的差异
function getIntersection(base: any[], contrast: any[]) {
  const newContrast = JSON.parse(JSON.stringify(contrast));
  const newBase = base.map((baseItem) => {
    const index = contrast.findIndex((contrastItem) => {
      if (contrastItem.code === baseItem.code) {
        return true;
      }
      if (contrastItem.mark && baseItem.mark) {
        return contrastItem.mark === baseItem.mark;
      }
    });
    if (index > -1) {
      newContrast[index].intersection = true;
      // 拿到交集后加标识符，加code，加memo
      return {
        ...baseItem,
        intersection: true,
        otherCode: newContrast[index].code,
        memo: newContrast[index].memo,
      };
    }
    return { ...baseItem };
  });
  const restBase = newBase.filter((item) => !item.intersection);
  const restContrast = newContrast.filter((item: any) => !item.intersection);
  // 差异查看，两个日志分别标记两种语言code不同的地方，如果查看是一种语言不同code手动去json用mark标记
  if (!true) {
    console.log('restBase', restBase);
    console.log('restContrast', restContrast);
  }
  // 返回base共有数据
  return newBase.filter((item) => item.intersection);
}
function main() {
  const newAntd = Object.entries(antd).map(([key]) => key.split('-')[0]);
  const newAntd1 = Object.entries(antd).map(([key, values]: any) => ({
    memo: values.memo,
    code: key.split('-')[0],
    mark: values.mark,
    antdCode: key,
  }));
  console.log('antd去重语种', [...new Set(newAntd)].length);
  const a = getIntersection(newAntd1, google);
  const b = getIntersection(newAntd1, youdao);
  const c = a.map((item) => {
    const index = b.findIndex((items) => items.antdCode === item.antdCode);
    const obj = {
      googleCode: item.otherCode,
      youdaoCode: b[index].otherCode,
      memo: item.memo,
    };
    return [item.antdCode, obj];
  });
  const d = Object.fromEntries(c);
  const e = Object.keys(d)
    .map((item) => `'${item}'`)
    .join('|');
  const str1 = `export default ${JSON.stringify(d)}\n`;
  const str2 = `export type Code = ${e}`;
  const paths =
    '/Users/shawdanon/GitHub/minehttp/txp/packages/auto-command/src/translate/translate-api/languages';
  fsExtra.outputFileSync(`${paths}/antd.ts`, str1 + str2);
}
main();
