import { join } from 'path';
import { existsSync } from 'fs';
import gitDiff from './gitDiff';
import translate from './translate';

const inquirer = require('inquirer');

function getParams() {
  let config = {
    translate: {
      outDir: '',
      language: { from: 'zh-CN', to: ['en-US'] },
      separator: '-',
      type: 'dir',
      dir: '',
    },
  };
  const path = join(process.cwd(), '.autocmd.js');
  if (existsSync(path)) {
    try {
      // eslint-disable-next-line  global-require,import/no-dynamic-require
      config = require(path).default;
    } catch (error) {
      throw new Error(String(error));
    }
  }
  return config;
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
inquirer
  .prompt([
    {
      type: 'list',
      message: '请选择需要执行的任务',
      name: 'auto',
      default: '分支自动对比',
      prefix: '****',
      suffix: ' ****',
      choices: ['分支自动对比', '自动翻译'],
    },
  ])

  .then((answer: any) => {
    if (answer.auto === '分支自动对比') {
      gitDiff();
    }
    if (answer.auto === '自动翻译') {
      translate(getParams().translate);
    }
  });
