import type { Opts } from './index';
import { inquirer } from '@txpjs/utils-node';
import { gitDiff, deleteBranch, clone } from '../git';

type GitType = 'deleteBranch' | 'clone' | 'diff';
// interface Args {
//   _: string[];
//   a: string;
// }

export default async (opts: Opts, args: any) => {
  let type: GitType = 'deleteBranch';
  if (opts.type === 'cmd') {
    console.log(args);
    // type = args.gitType;
  }
  if (opts.type === 'interface') {
    type = (
      await inquirer.prompt([
        {
          type: 'list',
          message: 'Please select the task to be performed',
          name: 'git',
          default: 'deleteBranch',
          prefix: '****',
          suffix: ' ****',
          choices: ['deleteBranch', 'clone', 'diff'],
        },
      ])
    ).git;
  }
  if (type === 'clone') {
    const url = (
      await inquirer.prompt([
        {
          type: 'input',
          message: '请输入需要clone的连接',
          name: 'url',
        },
      ])
    ).url;
    clone(url);
  }
  if (type === 'deleteBranch') {
    deleteBranch();
  }
  if (type === 'diff') {
    gitDiff();
  }
};
