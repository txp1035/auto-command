import { defineConfig } from '@/packages/auto-command/src';
import translate from '@/packages/auto-command/src/translate';

const config1 = defineConfig({
  translate: {
    translatorType: 'youdao',
    // 分隔符号（可选）：默认为-，如果你的文件名不是以-分割的话需要配置
    separator: '-',
    // 是否保持以前的翻译不变（可选），默认关闭
    keep: false,
    // 类型（可选）：默认为目录
    type: 'dir',
    // 路径（必填）：locales文件的绝对路径
    outDir: '/Users/shawdanon/GitHub/mine/txp/example/auto-command/localesDir',
    // 语言转换（可选）：默认从中文转英文
    language: {
      from: 'zh-CN',
      to: ['en-US'],
    },
  },
});
const config2 = defineConfig({
  translate: {
    translatorType: 'youdao',
    language: {
      from: 'zh-CN',
      to: ['zh-TW'],
    },
    type: 'file',
    outDir: '/Users/shawdanon/GitHub/mine/txp/example/auto-command/localesFile',
  },
});
// 测试目录情况
translate(config1.translate);
// 测试文件情况
// translate(config2.translate);
