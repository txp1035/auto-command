# txp

<!-- [![Build Status](https://www.travis-ci.org/ShawDanon/txp.svg?branch=master)](https://www.travis-ci.org/ShawDanon/txp) -->

[![TravisCI Build Status][travis-badge]][travis-badge-url] [![Latest NPM release][npm-badge]][npm-badge-url]

[npm-badge]: https://img.shields.io/npm/v/txp-utils.svg
[npm-badge-url]: https://www.npmjs.com/package/txp-utils
[travis-badge]: https://img.shields.io/travis/ShawDanon/txp/master.svg
[travis-badge-url]: https://travis-ci.org/ShawDanon/txp

my accumulation

## 使用说明

### 一些常用命令

npm run init ：初始化装包 npm run bootstrap 包名：进入单独目录运行这个装包

npm run build： 打包

npm link：进入单个包目录执行，在全局注册这个包。每次打包后需要再次执行进行更新（相当于执行 npm i -g，使用 npm ls -g --depth=0 可以查看）

npx 对应命令：执行相关命令

lerna add <模块名>：所有子包都添加这个依赖

lerna add <模块名> --scope = <包名>：给 scope 后的包添加依赖

lerna add <包名 1> --scope = <包名 2>：给包名 2 中添加包名 1，包内的互相引用，会复制 p 包名 1 到 p 包名 2 中

## 方案

获取参数方式优先级：手动命令行 > 自己的配置文件 > package 文件配置
