# auto-command

一个提效工具，目的是减少复制和粘贴操作

## 功能

- 支持命令行界面和命令两种使用方式
- 自动翻译
  - 支持 ant-design/pro-components（单文件层）国际化文件自动生成
  - 支持 ant-design/ant-design-pro（目录层）国际化文件自动生成
  - 支持 React Intl 项目国际化文件自动生成
- 分支差异比较并导出差异文件 | git diff

## 自动翻译

### 使用方法

你必须配置 .autocmd.ts 文件

```js
import { defineConfig } from 'auto-command/lib';

export default defineConfig({
  translate: {
    // 路径（必填）：locales文件的绝对路径
    outDir: '/xxx/xxx/xxx/src/locales',
    // 是否保持以前的翻译不变（可选），默认开启
    keep: true,
    // 类型（可选）：默认为目录（antd-pro模式）
    type: 'dir',
    // 钩子函数（可选）：自定义输出
    hook: {
      filter: () => {},
      convertContent: { input: () => {}, out: () => {} },
      handleData: () => {},
    },
    // 语言转换（可选）：默认从中文转英文,输出的文件名和这个配置有关
    language: {
      from: 'zh-CN',
      to: ['en-US'],
    },
    // 分隔符号（可选）：默认为-，如果你的文件名不是以-分割的话需要配置
    separator: '-',
    // 翻译器类型（可选）：默认youdao
    translatorType: 'youdao',
    // google翻译器配置（可选）：默认空
    google: {
      proxy: {
        host: '127.0.0.1',
        port: 7890,
      },
    },
    // youdao翻译器配置（可选）：默认有值，如果翻译失败可能余额不足，请配置
    youdao: {
      key: 'xxx',
      secret: 'xxx',
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

### 成果

- 500 条数据翻译只需要 4 秒
- 支持 54 种语言
- 支持配置文件提示
- 支持已经在已经翻译过的项目上进行补充翻译
- 支持自定义分隔符
- 支持多类型翻译器：谷歌翻译（国外建议）、有道翻译（国内建议）

## 分支差异比较并导出差异文件

### 使用方法

```bash
$ npm i auto-command
$ npx ac
**** Please select the task to be performed **** (Use arrow keys)
❯ git diff
  translate
or
$ npx ac -t=diff
```

这样你就能够对两个分支（默认把当前分支和 master 分支做对比）进行对比并导出对比结果文件
