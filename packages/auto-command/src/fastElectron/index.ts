import { Mustache, fsExtra } from '@txpjs/utils-node';
import { join } from 'path';
import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import prettier from 'prettier';
import mainjs from './template/mainjs';
import npmrc from './template/npmrc';
export interface FastElectronConfig {
  type?: 'ant-design-pro' | 'create-react-app' | 'vue';
}

function writeFile(paths: string, text: string) {
  try {
    fsExtra.outputFileSync(paths, text);
  } catch (err) {
    console.error(err);
  }
}
interface Config {
  type: string;
  local: string;
  buildName: string;
  devScript: string;
}

function getPkgStr(path: string, config: Config) {
  const obj = JSON.parse(fsExtra.readFileSync(path, 'utf-8'));
  obj.scripts = {
    ...obj.scripts,
    'ele:devAll': `concurrently "wait-on ${config.local} && npm run ele:dev" "${config.devScript}"`,
    'ele:dev': 'cross-env REACT_APP_ENV=dev electron .',
    'ele:buildAll': 'npm run build && npm run ele:build',
    'ele:build': 'cross-env REACT_APP_ENV=pro electron-builder --win --mac',
  };
  obj.main = 'main.js';
  obj.build = {
    files: [`${config.buildName}/**/*`, 'main.js'],
    directories: {
      output: 'release/build',
    },
  };
  obj.devDependencies = {
    ...obj.devDependencies,
    concurrently: '^7.3.0',
    electron: '^19.0.9',
    'electron-builder': '^23.1.0',
    'wait-on': '^6.0.1',
    'cross-env': '^7.0.0',
  };
  // 特殊处理
  if (config.type === 'ant-design-pro') {
    obj.scripts.build = 'cross-env REACT_APP_ENV=pro max build';
  }
  if (config.type === 'create-react-app') {
    obj.homepage = '.';
    obj.build.extends = null;
  }
  return JSON.stringify(obj);
}
function getUmiConfigStr(path: string) {
  const str = fsExtra.readFileSync(path, 'utf-8');
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
              t.binaryExpression(
                '===',
                t.memberExpression(
                  t.memberExpression(t.identifier('process'), t.identifier('env')),
                  t.identifier('REACT_APP_ENV'),
                ),
                t.stringLiteral('pro'),
              ),
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
function getVueConfigStr(path: string) {
  const str = fsExtra.readFileSync(path, 'utf-8');
  // ast处理成需要的对象
  const { ast }: any = babel.transform(str, { ast: true, configFile: false });
  // 保证对象的key是字符串才能json化成功
  traverse(ast, {
    enter(paths: any) {
      if (paths.node.type === 'ObjectProperty' && paths.node.key.name === 'transpileDependencies') {
        paths.insertBefore(t.objectProperty(t.identifier('publicPath'), t.stringLiteral('./')));
      }
    },
  });
  // 生成可序列号的字符串
  const ret = generate(ast, { jsescOption: { minimal: true } }).code;
  return ret;
}

function formatting(text: string, options?: object): string {
  const obj = options || { parser: 'json' };
  const newText = prettier.format(text, obj);
  return newText;
}

const main = ({ type = 'ant-design-pro' }: FastElectronConfig) => {
  const config = {
    'ant-design-pro': {
      type: 'ant-design-pro',
      local: 'http://localhost:8000',
      buildName: 'dist',
      devScript: 'npm start',
    },
    'create-react-app': {
      type: 'create-react-app',
      local: 'http://localhost:3000',
      buildName: 'build',
      devScript: 'npm start',
    },
    vue: {
      type: 'vue',
      local: 'http://localhost:8080',
      buildName: 'dist',
      devScript: 'npm run serve',
    },
  };
  const currentConfig = config[type];
  const rootPath = process.cwd();
  // main.js字符串生成
  const mainjsStr = Mustache.render(mainjs, { ...currentConfig });
  writeFile(join(rootPath, 'main.js'), mainjsStr);
  // .npmrc字符串生成
  const npmrcStr = Mustache.render(npmrc, {});
  writeFile(join(rootPath, '.npmrc'), npmrcStr);
  // package.json修改后生成字符串
  const pkgPath = join(rootPath, 'package.json');
  let pkgStr;
  try {
    pkgStr = formatting(getPkgStr(pkgPath, currentConfig), { parser: 'json' });
  } catch (error) {
    throw new Error('获取pkg错误');
  }
  writeFile(pkgPath, pkgStr);
  // umi配置文件修改后生成字符串
  if (type === 'ant-design-pro') {
    const umiConfigPath = join(rootPath, 'config/config.ts');
    const umiConfigStr = getUmiConfigStr(umiConfigPath);
    writeFile(umiConfigPath, umiConfigStr);
  }
  if (type === 'vue') {
    const vueConfigPath = join(rootPath, 'vue.config.js');
    const vueConfigStr = getVueConfigStr(vueConfigPath);
    writeFile(vueConfigPath, vueConfigStr);
  }
};

export default main;
