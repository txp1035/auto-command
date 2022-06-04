const md5 = require('md5');
const axios = require('axios');

async function translate(word, options = {}) {
  const defaultLangUConfigMap = {
    'ar-EG': {
      label: 'العربية',
    },
    'az-AZ': {
      label: 'Azərbaycan dili',
    },
    'bg-BG': {
      label: 'Български език',
    },
    'bn-BD': {
      label: 'বাংলা',
    },
    'ca-ES': {
      label: '葡萄牙语',
      codeYd: 'pt',
    },
    'cs-CZ': {
      label: 'Čeština',
    },
    'da-DK': {
      label: 'Dansk',
    },
    'de-DE': {
      label: 'Deutsch',
    },
    'el-GR': {
      label: 'Ελληνικά',
    },
    'en-GB': {
      label: '英语',
      codeYd: 'en',
    },
    'en-US': {
      label: 'English',
      codeYd: 'en',
    },
    'es-ES': {
      label: '西班牙语',
      codeYd: 'es',
    },
    'et-EE': {
      label: 'Eesti',
    },
    'fa-IR': {
      label: 'فارسی',
    },
    'fi-FI': {
      label: 'Suomi',
    },
    'fr-BE': {
      label: '法语',
      codeYd: 'fr',
    },
    'fr-FR': {
      label: '法语',
      codeYd: 'fr',
    },
    'ga-IE': {
      label: 'Gaeilge',
    },
    'he-IL': {
      label: 'עברית',
    },
    'hi-IN': {
      label: 'हिन्दी, हिंदी',
    },
    'hr-HR': {
      label: 'Hrvatski jezik',
    },
    'hu-HU': {
      label: 'Magyar',
    },
    'hy-AM': {
      label: '阿拉伯语',
      codeYd: 'ar',
    },
    'id-ID': {
      label: 'Bahasa Indonesia',
    },
    'it-IT': {
      label: '意大利语',
      codeYd: 'it',
    },
    'is-IS': {
      label: 'Íslenska',
    },
    'ja-JP': {
      label: '日本语',
      codeYd: 'ja',
    },
    'ku-IQ': {
      label: 'کوردی',
    },
    'kn-IN': {
      label: 'ಕನ್ನಡ',
    },
    'ko-KR': {
      label: '韩语',
      codeYd: 'ko',
    },
    'lv-LV': {
      label: 'Latviešu valoda',
    },
    'mk-MK': {
      label: 'македонски јазик',
    },
    'mn-MN': {
      label: 'Монгол хэл',
    },
    'ms-MY': {
      label: 'بهاس ملايو‎',
    },
    'nb-NO': {
      label: 'Norsk',
    },
    'ne-NP': {
      label: 'नेपाली',
    },
    'nl-BE': {
      label: 'Vlaams',
    },
    'nl-NL': {
      label: 'Vlaams',
    },
    'pl-PL': {
      label: 'Polski',
    },
    'pt-BR': {
      label: '葡萄牙语',
      codeYd: 'pt',
    },
    'pt-PT': {
      label: '葡萄牙语',
      codeYd: 'pt',
    },
    'ro-RO': {
      label: 'Română',
    },
    'ru-RU': {
      label: 'Русский',
    },
    'sk-SK': {
      label: 'Slovenčina',
    },
    'sr-RS': {
      label: '俄语',
      codeYd: 'ru',
    },
    'sl-SI': {
      label: 'Slovenščina',
    },
    'sv-SE': {
      label: 'Svenska',
    },
    'ta-IN': {
      label: 'தமிழ்',
    },
    'th-TH': {
      label: '泰语',
      codeYd: 'th',
    },
    'tr-TR': {
      label: 'Türkçe',
    },
    'uk-UA': {
      label: 'Українська',
    },
    'vi-VN': {
      label: '越南语',
      codeYd: 'vi',
    },
    'zh-CN': {
      label: '简体中文',
      codeYd: 'zh-CHS',
    },
    'zh-TW': {
      label: '繁体中文',
    },
  };

  const {
    // 申请的key和secret
    Key = '5721fbb81d578037',
    Secret = 'Kzz4NP0B9rxjncsvyyLXZWz70AvxpGZB',
    baseUrl = 'http://openapi.youdao.com/api',
    // 参数
    from = 'zh-CHS',
    to = 'EN',
  } = options;
  // 随机数
  const salt = Math.random();
  // 生成签名
  const sign = md5(Key + word + salt + Secret);
  const params = {
    from: defaultLangUConfigMap[from].codeYd,
    to: defaultLangUConfigMap[to].codeYd,
    appKey: Key,
    salt,
    sign,
    q: word,
  };

  // 发送http GET请求
  const res = await axios.get(baseUrl, { params });
  const result = res?.data?.translation[0];
  return result;
}
module.exports = translate;
