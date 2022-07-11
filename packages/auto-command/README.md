# auto-command

An efficiency tool to reduce copy and paste operations

## Function

- Support both command line interface and command usage
- Automatic translation
  - Supports automatic generation of ant-design/pro-components (single file layer) internationalization files
  - Supports automatic generation of ant-design/ant-design-pro (directory level) internationalization files
  - Supports automatic generation of internationalization files for React Intl projects
- Branch diff comparison and export diff file | git diff

## automatic translation

### Instructions

You have to configure the .autocmd.ts file

```js
import { defineConfig } from 'auto-command';

export default defineConfig({
  translate: {
    // Separator (optional): The default is -, if your file name is not separated by -, you need to configure
    separator: '-',
    // Whether to keep the previous translation unchanged (optional), off by default
    keep: false,
    // type (optional): defaults to directory
    type: 'dir',
    // path (required): absolute path to the locales file
    outDir: '/xxx/xxx/xxx/src/locales',
    // Language conversion (optional): default from Chinese to English
    language: {
      from: 'zh-CN',
      to: ['en-US'],
    },
  },
});
```

```bash
$ npm i auto-command
$ npx ac
**** Please select the task to be performed **** (Use arrow keys)
  git diff
❯ translate
or
$ npx ac -t=translate
```

### achievement

- 500 pieces of data translation in 4 seconds
- 54 languages supported
- Support configuration file prompts
- Support for supplementary translations on already translated projects
- Support custom delimiter

## Branch diff comparison and export diff file

### Instructions

```bash
$ npm i auto-command
$ npx ac
**** Please select the task to be performed **** (Use arrow keys)
❯ git diff
  translate
or
$ npx ac -t=diff
```

In this way, you can compare two branches (by default, the current branch is compared with the master branch) and export the comparison result file
