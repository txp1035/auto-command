import fs from 'fs-extra';
import path from 'path';
import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import utils from 'txp-utils';
import prettier from 'prettier';
import type { Code, I18nPartOptions, I18nOptions } from './translate-i18n/types';
import type { ApiPartOptions } from './translate-api/types';
import translate from './translate-i18n';

interface generalObj {
  [key: string]: generalObj | string;
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
// 二维数组对比
function contrastDir(before: FileNode[], after: FileNode[]): FileNode[] {
  const arr = after.map((element) => {
    const { name, content, ...rest } = element;
    const beforeDirContent = before.find((item) => item.name === name);
    if (typeof beforeDirContent === 'undefined') {
      return { name, content, ...rest };
    }
    return {
      name,
      content: contrastFile(beforeDirContent?.content as FileNode[], content as FileNode[]),
      ...rest,
    };
  });
  return arr;
}
// 数组对比
function contrastFile(before: FileNode[], after: FileNode[]): FileNode[] {
  const arr = after.map((element) => {
    const { name, content, ...rest } = element;
    const beforeContent = before.find((item) => name === item.name)?.content;
    if (!beforeContent) {
      return { name, content, ...rest };
    }
    // 深度遍历处理内容节点
    recursiveObj(
      content as generalObj,
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
    return { name, content, ...rest };
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
      recursiveObj(obj[item] as generalObj, fc, [...curNode, item]);
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

// 判断是否为一个文件对象，只有目录翻译才需要传入文件类型对象
function isFile(obj: FileNode | generalObj): boolean {
  let isFile = true;
  Object.keys(obj).forEach((item) => {
    const arr = ['name', 'type', 'path', 'content'];
    if (arr.indexOf(item) === -1) {
      isFile = false;
    }
  });
  return isFile;
}

// params可以是对象也可以是数组
async function replaceValue<T>(params: T, options: I18nOptions): Promise<Awaited<T>> {
  // 遍历对象value值成扁平数组
  const newParams = JSON.parse(JSON.stringify(params));
  const arr: string[] = [];

  recursiveObj(
    newParams,
    (obj, key) => {
      const curNodeType = Object.prototype.toString.call(obj[key]);
      // 这里每次判断可能有性能问题
      if (!isFile(obj) && curNodeType !== '[object Object]' && curNodeType !== '[object Array]') {
        arr.push(obj[key]);
      }
    },
    [],
  );
  // 数组转换成字符串，翻译，再转换成数组
  const str = arr.join('\n');
  // @ts-ignore 这里设置默认值，options有值就覆盖
  // utils.node.logger.error(str);
  const newStr = await translate(str, { separator: '-', translatorType: 'youdao', ...options });
  const newArr = newStr.split('\n');
  // 新数组重新赋值给对象
  let index = 0;
  recursiveObj(
    newParams,
    (obj, key) => {
      const curNodeType = Object.prototype.toString.call(obj[key]);
      if (!isFile(obj) && curNodeType !== '[object Object]' && curNodeType !== '[object Array]') {
        obj[key] = newArr[index];
        index += 1;
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
  content: string | FileNode[] | generalObj;
}
function traverseDocument(dir: string, hook: Hook | undefined, level = 1): FileNode[] {
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
          content: traverseDocument(itemPath, hook, level + 1),
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
          let file: string | generalObj = fs.readFileSync(itemPath, 'utf8');
          if (hook?.convertContent) {
            file = hook?.convertContent.input(file, level);
          }
          return {
            name: item,
            type: 'file',
            path: itemPath,
            content: file,
          };
        } catch (error) {
          // 正常来说不可能进到这里
          return { name: item, type: undefined, path: itemPath, content: '既不是文件也不是目录' };
        }
      }
    })
    .filter((item) => item.type !== 'ignore');
}
function traverseWriteFile(array: FileNode[], hook: Hook | undefined, level = 1) {
  array.forEach((element) => {
    if (element.type === 'dir') {
      traverseWriteFile(element.content as FileNode[], hook, level + 1);
    }
    if (element.type === 'file') {
      let newContent = element.content;
      if (hook?.convertContent) {
        newContent = hook?.convertContent.out(element.content as generalObj, level);
      }
      if (typeof newContent !== 'string') {
        throw new Error('类型异常');
      }
      writeFile(element.path, newContent);
    }
    if (element.type === undefined) {
      utils.node.logger.error('输出文件出现类型错误！');
    }
  });
}
const hookDir: Hook = {
  convertContent: {
    input: (params: string, level: number) => (level !== 1 ? getObj(params) : params),
    out: (params: object | string, level: number) =>
      level !== 1 && typeof params === 'object' ? formatting(params) : (params as string),
  },
  handleData: async (arr, options) => {
    const {
      outDir,
      keep = true,
      type = 'dir',
      language = { from: 'zh-CN', to: ['en-US'] },
      hook,
      ...rest
    } = options;
    const baseDir = arr.find((item) => item.name === language.from && item.type === 'dir');
    const baseFile = arr.find(
      (item) => new RegExp(language.from).test(item.name) && item.type === 'file',
    );
    if (!baseDir) {
      utils.node.logger.error('基础目录为空');
      throw new Error('基础目录为空');
    }
    if (!baseFile) {
      utils.node.logger.error('基础文件为空');
      throw new Error('基础文件为空');
    }
    const suffix = path.extname(baseFile.name);
    const newBaseFile = language.to.map((item) => ({
      name: `${item}${suffix}`,
      type: 'file',
      path: `${outDir}/${item}${suffix}`,
      content: (baseFile.content as string).replaceAll(language.from, item),
    }));
    const allRequst = language.to.map((item) =>
      replaceValue(baseDir?.content as FileNode[], {
        language: {
          from: language.from,
          to: item,
        },
        ...rest,
      }),
    );
    const resData = await Promise.all(allRequst);
    const transData = language.to.map(
      (item, index): FileNode => ({
        name: item,
        type: 'dir',
        path: `${outDir}/${item}`,
        content: resData[index].map(
          (items): FileNode => ({
            ...items,
            path: `${outDir}/${item}/${items.name}`,
          }),
        ),
      }),
    );
    let lastData;
    if (keep) {
      lastData = contrastDir(arr, transData);
    } else {
      lastData = transData;
    }
    return [...lastData, ...newBaseFile] as FileNode[];
  },
};
const hookFile: Hook = {
  convertContent: {
    input: (params: string) => getObj(params),
    out: (params) => formatting(params as object),
  },
  handleData: async (arr, options) => {
    const {
      outDir,
      keep = true,
      type = 'dir',
      language = { from: 'zh-CN', to: ['en-US'] },
      hook,
      ...rest
    } = options;
    const baseFile = arr.find(
      (item) => new RegExp(language.from).test(item.name) && item.type === 'file',
    );
    if (!baseFile) {
      utils.node.logger.error('基础文件为空');
      throw new Error('基础文件为空');
    }
    const suffix = path.extname(baseFile.name);
    const allRequst = language.to.map((item) =>
      replaceValue(baseFile?.content as FileNode[], {
        language: {
          from: language.from,
          to: item,
        },
        ...rest,
      }),
    );
    const resData = await Promise.all(allRequst);
    const transData = language.to.map(
      (item, index): FileNode => ({
        name: `${item}${suffix}`,
        type: 'file',
        path: `${outDir}/${item}${suffix}`,
        content: resData[index],
      }),
    );
    let lastData;
    if (keep) {
      lastData = contrastFile(arr, transData);
    } else {
      lastData = transData;
    }

    return [...lastData] as FileNode[];
  },
};

interface Hook {
  // 开始阶段钩子
  // 基于文件或者目录名字忽略掉,返回false就忽略掉
  filter?: (name: string) => boolean;
  convertContent?: {
    input: (params: string, level: number) => generalObj;
    out: (params: object | string, level: number) => string;
  };
  // 数据梳理阶段钩子
  handleData?: (arr: FileNode[], options: TranslateConfig) => Promise<FileNode[]>;
}

export async function main(options: TranslateConfig) {
  const { outDir, type = 'dir', hook } = options;
  let newHook = hook;
  if (type === 'dir') {
    newHook = hookDir;
  }
  if (type === 'file') {
    newHook = hookFile;
  }
  let documentArr;
  utils.node.logger.info('开始阶段');
  documentArr = traverseDocument(outDir, newHook);
  utils.node.logger.info('数据处理阶段');
  let newDocumentArr = documentArr;
  if (newHook?.handleData) {
    newDocumentArr = await newHook.handleData(newDocumentArr, options);
  }
  utils.node.logger.info('输出文件阶段');
  traverseWriteFile(newDocumentArr, newHook);
}

export default async (options: TranslateConfig) => {
  try {
    await main(options);
  } catch (error) {
    utils.node.logger.error(error);
    throw new Error(String(error));
  }
};
