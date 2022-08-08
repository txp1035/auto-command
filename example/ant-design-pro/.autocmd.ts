import { defineConfig } from 'auto-command';

export default defineConfig({
  translate: {
    prettierPath: './.prettierrc.js',
    outDir: './src/locales',
    language: {
      from: 'zh-CN', //中文（简体）
      to: [
        // 14种
        'en-US', //英语
        'zh-TW', //中文（繁体）
        'ja-JP', //日语
        'de-DE', //德语
        'id-ID', //印度尼西亚语
        'fr-BE', //法语
        'pt-BR', //葡萄牙语
        'it-IT', //意大利语
        'ko-KR', //韩语
        'ru-RU', //俄语
        'es-ES', //西班牙语
        'tr-TR', //土耳其语
        'nl-BE', //荷兰语
        'ar-EG', //阿拉伯文语
      ],
    },
  },
});
