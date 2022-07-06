# auto-cmd

自动化命令

## 作用

处理常用操作

## 功能

执行 ac 命令，出现功能列表

### 分支自动对比功能

能够把两个分支进行对比，默认把当前分支和 master 分支做对比

### 国际化自动翻译

自动翻译工具功能

1. 支持一对多语种翻译
2. 自定义输出目录
3. 支持已有翻译不进行修改
4. 支持在已有翻译不修改情况下，只修改部分

约定

1. type: dir ,file（支持 locales 里面的文件是目录或者文件）,文件名是 ts
2. type: file ,确保 dir 里面有对应语言的文件或者目录文件（名字得和 from 匹配）

需要在执行命令的目录增加配置文件`.autocmd.js`，配置内容如下：

```js
exports.default = {
  translate: {
    // 文件的分隔符号，默认是'-'，如果你的文件命名不是这样请加上这个选项，例如你的文件是en_US.tsx，separator应该是_
    separator: '-',
    // 可以是文件也可以是文件夹，但是必须符合规范的文件
    type: 'dir',
    // locales文件路径
    dir: '/Users/shawdanon/GitHub/mine/aTimeLogger-visualization/src/locales',
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
