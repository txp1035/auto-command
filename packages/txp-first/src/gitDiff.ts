import { outputFileSync } from 'fs-extra';
import { join } from 'path';

const child = require('child_process');

export default () => {
  child.exec('git symbolic-ref --short -q HEAD', (err, sto) => {
    const str = `git diff master ${sto.replace(/\n/g, '')} --stat-width=2000 --stat-graph-width=1`;
    child.exec(str, (errs, stos) => {
      const paths = join(process.cwd(), '/auto/diff.txt');
      outputFileSync(paths, stos, 'utf-8');
    });
  });
};
