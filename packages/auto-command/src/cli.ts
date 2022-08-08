import { join, isAbsolute } from 'path';
import { existsSync } from 'fs';
import yParser from 'yargs-parser';
import utils from 'txp-utils';
import gitDiff from './gitDiff';
import translate from './translate';
import fastElectron from './fastElectron';
import * as readEsmAndCjs from './readEsmAndCjs';
import type { ConfigType } from './defineConfig';

const inquirer = require('inquirer');

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

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
    type: ['t'],
  },
  boolean: ['version'],
});

async function inquirerScript() {
  const type = await inquirer.prompt([
    {
      type: 'list',
      message: 'Please select the task to be performed',
      name: 'auto',
      default: 'git diff',
      prefix: '****',
      suffix: ' ****',
      choices: ['git diff', 'translate', 'fastElectron'],
    },
  ]);
  if (type.auto === 'git diff') {
    gitDiff();
  }
  if (type.auto === 'fastElectron') {
    const fastElectronType = await inquirer.prompt([
      {
        type: 'list',
        message: 'Please select the task to be performed',
        name: 'auto',
        default: 'git diff',
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
    const obj = {
      ...getParams().translate,
    };
    obj.outDir = handelPath(obj.outDir);
    if (existsSync(obj.outDir)) {
      translate(obj);
    } else {
      utils.node.logger.error(`找不到输出的路径：${obj.outDir}`);
    }
  }
}

if (args.version && !args._[0]) {
  args._[0] = 'version';
  const { name, version } = require('../package.json');
  console.log(`${name}@${version}`);
} else if (args.type && !args._[0]) {
  if (args.type === 'translate') {
    translate(getParams().translate);
  }
  if (args.type === 'diff') {
    gitDiff();
  }
  if (args.type === 'fastElectron') {
    fastElectron(getParams().fastElectron);
  }
} else {
  inquirerScript();
}
