import Mustache from 'mustache';
import fs from 'fs-extra';
import { join } from 'path';
import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import mainjs from './template/mainjs';
import npmrc from './template/npmrc';
export interface FastElectronConfig {
  type?: 'ant-design-pro' | 'create-react-app' | 'vue';
}

function writeFile(paths: string, text: string) {
  try {
    fs.outputFileSync(paths, text);
  } catch (err) {
    console.error(err);
  }
}

function getPkgStr(path: string) {
  const obj = JSON.parse(fs.readFileSync(path, 'utf-8'));
  obj.scripts = {
    ...obj.scripts,
    'ele:devAll': 'concurrently "wait-on http://localhost:8000 && npm run ele:dev" "npm start"',
    'ele:dev': 'cross-env NODE_ENV=development electron .',
    'ele:build': 'cross-env REACT_APP_ENV=pro electron-builder  --mac',
    build: 'cross-env REACT_APP_ENV=pro max build',
  };
  obj.main = 'main.js';
  obj.build = {
    files: ['dist/**/*', 'main.js'],
    directories: {
      buildResources: 'public',
      output: 'release/build',
    },
  };
  obj.devDependencies = {
    ...obj.devDependencies,
    concurrently: '^7.3.0',
    electron: '^19.0.9',
    'electron-builder': '^23.1.0',
    'wait-on': '^6.0.1',
  };
  return JSON.stringify(obj);
}

function getUmiConfigStr(path: string) {
  const str = fs.readFileSync(path, 'utf-8');
  // ast处理成需要的对象
  const { ast }: any = babel.transform(str, { ast: true });
  // 保证对象的key是字符串才能json化成功
  traverse(ast, {
    enter(paths: any) {
      if (paths.node.type === 'ObjectProperty' && paths.node.key.name === 'hash') {
        paths.insertBefore(
          t.objectProperty(
            t.identifier('publicPath'),
            t.conditionalExpression(
              t.binaryExpression('===', t.identifier('REACT_APP_ENV'), t.stringLiteral('pro')),
              t.stringLiteral('./'),
              t.stringLiteral('/'),
            ),
          ),
        );
        paths.insertBefore(
          t.objectProperty(
            t.identifier('history'),
            t.objectExpression([t.objectProperty(t.identifier('type'), t.stringLiteral('hash'))]),
          ),
        );
      }
    },
  });
  // 生成可序列号的字符串
  const ret = generate(ast, { jsescOption: { minimal: true } }).code;
  return ret;
}

const main = ({ type = 'ant-design-pro' }: FastElectronConfig) => {
  const rootPath = join(process.cwd(), 'test');
  // main.js字符串生成
  const mainjsStr = Mustache.render(mainjs, {});
  writeFile(join(rootPath, 'main.js'), mainjsStr);
  // .npmrc字符串生成
  const npmrcStr = Mustache.render(npmrc, {});
  writeFile(join(rootPath, '.npmrc'), npmrcStr);
  // package.json修改后生成字符串
  const pkgPath = join(rootPath, 'package.json');
  let pkgStr;
  try {
    pkgStr = getPkgStr(pkgPath);
  } catch (error) {
    throw new Error('获取pkg错误');
  }
  writeFile(pkgPath, pkgStr);
  // umi配置文件修改后生成字符串
  if (type === 'ant-design-pro') {
    const umiConfigPath = join(rootPath, 'config/config.ts');
    const umiConfigStr = getUmiConfigStr(umiConfigPath);
    writeFile(join(rootPath, 'config/config1.ts'), umiConfigStr);
  }
};
main({ type: 'ant-design-pro' });

export default main;
