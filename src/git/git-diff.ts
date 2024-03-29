import { join } from 'path';
import { fsExtra } from '@txpjs/utils-node';

const child = require('child_process');

export default () => {
  const str = 'git diff master --stat-width=2000 --stat-graph-width=1';
  child.exec(str, (_: any, sto: any) => {
    const paths = join(process.cwd(), '/autoFile/diffLog.txt');
    fsExtra.outputFileSync(paths, sto, 'utf-8');
  });
};
