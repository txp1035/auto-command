import { crossSpawn } from '@txpjs/utils-node';

const EXCEPT = ['\\*', 'master', 'main'];

export default () => {
  const except = EXCEPT.map((item) => `| grep -v ${item}`).join(' ');
  crossSpawn.sync('git', ['branch', except, '| xargs git branch -d'], {
    stdio: 'inherit',
    shell: true,
  });
};
