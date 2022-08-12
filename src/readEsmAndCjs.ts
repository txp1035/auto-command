import { extname } from 'path';
import { addHook } from 'pirates';
import esbuild from 'esbuild';

let registered = false;

let revert: () => void = () => {};

function transform(opts: { code: string; filename: string; implementor: any }) {
  const { code, filename, implementor } = opts;
  const ext = extname(filename);
  return implementor.transformSync(code, {
    loader: ext.slice(1),
    target: 'es2019',
    format: 'cjs',
  }).code;
}

export function start() {
  if (!registered) {
    // 添加劫持
    revert = addHook((code, filename) => transform({ code, filename, implementor: esbuild }), {
      ext: ['.ts', '.js'],
      ignoreNodeModules: true,
    });
    registered = true;
  }
}

export function end() {
  revert();
  registered = false;
}
