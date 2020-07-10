const child = require('child_process');
const shell = require('shelljs'); // 执行文件操作

const { spawn } = child;

export default () => {
  // console.log('123');
  shell.exec('git symbolic-ref --short -q HEAD', (err, sto) => {
    // console.log('123', sto);
    const str = `git diff master ${sto.replace(/\n/g, '')} --stat-width=2000 --stat-graph-width=1`;
    console.log('zf', str);
    shell.exec(str, (errs, stos) => {
      console.log('222', stos);
    });
  });

  // const a = shell.exec('git log');
  // console.log(a);
  // child.exec('git symbolic-ref --short -q HEAD', (err, sto) => {
  //   const diffStr = `git diff master ${sto}`;
  //   const diff = spawn(diffStr, ['-spa-stat-width=2000', '--stat-graph-width=1']);
  //   // 捕获标准输出并将其打印到控制台
  //   diff.stdout.on('data', data => {
  //     console.log('standard output:\n' + data);
  //   });
  //   // 捕获标准错误输出并将其打印到控制台
  //   diff.stderr.on('data', data => {
  //     console.log('standard error output:\n' + data);
  //   });
  //   // 注册子进程关闭事件
  //   diff.on('exit', (code, signal) => {
  //     console.log('child process eixt ,exit:' + code);
  //   });
  // });
};
