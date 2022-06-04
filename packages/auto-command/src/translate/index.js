var fs = require('fs-extra');
var path = require('path');
var signale = require('signale');
var translate = require('./translate');

// en-US
function handelMainFile(params, language) {
  const fileArr = language.to.map(item => {
    const fileObj = {
      path: `/${item}.ts`,
      text: params.replaceAll(language.from, item),
    };
    return fileObj;
  });
  return fileArr;
}
function replaceStr(str, beforeArr, afterArr) {
  let newStr = str;
  beforeArr.forEach((element, index) => {
    newStr = newStr.replace(element, afterArr[index]);
  });
  return newStr;
}
async function handelReferenceFile(params, language, outDir) {
  let arr = [];
  for (const iterator of language.to) {
    const newParams = JSON.parse(JSON.stringify(params));
    const beforeStr = newParams
      .map(item =>
        item?.text
          ?.match(/: '(.*?)'/g)
          .map(items => {
            const str = items.substring(3, items.length - 1);
            return str;
          })
          .join(';'),
      )
      .join('&');

    const beforeArr = beforeStr.split('&').map(item => item.split(';'));
    const afterStr = await translate(beforeStr, { from: language.from, to: iterator });

    const afterArr = afterStr.split('&').map(item => item.split(';'));
    const fileArr = newParams.map((item, index) => {
      const obj = {
        path: path.join(outDir, `${iterator}/${item.name}`),
        text: replaceStr(item.text, beforeArr[index], afterArr[index]),
      };
      return obj;
    });
    arr = [...arr, ...fileArr];
  }
  return arr;
}
function writeFile(path, text) {
  try {
    fs.outputFileSync(path, text);
  } catch (err) {
    console.error(err);
  }
}

async function main({ outDir, language = { from: 'zh-CN', to: ['en-US'] } }) {
  signale.time('translate');
  function step1() {
    const mainFileStr = fs.readFileSync(path.join(outDir, `/${language.from}.ts`), 'utf8');
    const mainFileArr = handelMainFile(mainFileStr, language);
    mainFileArr.forEach(element => {
      writeFile(path.join(outDir, element.path), element.text);
    });
  }
  step1();
  const dir = fs.readdirSync(path.join(outDir, '/zh-CN/'));
  const branchFileArr = dir.map(item => {
    const str = path.join(outDir, '/zh-CN/', item);
    const file = fs.readFileSync(str, 'utf8');
    return { name: item, text: file };
  });
  const branchAllFileArr = await handelReferenceFile(branchFileArr, language, outDir);
  branchAllFileArr.forEach(element => {
    writeFile(element.path, element.text);
  });
  signale.timeEnd('translate');
}
module.exports = main;
