import gitDiff from './gitDiff';

const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'list',
      message: '请选择需要执行的任务',
      name: 'auto',
      default: '分支自动对比',
      prefix: '****',
      suffix: ' ****',
      choices: ['分支自动对比', '待开发', '待开发'],
    },
  ])
  .then((answer) => {
    if (answer.auto === '分支自动对比') {
      gitDiff();
    }
  });
