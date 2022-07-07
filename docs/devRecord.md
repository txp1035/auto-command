# 开发记录

## 包说明

## 使用说明

### 一些常用命令

npm run init ：初始化装包

npm run bootstrap 包名：进入单独目录运行这个装包

npm run build： 打包

npm link：进入单个包目录执行，在全局注册这个包。每次打包后需要再次执行进行更新（相当于执行 npm i -g，使用 npm ls -g --depth=0 可以查看）

npm unlink <包名> -g：删除全局连接，包名不用加版本号

npm rm ｜ uninstall --global packageName：卸载软连接

npx 对应命令：执行相关命令

lerna add <模块名>：所有子包都添加这个依赖

lerna add <模块名> --scope = <包名>：给 scope 后的包添加依赖

lerna add <包名 1> --scope = <包名 2>：给包名 2 中添加包名 1，包内的互相引用，会复制 p 包名 1 到 p 包名 2 中 lerna create <包名>：新增子包

## 方案

获取参数方式优先级：手动命令行 > 自己的配置文件 > package 文件配置

## 贡献说明

1. 运行 npm run init 初始化项目（装包）
2. 发版前 nrm 检查源是否是 npm
3. 运行 npm run publish 进行发布
4. 发布失败通过 lerna publish from-git 重新发布，这个要保证上一个提交是 learn 生成的才可以
5. npm 登录通过 npm login，用户名和密码和网页上登录的一样，邮箱随意。确认后需要再输入验证码
