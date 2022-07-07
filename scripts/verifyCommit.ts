import 'zx/globals';

const msgPath = process.argv[2];
if (!msgPath) process.exit();
/*
# 主要type
feat:     增加新功能
fix:      修复bug

# 特殊type
docs:     只改动了文档相关的内容
style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build:    构造工具的或者外部依赖的改动，例如webpack，npm
refactor: 代码重构时使用
revert:   执行git revert打印的message

# 其他type
test:     添加测试或者修改现有测试
perf:     提高性能的改动
ci:       与CI（持续集成服务）有关的改动
chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
# 待使用再配置
workflow
types
wip
release
dep
example
Merge
*/
const msg = removeComment(fs.readFileSync(msgPath, 'utf-8').trim());
const commitRE =
  /^(revert: )?(feat|fix|docs|style|build|refactor|test|perf|ci|chore)(\(.+\))?: .{1,50}/;
const zh_CN = /[\u4e00-\u9fa5]/;
if (!commitRE.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`,
      ) +
      `    ${chalk.green(`feat(bundler-webpack): add 'comments' option`)}\n` +
      `    ${chalk.green(`fix(core): handle events on blur (close #28)`)}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`),
  );
  process.exit(1);
}
if (zh_CN.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`The message cannot be in Chinese.`)}\n\n` +
      chalk.green(`  I hope I can learn English well\n\n`),
  );
  process.exit(1);
}
function removeComment(msg: string) {
  return msg.replace(/^#.*[\n\r]*/gm, '');
}
