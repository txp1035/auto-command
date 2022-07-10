import fs from 'fs-extra';
import path from 'path';
import signale from 'signale';
import * as babel from '@babel/core';
// @ts-ignore
import traverse from '@babel/traverse';
import generate from '@babel/generator';
// @ts-ignore
import utils from 'txp-utils';

import translate from './translate';
// @ts-ignore
function getter(obj, arr) {
  return arr.length === 0
    ? obj
    : getter(typeof obj === 'undefined' ? undefined : obj[arr[0]], arr.slice(1));
}
// @ts-ignore
function contrastDir(before, after) {
  // @ts-ignore
  const arr = after.map((element) => {
    const { dirName, dirContent } = element;
    // @ts-ignore
    const beforeDirContent = before.find((item) => item.dirName === dirName);
    if (!beforeDirContent) {
      return { dirName, dirContent };
    }
    return {
      dirName,
      // @ts-ignore
      dirContent: dirContent.map((elements) => {
        const { fileName, fileContent } = elements;
        // @ts-ignore
        const beforeFileContent = beforeDirContent?.dirContent?.find((item) => {
          return fileName === item.fileName;
        })?.fileContent;
        if (!beforeFileContent) {
          return { fileName, fileContent };
        }
        recursiveObj(
          fileContent,
          // @ts-ignore
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
// @ts-ignore
function contrastFile(before, after) {
  // @ts-ignore
  const arr = after.map((element) => {
    const { fileName, fileContent } = element;
    // @ts-ignore
    const beforeContent = before.find((item) => fileName === item.fileName)?.fileContent;
    if (!beforeContent) {
      return { fileName, fileContent };
    }
    recursiveObj(
      fileContent,
      // @ts-ignore
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
// @ts-ignore
function recursiveObj(obj, fc, nodeStrs) {
  const curNode = JSON.parse(JSON.stringify(nodeStrs || []));
  // @ts-ignore
  Object.keys(obj).forEach((item) => {
    // @ts-ignore
    fc.apply(this, [obj, item, [...curNode, item]]);
    if (
      Object.prototype.toString.call(obj[item]) === '[object Object]' ||
      Object.prototype.toString.call(obj[item]) === '[object Array]'
    ) {
      recursiveObj(obj[item], fc, [...curNode, item]);
    }
  });
}
// @ts-ignore
function writeFile(paths, text) {
  try {
    fs.outputFileSync(paths, text);
  } catch (err) {
    console.error(err);
  }
}
// @ts-ignore
function getObj(str) {
  // ast处理成需要的对象
  // @ts-ignore
  const { ast } = babel.transform(str, { ast: true });
  const m = ast.program.body[0].declaration;
  ast.program.body = [m];
  let isObjectProperty = false;
  // 保证对象的key是字符串才能json化成功
  traverse(ast, {
    // @ts-ignore
    enter(paths) {
      // 单引号换成双引号
      paths.node.extra = {};
      // isObjectProperty之后的第一个节点为key
      if (isObjectProperty) {
        // 所有key应该是字符串
        paths.node.type = 'StringLiteral';
        paths.node.value = paths.node.name || paths.node.value;
        paths.node.name = paths.node.value || paths.node.name;
      }
      // 这个paths会找到所有的node
      if (paths.node.type === 'ObjectProperty') {
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
// @ts-ignore
async function replaceValue(params, { from, to }, separator) {
  // 遍历对象value值成扁平数组
  const newParams = JSON.parse(JSON.stringify(params));
  let isLog = false;
  // @ts-ignore
  const arr = [];
  // @ts-ignore
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
  // @ts-ignore
  const str = arr.join('\n');
  const newStr = await translate(str, { from, to }, separator);
  const newArr = newStr.split('\n');
  // 新数组重新赋值给对象
  let index = 0;
  isLog = false;
  recursiveObj(
    newParams,
    // @ts-ignore
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
  // @ts-ignore
  outDir,
  language = { from: 'zh-CN', to: ['en-US'] },
  // @ts-ignore
  separator,
}) {
  signale.time('translate');
  // 判断input是路径还是文件
  if (type === 'dir') {
    // 把输出目录中的文件转换成数组
    const outDirArr = fs.readdirSync(path.join(outDir));
    const outFileArr = outDirArr
      .map((langItem) => {
        // 输入目录里的文件内容转成数组
        try {
          fs.ensureDirSync(path.join(outDir, `/${langItem}`));
          const langDirArr = fs.readdirSync(path.join(outDir, `/${langItem}`));
          const langFileArr = langDirArr.map((item) => {
            const str = path.join(outDir, `/${langItem}`, item);
            const file = fs.readFileSync(str, 'utf8');
            return {
              fileName: item,
              fileContent: getObj(file),
            };
          });
          return { dirName: langItem, dirContent: langFileArr };
        } catch (error1) {
          try {
            fs.ensureFileSync(path.join(outDir, `/${langItem}`));
          } catch (error2) {
            // @ts-ignore
            throw new Error(error2);
          }
        }

        return {};
      })
      .filter((item) => item);
    // 拿到输入文件数据
    const inputFileData = outFileArr.find((item) => item.dirName === language.from);
    // 翻译
    const allRequst = language.to.map((item) =>
      replaceValue(
        // @ts-ignore
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
    // @ts-ignore
    lastData.forEach((element) => {
      const { dirName, dirContent } = element;
      // @ts-ignore
      dirContent.forEach((item) => {
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
    const outFileArr = outDirArr.map((item) => {
      const str = path.join(outDir, `/${item}`);
      const file = fs.readFileSync(str, 'utf8');
      return {
        fileName: item,
        fileContent: getObj(file),
      };
    });
    // 拿到输入文件数据
    const inputFileData = outFileArr.find((item) => new RegExp(language.from).test(item.fileName));
    // @ts-ignore
    const suffix = path.extname(inputFileData.fileName);
    // 翻译
    const allRequst = language.to.map((item) =>
      replaceValue(
        // @ts-ignore
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
    // @ts-ignore
    lastData.forEach((element) => {
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
