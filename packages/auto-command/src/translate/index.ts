import fs from 'fs-extra';
import path from 'path';
import signale from 'signale';
import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import utils from 'txp-utils';

import translate from './translate';

function getter(obj, arr) {
  return arr.length === 0
    ? obj
    : getter(typeof obj === 'undefined' ? undefined : obj[arr[0]], arr.slice(1));
}
function contrastDir(before, after) {
  const arr = after.map(element => {
    const { dirName, dirContent } = element;
    const beforeDirContent = before.find(item => item.dirName === dirName);
    if (!beforeDirContent) {
      return { dirName, dirContent };
    }
    return {
      dirName,
      dirContent: dirContent.map(elements => {
        const { fileName, fileContent } = elements;
        const beforeFileContent = beforeDirContent?.dirContent?.find(item => {
          return fileName === item.fileName;
        })?.fileContent;
        if (!beforeFileContent) {
          return { fileName, fileContent };
        }
        recursiveObj(
          fileContent,
          (obj, key, nodeStr) => {
            // 根节点赋值
            if (typeof obj[key] !== 'object') {
              const beforeValue = getter(beforeFileContent, nodeStr);
              if (beforeValue) {
                obj[key] = beforeValue;
              }
            }
          },
          [],
        );
        return { fileName, fileContent };
      }),
    };
  });
  return arr;
}
function contrastFile(before, after) {
  const arr = after.map(element => {
    const { fileName, fileContent } = element;
    const beforeContent = before.find(item => fileName === item.fileName)?.fileContent;
    if (!beforeContent) {
      return { fileName, fileContent };
    }
    recursiveObj(
      fileContent,
      (obj, key, nodeStr) => {
        // 根节点赋值
        if (typeof obj[key] !== 'object') {
          const beforeValue = getter(beforeContent, nodeStr);
          if (beforeValue) {
            obj[key] = beforeValue;
          }
        }
      },
      [],
    );
    return { fileName, fileContent };
  });
  return arr;
}
// 递归对象
function recursiveObj(obj, fc, nodeStrs) {
  const curNode = JSON.parse(JSON.stringify(nodeStrs || []));
  for (const item in obj) {
    fc.apply(this, [obj, item, [...curNode, item]]);
    if (
      Object.prototype.toString.call(obj[item]) === '[object Object]' ||
      Object.prototype.toString.call(obj[item]) === '[object Array]'
    ) {
      recursiveObj(obj[item], fc, [...curNode, item]);
    }
  }
}
function writeFile(path, text) {
  try {
    fs.outputFileSync(path, text);
  } catch (err) {
    console.error(err);
  }
}
function getObj(str) {
  // ast处理成需要的对象
  const { ast } = babel.transform(str, { ast: true });
  const m = ast.program.body[0].declaration;
  ast.program.body = [m];
  let isObjectProperty = false;
  // 保证对象的key是字符串才能json化成功
  traverse(ast, {
    enter(path) {
      // 单引号换成双引号
      path.node.extra = {};
      // isObjectProperty之后的第一个节点为key
      if (isObjectProperty) {
        // 所有key应该是字符串
        path.node.type = 'StringLiteral';
        path.node.value = path.node.name || path.node.value;
        path.node.name = path.node.value || path.node.name;
      }
      // 这个path会找到所有的node
      if (path.node.type === 'ObjectProperty') {
        isObjectProperty = true;
      } else {
        isObjectProperty = false;
      }
    },
  });
  // 生成可序列号的字符串
  const ret = generate(ast, { jsescOption: { minimal: true } }).code;

  // 拿到想要的对象
  let obj;
  try {
    obj = JSON.parse(ret);
  } catch (error) {
    utils.node.logger.error(ret);
    throw error;
  }
  return obj;
}
// 传入一个对象，替换里面的value值
async function replaceValue(params, { from, to }, separator) {
  // 遍历对象value值成扁平数组
  const newParams = JSON.parse(JSON.stringify(params));
  let isLog = false;
  const arr = [];
  recursiveObj(newParams, (obj, key) => {
    if (Object.prototype.toString.call(params) === '[object Object]') {
      isLog = true;
    }
    const curNodeType = Object.prototype.toString.call(obj[key]);
    if (key === 'fileName') {
      isLog = false;
    }
    if (isLog && curNodeType !== '[object Object]' && curNodeType !== '[object Array]') {
      arr.push(obj[key]);
    }
    if (key === 'fileContent') {
      isLog = true;
    }
  });

  // 数组转换成字符串，翻译，再转换成数组
  const str = arr.join('\n');
  const newStr = await translate(str, { from, to }, separator);
  const newArr = newStr.split('\n');
  // 新数组重新赋值给对象
  let index = 0;
  isLog = false;
  recursiveObj(
    newParams,
    (obj, key) => {
      if (Object.prototype.toString.call(params) === '[object Object]') {
        isLog = true;
      }
      const curNodeType = Object.prototype.toString.call(obj[key]);
      if (key === 'fileName') {
        isLog = false;
      }
      if (isLog && curNodeType !== '[object Object]' && curNodeType !== '[object Array]') {
        obj[key] = newArr[index];
        index += 1;
      }
      if (key === 'fileContent') {
        isLog = true;
      }
    },
    [],
  );
  return newParams;
}
// 核心翻译流程
async function core({
  keep = true,
  type = 'dir',
  outDir,
  language = { from: 'zh-CN', to: ['en-US'] },
  separator,
}) {
  signale.time('translate');
  // 判断input是路径还是文件
  if (type === 'dir') {
    // 把输出目录中的文件转换成数组
    const outDirArr = fs.readdirSync(path.join(outDir));
    const outFileArr = outDirArr
      .map(langItem => {
        // 输入目录里的文件内容转成数组
        try {
          fs.ensureDirSync(path.join(outDir, `/${langItem}`));
          const langDirArr = fs.readdirSync(path.join(outDir, `/${langItem}`));
          const langFileArr = langDirArr.map(item => {
            const str = path.join(outDir, `/${langItem}`, item);
            const file = fs.readFileSync(str, 'utf8');
            return {
              fileName: item,
              fileContent: getObj(file),
            };
          });
          return { dirName: langItem, dirContent: langFileArr };
        } catch (error) {}
        try {
          fs.ensureFileSync(path.join(outDir, `/${item}`));
        } catch (error) {}
      })
      .filter(item => item);
    // 拿到输入文件数据
    const inputFileData = outFileArr.find(item => item.dirName === language.from);
    // 翻译
    const allRequst = language.to.map(item =>
      replaceValue(
        inputFileData.dirContent,
        {
          from: language.from,
          to: item,
        },
        separator,
      ),
    );
    const resData = await Promise.all(allRequst);
    const transData = language.to.map((item, index) => ({
      dirName: item,
      dirContent: resData[index],
    }));
    let lastData;
    if (keep) {
      lastData = contrastDir(outFileArr, transData);
    } else {
      lastData = transData;
    }
    lastData.forEach(element => {
      const { dirName, dirContent } = element;
      dirContent.forEach(item => {
        const { fileName, fileContent } = item;
        writeFile(
          path.join(outDir, `/${dirName}/`, fileName),
          `export default ${JSON.stringify(fileContent)};`,
        );
      });
    });
  }
  if (type === 'file') {
    // 把输出目录中的文件转换成数组
    const outDirArr = fs.readdirSync(path.join(outDir));
    const outFileArr = outDirArr.map(item => {
      const str = path.join(outDir, `/${item}`);
      const file = fs.readFileSync(str, 'utf8');
      return {
        fileName: item,
        fileContent: getObj(file),
      };
    });
    // 拿到输入文件数据
    const inputFileData = outFileArr.find(item => new RegExp(language.from).test(item.fileName));
    const suffix = path.extname(inputFileData.fileName);
    // 翻译
    const allRequst = language.to.map(item =>
      replaceValue(
        inputFileData.fileContent,
        {
          from: language.from,
          to: item,
        },
        separator,
      ),
    );
    const resData = await Promise.all(allRequst);
    const transData = language.to.map((item, index) => ({
      fileName: item + suffix,
      fileContent: resData[index],
    }));
    let lastData;
    if (keep) {
      lastData = contrastFile(outFileArr, transData);
    } else {
      lastData = transData;
    }
    lastData.forEach(element => {
      const { fileName, fileContent } = element;
      writeFile(
        path.join(outDir, `/${fileName}`),
        `export default ${JSON.stringify(fileContent)};`,
      );
    });
  }
  signale.timeEnd('translate');
}
export default core;
