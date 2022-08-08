import type { Opts } from './index';
import { inquirer } from '@txpjs/utils-node';
import { gitDiff, deleteBranch } from '../git';

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
    const res = await inquirer.prompt([
      {
        type: 'list',
        message: 'Please select the task to be performed',
        name: 'git',
        default: 'deleteBranch',
        prefix: '****',
        suffix: ' ****',
        choices: ['deleteBranch', 'clone', 'diff'],
      },
    ]);
    type = res.git;
  }
  if (type === 'clone') {
  }
  if (type === 'deleteBranch') {
    deleteBranch();
  }
  if (type === 'diff') {
    gitDiff();
  }
};
