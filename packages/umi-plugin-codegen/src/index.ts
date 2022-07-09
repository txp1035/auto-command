// @ts-ignore
import milady from 'milady';

export default function (api: any, opts = {}) {
  api.registerCommand('codegen', {}, () => {
    milady(opts);
  });
}
