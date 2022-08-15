import { join, isAbsolute } from 'path';
import { existsSync } from 'fs';
import { logger, yParser, inquirer } from '@txpjs/utils-node';
import { i18n } from '@txpjs/translate';
import fastElectron from '../fastElectron';
import * as readEsmAndCjs from '../readEsmAndCjs';
import type { ConfigType } from '../defineConfig';
import git from './git';

// type CmdType = 'git' | 'translate' | 'fastElectron';
type OperationType = 'cmd' | 'interface';

function getParams(): ConfigType {
  let config;
  const path = join(process.cwd(), '.autocmd.ts');
  if (existsSync(path)) {
    try {
      readEsmAndCjs.start();
      config = require(path).default;
      readEsmAndCjs.end();
    } catch (error) {
      throw new Error(String(error));
    }
  }
  return config || {};
}

export function handelPath(params: string) {
  if (isAbsolute(params)) {
    return params;
  }
  return join(process.cwd(), params);
}

function checkVersion() {
  const nodeVersion = process.versions.node;
  const versions = nodeVersion.split('.');
  const major = Number(versions[0]);
  const minor = Number(versions[1]);

  if (major * 10 + minor * 1 < 65) {
    // eslint-disable-next-line no-console
    console.log(`Node version must >= 6.5, but got ${major}.${minor}`);
    process.exit(1);
  }
}

checkVersion();

async function inquirerScript(opts: Opts, args: any) {
  const type = await inquirer.prompt([
    {
      type: 'list',
      message: 'Please select the task to be performed',
      name: 'auto',
      default: 'git',
      prefix: '****',
      suffix: ' ****',
      choices: ['git', 'translate', 'fastElectron'],
    },
  ]);
  if (type.auto === 'git') {
    git(opts, args);
  }
  if (type.auto === 'fastElectron') {
    const fastElectronType = await inquirer.prompt([
      {
        type: 'list',
        message: 'Please select the task to be performed',
        name: 'auto',
        default: 'ant-design-pro',
        prefix: '****',
        suffix: ' ****',
        choices: ['ant-design-pro', 'create-react-app', 'vue'],
      },
    ]);
    const obj = {
      ...getParams().fastElectron,
      type: fastElectronType.auto,
    };
    fastElectron(obj);
  }
  if (type.auto === 'translate') {
    const params = getParams()?.translate;
    if (params === undefined) {
      throw new Error('translate缺少参数');
    }
    const obj = {
      ...params,
    };
    obj.outDir = handelPath(obj.outDir);
    if (existsSync(obj.outDir)) {
      i18n(obj);
    } else {
      logger.error(`找不到输出的路径：${obj.outDir}`);
    }
  }
}
export interface Opts {
  cwd: string;
  type: OperationType;
}
const cwd = process.cwd();
const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
    type: ['t'],
  },
  boolean: ['version'],
});
async function main() {
  if (args.version && !args._[0]) {
    args._[0] = 'version';
    const { name, version } = require('../package.json');
    console.log(`${name}@${version}`);
  } else if (args.type && !args._[0]) {
    if (args.type === 'translate') {
      const params = getParams()?.translate;
      if (params === undefined) {
        throw new Error('translate缺少参数');
      }
      i18n(params);
    }
    if (args.type === 'git') {
      git({ cwd, type: 'cmd' }, args);
    }
    if (args.type === 'fastElectron') {
      fastElectron(getParams()?.fastElectron || {});
    }
  } else {
    inquirerScript({ cwd, type: 'interface' }, args);
  }
}
main();
