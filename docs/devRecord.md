# 开发记录

## 包说明

- [积极维护]auto-command
- [保持不变]crons
- [保持不变]fine-dog
- [废弃不用]@shawdanon/first
- [废弃不用]pnrm
- [暂时不用]txp-data-hub
- [废弃不用]txp-first
- [积极维护]txp-utils
- [暂时不用]txp
- [暂时不用]umi-plugin-codegen

## 使用说明

### 一些常用命令

pnpm i : 安装依赖

npm run sort: 给所有包排序

npm run build： 打包

npm run publish： 打包并发布

npm run prettier： 格式化所有文件

npm link：进入单个包目录执行，在全局注册这个包。每次打包后需要再次执行进行更新（相当于执行 npm i -g，使用 npm ls -g --depth=0 可以查看）

npm unlink <包名> -g：删除全局连接，包名不用加版本号

npx 对应命令：执行相关命令

pnpm add <包名> -w ：在全局安装包,-D 安装开发依赖

pnpm add <包名 1> -F <包名 2> ：给包名 2 安装包名 1,-D 安装开发依赖

lerna changed：查看有哪儿些包改变了

lerna diff <包名>：查看某个包改了什么

lerna create <包名>：添加子包

## 方案

获取参数方式优先级：手动命令行 > 自己的配置文件 > package 文件配置

## 贡献说明

1. 运行 pnpm i 装包
2. 运行 npm run publish 进行发布
3. 发布失败通过 lerna publish from-git 重新发布，这个要保证上一个提交是 learn 生成的才可以
4. npm 登录通过 npm login，用户名和密码和网页上登录的一样，邮箱随意。确认后需要再输入验证码
