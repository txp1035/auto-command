import { outputFileSync } from 'fs-extra';
import { join } from 'path';

const child = require('child_process');

export default () => {
  const str = 'git diff master --stat-width=2000 --stat-graph-width=1';
  child.exec(str, (err, sto) => {
    const paths = join(process.cwd(), '/auto/diff.txt');
    outputFileSync(paths, sto, 'utf-8');
  });
};
