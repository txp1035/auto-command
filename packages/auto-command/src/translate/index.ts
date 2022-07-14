import fs, { write } from 'fs-extra';
import path from 'path';
import signale from 'signale';
import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import utils from 'txp-utils';
import prettier from 'prettier';
import type { Code, I18nPartOptions, I18nOptions } from './translate-i18n/types';
import type { ApiPartOptions } from './translate-api/types';
import translate from './translate-i18n';

interface generalObj {
  [key: string]: generalObj;
}

// 基于字符串数组拿到对象深层的值
function getter<T>(obj: T | undefined, arr: string[]): T | undefined {
  const { length } = arr;
  if (length === 0) {
    return obj;
  }
  if (typeof obj === 'undefined') {
    return undefined;
  }
  try {
    // @ts-ignore
    return getter(obj[arr[0]], arr.slice(1));
  } catch (error) {
    throw new Error(String(error));
  }
}
interface fileDataType {
  fileName: string;
  fileContent: object;
}
interface dirDataType {
  dirName: string;
  dirContent: fileDataType[];
}
// 二维数组对比
function contrastDir(before: dirDataType[], after: dirDataType[]) {
  const arr = after.map((element) => {
    const { dirName, dirContent } = element;
    const beforeDirContent = before.find((item) => item.dirName === dirName);
    if (typeof beforeDirContent === 'undefined') {
      return { dirName, dirContent };
    }
    return {
      dirName,
      dirContent: contrastFile(beforeDirContent?.dirContent, dirContent),
    };
  });
  return arr;
}
// 数组对比
function contrastFile(before: fileDataType[], after: fileDataType[]) {
  const arr = after.map((element) => {
    const { fileName, fileContent } = element;
    const beforeContent = before.find((item) => fileName === item.fileName)?.fileContent;
    if (!beforeContent) {
      return { fileName, fileContent };
    }
    // 深度遍历处理内容节点
    recursiveObj(
      // @ts-ignore
      fileContent,
      (obj: { [key: string]: any }, key: string, nodeStr: string[]) => {
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

function recursiveObj(
  obj: generalObj,
  fc: (obj: { [key: string]: any }, item: string, nodeStr: string[]) => void,
  nodeStrs: string[],
) {
  const curNode = JSON.parse(JSON.stringify(nodeStrs || []));
  Object.keys(obj).forEach((item) => {
    fc(obj, item, [...curNode, item]);
    if (
      Object.prototype.toString.call(obj[item]) === '[object Object]' ||
      Object.prototype.toString.call(obj[item]) === '[object Array]'
    ) {
      recursiveObj(obj[item], fc, [...curNode, item]);
    }
  });
}

// 写文件统一调用
function writeFile(paths: string, text: string) {
  try {
    fs.outputFileSync(paths, text);
  } catch (err) {
    console.error(err);
  }
}
function formatting(params: object): string {
  const text = `export default ${JSON.stringify(params)};`;
  const newText = prettier.format(text, { semi: false, parser: 'babel' });
  return newText;
}
// 基于文件字符串拿到对象
function getObj(str: string) {
  // ast处理成需要的对象
  const { ast }: any = babel.transform(str, { ast: true });
  const m = ast.program.body[0].declaration;
  ast.program.body = [m];
  let isObjectProperty = false;
  // 保证对象的key是字符串才能json化成功
  traverse(ast, {
    enter(paths: any) {
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

// 传入一个对象，翻译fileContent里面的value值
async function replaceValue(params: { [key: string]: any }, options: I18nOptions) {
  // 遍历对象value值成扁平数组
  const newParams = JSON.parse(JSON.stringify(params));
  let isLog = false;
  const arr: string[] = [];
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
        arr.push(obj[key]);
      }
      if (key === 'fileContent') {
        isLog = true;
      }
    },
    [],
  );
  // 数组转换成字符串，翻译，再转换成数组
  const str = arr.join('\n');
  // @ts-ignore 这里设置默认值，options有值就覆盖
  const newStr = await translate(str, { separator: '-', translatorType: 'youdao', ...options });
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
export interface TranslateConfig extends ApiPartOptions, I18nPartOptions {
  outDir: string;
  keep?: boolean;
  type?: 'dir' | 'file';
  language?: { from: Code; to: Code[] };
  hook?: Hook;
}
interface FileNode {
  name: string;
  type: 'dir' | 'file' | 'ignore' | undefined;
  path: string;
  content: string | FileNode[];
}
function traverseDocument(dir: string, hook: Hook): FileNode[] {
  const dirArr = fs.readdirSync(dir);
  return dirArr
    .map((item): FileNode => {
      const itemPath = path.join(dir, `/${item}`);
      try {
        // 如果是目录
        fs.ensureDirSync(itemPath);
        if (hook?.filter && !hook?.filter(item)) {
          return {
            name: item,
            type: 'ignore',
            path: itemPath,
            content: 'ignore',
          };
        }
        return {
          name: item,
          type: 'dir',
          path: itemPath,
          content: traverseDocument(itemPath, hook),
        };
      } catch (error) {
        try {
          // 如果是文件
          fs.ensureFileSync(itemPath);
          if (hook?.filter && !hook?.filter(item)) {
            return {
              name: item,
              type: 'ignore',
              path: itemPath,
              content: 'ignore',
            };
          }
          const file = fs.readFileSync(itemPath, 'utf8');
          return {
            name: item,
            type: 'file',
            path: itemPath,
            content: file,
          };
        } catch (error) {
          // 正常来说不可能进到这里
          return { name: 'name', type: undefined, path: itemPath, content: '既不是文件也不是目录' };
        }
      }
    })
    .filter((item) => item.type !== 'ignore');
}
function traverseWriteFile(array: FileNode[]) {
  array.forEach((element) => {
    if (element.type === 'dir') {
      traverseWriteFile(element.content as FileNode[]);
    }
    if (element.type === 'file') {
      writeFile(element.path, element.content as string);
    }
    if (element.type === undefined) {
      utils.node.logger.error('输出文件出现类型错误！');
    }
  });
}
const hookDir: Hook = {
  getBaseArr: (arr, from) => {
    return arr.filter((item) => new RegExp(from).test(item.name));
  },
  getOtherArr: () => {},
};
const hookFile: Hook = {
  getBaseArr: (arr, from) => {
    return arr.filter((item) => new RegExp(from).test(item.name));
  },
  getOtherArr: () => {},
};
interface Hook {
  // 基于文件或者目录名字忽略掉,返回false就忽略掉
  filter?: (name: string) => boolean;
  getBaseArr: (arr: FileNode[], from: string) => FileNode[];
  getOtherArr: (arr: FileNode[]) => FileNode[];
}

export function main({
  outDir,
  keep = true,
  type = 'dir',
  language = { from: 'zh-CN', to: ['en-US'] },
  hook,
  ...rest
}: TranslateConfig) {
  let newHook = hook || hookDir;
  if (type === 'dir') {
    newHook = hookDir;
  }
  if (type === 'file') {
    newHook = hookFile;
  }
  let documentArr;
  // 拿目录下文件;
  documentArr = traverseDocument(outDir, newHook);
  // writeFile(`${outDir}/log.json`, JSON.stringify(documentArr));
  // console.log('test', documentArr);
  // return;
  // 选择基础组;
  const baseArr = newHook.getBaseArr(documentArr, language.from);
  // 基于基础组输出其他语言的组
  const newArr = newHook.getOtherArr(baseArr);
  // 输出文件;
  traverseWriteFile(newArr);
}

async function core({
  outDir,
  keep = true,
  type = 'dir',
  language = { from: 'zh-CN', to: ['en-US'] },
  ...rest
}: TranslateConfig) {
  signale.time('translate');
  // 判断input是路径还是文件
  if (type === 'dir') {
    // 把输出目录中的文件转换成数组
    const outDirArr = fs.readdirSync(path.join(outDir));
    const outFileArr = outDirArr
      .map((langItem) => {
        // 输入目录里的文件内容转成数组
        try {
          // 如果是目录
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
        } catch (error) {
          try {
            // 如果是文件
            fs.ensureFileSync(path.join(outDir, `/${langItem}`));
            return undefined;
          } catch (errors) {
            // 两者都不是
            throw new Error(String(errors));
          }
        }
      })
      .filter((item) => !!item) as dirDataType[];
    // 拿到输入文件数据
    const inputFileData = outFileArr.find((item) => item.dirName === language.from);
    // 翻译
    const allRequst = language.to.map((item) =>
      replaceValue(inputFileData?.dirContent || {}, {
        language: {
          from: language.from,
          to: item,
        },
        ...rest,
      }),
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
    lastData.forEach((element) => {
      const { dirName, dirContent } = element;
      dirContent.forEach((item: fileDataType) => {
        const { fileName, fileContent } = item;
        const text = formatting(fileContent);
        writeFile(path.join(outDir, `/${dirName}/`, fileName), text);
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
    if (!inputFileData) {
      throw new Error('inputFileData not find');
    }
    const suffix = path.extname(inputFileData.fileName);
    // 翻译
    const allRequst = language.to.map((item) =>
      replaceValue(inputFileData.fileContent, {
        language: {
          from: language.from,
          to: item,
        },
        ...rest,
      }),
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

    lastData.forEach((element) => {
      const { fileName, fileContent } = element;
      const text = formatting(fileContent);
      writeFile(path.join(outDir, `/${fileName}`), text);
    });
  }
  signale.timeEnd('translate');
}

export default async (options: TranslateConfig) => {
  try {
    await core(options);
  } catch (error) {
    utils.node.logger.error(error);
  }
};
