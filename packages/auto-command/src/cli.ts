import { join } from 'path';
import { existsSync } from 'fs';
import yParser from 'yargs-parser';
import gitDiff from './gitDiff';
import translate from './translate';
import * as readEsmAndCjs from './readEsmAndCjs';
import { ConfigType } from './defineConfig';

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

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
    type: ['t'],
  },
  boolean: ['version'],
});

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
} else {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Please select the task to be performed',
        name: 'auto',
        default: 'git diff',
        prefix: '****',
        suffix: ' ****',
        choices: ['git diff', 'translate'],
      },
    ])
    .then((answer: any) => {
      if (answer.auto === 'git diff') {
        gitDiff();
      }
      if (answer.auto === 'translate') {
        translate(getParams().translate);
      }
    });
}
