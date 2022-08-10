import { defineConfig } from 'father';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  prebundle: {
    deps: [
      'chalk',
      'yargs-parser',
      'fs-extra',
      'lodash',
      'cross-spawn',
      'inquirer',
      'mustache',
      'axios',
    ],
  },
});
