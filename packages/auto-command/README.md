# auto-cmd

自动化命令

## 作用

处理常用操作

## 功能

执行 ac 命令，出现功能列表

### 分支自动对比功能

能够把两个分支进行对比，默认把当前分支和 master 分支做对比

### 国际化自动翻译

需要在执行命令的目录增加配置文件`.autocmd.js`，配置内容如下：

```js
exports.default = {
  translate: {
    // locales文件路径
    outDir: '/Users/shawdanon/GitHub/mine/aTimeLogger-visualization/src/locales',
    language: {
      // 来源，需要保证locales里面zh-CN.ts文件和zh-CN文件夹，
      from: 'zh-CN',
      to: [
        'ca-ES', //葡萄牙语
        'en-GB', //英语
        'en-US', //英语
        'es-ES', //西班牙语
        'fr-BE', //法语
        'fr-FR', //法语
        'ja-JP', //日本语
        'ko-KR', //韩语
        'pt-BR', //葡萄牙语
        'pt-PT', //葡萄牙语
        'vi-VN', //越南语
      ],
    },
  },
};
```

TODO

- 选择分支自动对比，填写比较分支名称，填写被比较分支。
