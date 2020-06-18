# txp

## 作用

常用包集合的一个库，用于浏览器端开发业务。

## 功能

### 命令

1. 生成脚手架
2. 自动化

### api

#### 常用库

txp： 直接导出常用的 api

txp/antd：antd 库

txp/antd-mobile：antd 手机库

txp/react：react

txp/react-dom：react-dom

txp/util：txp-utils

txp/util/classnames：classnames（常用样式控制）

txp/util/debug：debug

txp/util/lodash：lodash（常用，深浅拷贝、防抖节流、range 生成数组模拟数据）

txp/util/moment：moment（常用，时间处理）

txp/util/query-string：query-string

txp/util/react-helmet：react-helmet

txp/util/request：request

#### 规范类

代码格式化（prettier）、样式文件检查（stylelint）、逻辑文件检查 js、ts（eslint）、提交规范

txp/prettier：prettier 配置

txp/stylelint：stylelint 配置

txp/eslint：eslint 配置

常用的文件规范化：.eslintignore、.gitignore、.commitlintrc、tsconfig.json、.editorconfig

### 实现分发

希望用 api 导入和原库一样使用
