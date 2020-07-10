const child = require('child_process');

export default () => {
  child.exec('git symbolic-ref --short -q HEAD', (err, sto) => {
    child.exec(`git diff master ${sto} --stat-width=2000 --stat-graph-width=1`, (errs, stos) => {
      console.log('进来');
      console.log(stos);
    });
  });
};
