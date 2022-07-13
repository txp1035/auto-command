import { defineConfig } from 'umi';
import translate from '../../packages/auto-command/src/translate/index';

const config = defineConfig({
  translate: {
    // 分隔符号（可选）：默认为-，如果你的文件名不是以-分割的话需要配置
    separator: '-',
    // 是否保持以前的翻译不变（可选），默认关闭
    keep: false,
    // 类型（可选）：默认为目录
    type: 'dir',
    // 路径（必填）：locales文件的绝对路径
    outDir: '/Users/shawdanon/GitHub/minehttp/txp/example/auto-command/localesDir',
    // 语言转换（可选）：默认从中文转英文
    language: {
      from: 'zh-CN',
      to: ['en-US'],
    },
  },
});
// 主程序测试;
translate(config.translate);
