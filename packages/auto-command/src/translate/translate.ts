import md5 from 'md5';
import axios from 'axios';
export type TLanguage =
  | 'zh-CN'
  | 'zh-TW'
  | 'en-GB'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'fr-BE'
  | 'fr-FR'
  | 'es-ES'
  | 'pt-BR'
  | 'pt-PT'
  | 'it-IT'
  | 'ru-RU'
  | 'vi-VN'
  | 'de-DE'
  | 'ar-EG'
  | 'id-ID'
  | 'bg-BG'
  | 'hr-HR'
  | 'cs-CZ'
  | 'da-DK'
  | 'nl-BE'
  | 'nl-NL'
  | 'et-EE'
  | 'fi-FI'
  | 'el-GR'
  | 'he-IL'
  | 'hi-IN'
  | 'hu-HU'
  | 'lv-LV'
  | 'ms-MY'
  | 'nb-NO'
  | 'fa-IR'
  | 'pl-PL'
  | 'ro-RO'
  | 'sr-RS'
  | 'sk-SK'
  | 'sl-SI'
  | 'sv-SE'
  | 'th-TH'
  | 'tr-TR'
  | 'uk-UA'
  | 'hy-AM'
  | 'az-AZ'
  | 'bn-BD'
  | 'ca-ES'
  | 'is-IS'
  | 'ga-IE'
  | 'kn-IN'
  | 'ku-IQ'
  | 'mk-MK'
  | 'mn-MN'
  | 'ne-NP'
  | 'ta-IN';
/*
 const umiSelectLang = {
   'ar-EG': {
     lang: 'ar-EG',
     label: 'العربية',
     icon: '🇪🇬',
     title: 'لغة',
     memo: '阿拉伯语',
   },
   'az-AZ': {
     lang: 'az-AZ',
     label: 'Azərbaycan dili',
     icon: '🇦🇿',
     title: 'Dil',
     memo: '阿塞拜疆语',
   },
   'bg-BG': {
     lang: 'bg-BG',
     label: 'Български език',
     icon: '🇧🇬',
     title: 'език',
     memo: '',
   },
   'bn-BD': {
     lang: 'bn-BD',
     label: 'বাংলা',
     icon: '🇧🇩',
     title: 'ভাষা',
     memo: '',
   },
   'ca-ES': {
     lang: 'ca-ES',
     label: 'Catalá',
     icon: '🇨🇦',
     title: 'llengua',
     memo: '',
   },
   'cs-CZ': {
     lang: 'cs-CZ',
     label: 'Čeština',
     icon: '🇨🇿',
     title: 'Jazyk',
     memo: '',
   },
   'da-DK': {
     lang: 'da-DK',
     label: 'Dansk',
     icon: '🇩🇰',
     title: 'Sprog',
     memo: '',
   },
   'de-DE': {
     lang: 'de-DE',
     label: 'Deutsch',
     icon: '🇩🇪',
     title: 'Sprache',
     memo: '',
   },
   'el-GR': {
     lang: 'el-GR',
     label: 'Ελληνικά',
     icon: '🇬🇷',
     title: 'Γλώσσα',
     memo: '',
   },
   'en-GB': {
     lang: 'en-GB',
     label: 'English',
     icon: '🇬🇧',
     title: 'Language',
     memo: '',
   },
   'en-US': {
     lang: 'en-US',
     label: 'English',
     icon: '🇺🇸',
     title: 'Language',
     memo: '',
   },
   'es-ES': {
     lang: 'es-ES',
     label: 'Español',
     icon: '🇪🇸',
     title: 'Idioma',
     memo: '',
   },
   'et-EE': {
     lang: 'et-EE',
     label: 'Eesti',
     icon: '🇪🇪',
     title: 'Keel',
     memo: '',
   },
   'fa-IR': {
     lang: 'fa-IR',
     label: 'فارسی',
     icon: '🇮🇷',
     title: 'زبان',
     memo: '',
   },
   'fi-FI': {
     lang: 'fi-FI',
     label: 'Suomi',
     icon: '🇫🇮',
     title: 'Kieli',
     memo: '',
   },
   'fr-BE': {
     lang: 'fr-BE',
     label: 'Français',
     icon: '🇧🇪',
     title: 'Langue',
     memo: '',
   },
   'fr-FR': {
     lang: 'fr-FR',
     label: 'Français',
     icon: '🇫🇷',
     title: 'Langue',
     memo: '',
   },
   'ga-IE': {
     lang: 'ga-IE',
     label: 'Gaeilge',
     icon: '🇮🇪',
     title: 'Teanga',
     memo: '',
   },
   'he-IL': {
     lang: 'he-IL',
     label: 'עברית',
     icon: '🇮🇱',
     title: 'שפה',
     memo: '',
   },
   'hi-IN': {
     lang: 'hi-IN',
     label: 'हिन्दी, हिंदी',
     icon: '🇮🇳',
     title: 'भाषा: हिन्दी',
     memo: '',
   },
   'hr-HR': {
     lang: 'hr-HR',
     label: 'Hrvatski jezik',
     icon: '🇭🇷',
     title: 'Jezik',
     memo: '',
   },
   'hu-HU': {
     lang: 'hu-HU',
     label: 'Magyar',
     icon: '🇭🇺',
     title: 'Nyelv',
     memo: '',
   },
   'hy-AM': {
     lang: 'hu-HU',
     label: 'Հայերեն',
     icon: '🇦🇲',
     title: 'Լեզու',
     memo: '',
   },
   'id-ID': {
     lang: 'id-ID',
     label: 'Bahasa Indonesia',
     icon: '🇮🇩',
     title: 'Bahasa',
     memo: '',
   },
   'it-IT': {
     lang: 'it-IT',
     label: 'Italiano',
     icon: '🇮🇹',
     title: 'Linguaggio',
     memo: '',
   },
   'is-IS': {
     lang: 'is-IS',
     label: 'Íslenska',
     icon: '🇮🇸',
     title: 'Tungumál',
     memo: '',
   },
   'ja-JP': {
     lang: 'ja-JP',
     label: '日本語',
     icon: '🇯🇵',
     title: '言語',
     memo: '',
   },
   'ku-IQ': {
     lang: 'ku-IQ',
     label: 'کوردی',
     icon: '🇮🇶',
     title: 'Ziman',
     memo: '',
   },
   'kn-IN': {
     lang: 'zh-TW',
     label: 'ಕನ್ನಡ',
     icon: '🇮🇳',
     title: 'ಭಾಷೆ',
     memo: '',
   },
   'ko-KR': {
     lang: 'ko-KR',
     label: '한국어',
     icon: '🇰🇷',
     title: '언어',
     memo: '',
   },
   'lv-LV': {
     lang: 'lv-LV',
     label: 'Latviešu valoda',
     icon: '🇱🇮',
     title: 'Kalba',
     memo: '',
   },
   'mk-MK': {
     lang: 'mk-MK',
     label: 'македонски јазик',
     icon: '🇲🇰',
     title: 'Јазик',
     memo: '',
   },
   'mn-MN': {
     lang: 'mn-MN',
     label: 'Монгол хэл',
     icon: '🇲🇳',
     title: 'Хэл',
     memo: '',
   },
   'ms-MY': {
     lang: 'ms-MY',
     label: 'بهاس ملايو‎',
     icon: '🇲🇾',
     title: 'Bahasa',
     memo: '',
   },
   'nb-NO': {
     lang: 'nb-NO',
     label: 'Norsk',
     icon: '🇳🇴',
     title: 'Språk',
     memo: '',
   },
   'ne-NP': {
     lang: 'ne-NP',
     label: 'नेपाली',
     icon: '🇳🇵',
     title: 'भाषा',
     memo: '',
   },
   'nl-BE': {
     lang: 'nl-BE',
     label: 'Vlaams',
     icon: '🇧🇪',
     title: 'Taal',
     memo: '',
   },
   'nl-NL': {
     lang: 'nl-NL',
     label: 'Vlaams',
     icon: '🇳🇱',
     title: 'Taal',
     memo: '',
   },
   'pl-PL': {
     lang: 'pl-PL',
     label: 'Polski',
     icon: '🇵🇱',
     title: 'Język',
     memo: '波兰语',
   },
   'pt-BR': {
     lang: 'pt-BR',
     label: 'Português',
     icon: '🇧🇷',
     title: 'Idiomas',
     memo: '葡萄牙语',
   },
   'pt-PT': {
     lang: 'pt-PT',
     label: 'Português',
     icon: '🇵🇹',
     title: 'Idiomas',
     memo: '葡萄牙语',
   },
   'ro-RO': {
     lang: 'ro-RO',
     label: 'Română',
     icon: '🇷🇴',
     title: 'Limba',
     memo: '罗马尼亚',
   },
   'ru-RU': {
     lang: 'ru-RU',
     label: 'Русский',
     icon: '🇷🇺',
     title: 'язык',
     memo: '俄语',
   },
   'sk-SK': {
     lang: 'sk-SK',
     label: 'Slovenčina',
     icon: '🇸🇰',
     title: 'Jazyk',
     memo: '斯洛伐克语',
   },
   'sr-RS': {
     lang: 'sr-RS',
     label: 'српски језик',
     icon: '🇸🇷',
     title: 'Језик',
     memo: '塞尔维亚语',
   },
   'sl-SI': {
     lang: 'sl-SI',
     label: 'Slovenščina',
     icon: '🇸🇱',
     title: 'Jezik',
     memo: '斯洛文尼亚',
   },
   'sv-SE': {
     lang: 'sv-SE',
     label: 'Svenska',
     icon: '🇸🇪',
     title: 'Språk',
     memo: '瑞典',
   },
   'ta-IN': {
     lang: 'ta-IN',
     label: 'தமிழ்',
     icon: '🇮🇳',
     title: 'மொழி',
     memo: '泰米尔语',
   },
   'th-TH': {
     lang: 'th-TH',
     label: 'ไทย',
     icon: '🇹🇭',
     title: 'ภาษา',
     memo: '泰国',
   },
   'tr-TR': {
     lang: 'tr-TR',
     label: 'Türkçe',
     icon: '🇹🇷',
     title: 'Dil',
     memo: '土耳其',
   },
   'uk-UA': {
     lang: 'uk-UA',
     label: 'Українська',
     icon: '🇺🇰',
     title: 'Мова',
     memo: '乌克兰',
   },
   'vi-VN': {
     lang: 'vi-VN',
     label: 'Tiếng Việt',
     icon: '🇻🇳',
     title: 'Ngôn ngữ',
     memo: '越南语',
   },
   'zh-CN': {
     lang: 'zh-CN',
     label: '简体中文',
     icon: '🇨🇳',
     title: '语言',
     memo: '简体中文',
   },
   'zh-TW': {
     lang: 'zh-TW',
     label: '繁體中文',
     icon: '🇭🇰',
     title: '語言',
     memo: '繁體中文',
   },
 };
  */
function handelOptions(options: { from: string; to: string }, separator: string): any {
  if (separator) {
    return {
      ...options,
      from: options.from.replace(separator, '-'),
      to: options.to.replace(separator, '-'),
    };
  }
  return options;
}
async function translate(word: string, options: { from: string; to: string }, separator: string) {
  // 和umi库的SelectLang对标 import {SelectLang} from 'umi';
  const defaultLangUConfigMap: { [key: string]: any } = {
    'zh-CN': { memo: '中文', keyYouDao: 'zh-CHS' },
    'zh-TW': { memo: '中文繁体', keyYouDao: 'zh-CHT' },
    'en-GB': { memo: '英文', keyYouDao: 'en' },
    'en-US': { memo: '英文', keyYouDao: 'en' },
    'ja-JP': { memo: '日文', keyYouDao: 'ja' },
    'ko-KR': { memo: '韩文', keyYouDao: 'ko' },
    'fr-BE': { memo: '法文', keyYouDao: 'fr' },
    'fr-FR': { memo: '法文', keyYouDao: 'fr' },
    'es-ES': { memo: '西班牙文', keyYouDao: 'es' },
    'pt-BR': { memo: '葡萄牙文', keyYouDao: 'pt' },
    'pt-PT': { memo: '葡萄牙文', keyYouDao: 'pt' },
    'it-IT': { memo: '意大利文', keyYouDao: 'it' },
    'ru-RU': { memo: '俄文', keyYouDao: 'ru' },
    'vi-VN': { memo: '越南文', keyYouDao: 'vi' },
    'de-DE': { memo: '德文', keyYouDao: 'de' },
    'ar-EG': { memo: '阿拉伯文', keyYouDao: 'ar' },
    'id-ID': { memo: '印尼文', keyYouDao: 'id' },
    // '': { memo: '南非荷兰语', keyYouDao: 'af' },
    // '': { memo: '波斯尼亚语', keyYouDao: 'bs' },
    'bg-BG': { memo: '保加利亚语', keyYouDao: 'bg' },
    // '': { memo: '粤语', keyYouDao: 'yue' },
    // '': { memo: '加泰隆语', keyYouDao: 'ca' },
    'hr-HR': { memo: '克罗地亚语', keyYouDao: 'hr' },
    'cs-CZ': { memo: '捷克语', keyYouDao: 'cs' },
    'da-DK': { memo: '丹麦语', keyYouDao: 'da' },
    'nl-BE': { memo: '荷兰语', keyYouDao: 'nl' },
    'nl-NL': { memo: '荷兰语', keyYouDao: 'nl' },
    'et-EE': { memo: '爱沙尼亚语', keyYouDao: 'et' },
    // '': { memo: '斐济语', keyYouDao: 'fj' },
    'fi-FI': { memo: '芬兰语', keyYouDao: 'fi' },
    'el-GR': { memo: '希腊语', keyYouDao: 'el' },
    // '': { memo: '海地克里奥尔语', keyYouDao: 'ht' },
    'he-IL': { memo: '希伯来语', keyYouDao: 'he' },
    'hi-IN': { memo: '印地语', keyYouDao: 'hi' },
    // '': { memo: '白苗语', keyYouDao: 'mww' },
    'hu-HU': { memo: '匈牙利语', keyYouDao: 'hu' },
    // '': { memo: '斯瓦希里语', keyYouDao: 'sw' },
    // '': { memo: '克林贡语', keyYouDao: 'tlh' },
    'lv-LV': { memo: '拉脱维亚语', keyYouDao: 'lv' },
    // '': { memo: '立陶宛语', keyYouDao: 'lt' },
    'ms-MY': { memo: '马来语', keyYouDao: 'ms' },
    // '': { memo: '马耳他语', keyYouDao: 'mt' },
    'nb-NO': { memo: '挪威语', keyYouDao: 'no' },
    'fa-IR': { memo: '波斯语', keyYouDao: 'fa' },
    'pl-PL': { memo: '波兰语', keyYouDao: 'pl' },
    // '': { memo: '克雷塔罗奥托米语', keyYouDao: 'otq' },
    'ro-RO': { memo: '罗马尼亚语', keyYouDao: 'ro' },
    'sr-RS': { memo: '塞尔维亚语(西里尔文)', keyYouDao: 'sr-Cyrl' },
    // '': { memo: '塞尔维亚语(拉丁文)', keyYouDao: 'sr-Latn' },
    'sk-SK': { memo: '斯洛伐克语', keyYouDao: 'sk' },
    'sl-SI': { memo: '斯洛文尼亚语', keyYouDao: 'sl' },
    'sv-SE': { memo: '瑞典语', keyYouDao: 'sv' },
    // '': { memo: '塔希提语', keyYouDao: 'ty' },
    'th-TH': { memo: '泰语', keyYouDao: 'th' },
    // '': { memo: '汤加语', keyYouDao: 'to' },
    'tr-TR': { memo: '土耳其语', keyYouDao: 'tr' },
    'uk-UA': { memo: '乌克兰语', keyYouDao: 'uk' },
    // '': { memo: '乌尔都语', keyYouDao: 'ur' },
    // '': { memo: '威尔士语', keyYouDao: 'cy' },
    // '': { memo: '尤卡坦玛雅语', keyYouDao: 'yua' },
    // '': { memo: '阿尔巴尼亚语', keyYouDao: 'sq' },
    // '': { memo: '阿姆哈拉语', keyYouDao: 'am' },
    'hy-AM': { memo: '亚美尼亚语', keyYouDao: 'hy' },
    'az-AZ': { memo: '阿塞拜疆语', keyYouDao: 'az' },
    'bn-BD': { memo: '孟加拉语', keyYouDao: 'bn' },
    // '': { memo: '巴斯克语', keyYouDao: 'eu' },
    // '': { memo: '白俄罗斯语', keyYouDao: 'be' },
    // '': { memo: '宿务语', keyYouDao: 'ceb' },
    // '': { memo: '科西嘉语', keyYouDao: 'co' },
    // '': { memo: '世界语', keyYouDao: 'eo' },
    // '': { memo: '菲律宾语', keyYouDao: 'tl' },
    // '': { memo: '弗里西语', keyYouDao: 'fy' },
    'ca-ES': { memo: '加利西亚语', keyYouDao: 'gl' },
    // '': { memo: '格鲁吉亚语', keyYouDao: 'ka' },
    // '': { memo: '古吉拉特语', keyYouDao: 'gu' },
    // '': { memo: '豪萨语', keyYouDao: 'ha' },
    // '': { memo: '夏威夷语', keyYouDao: 'haw' },
    'is-IS': { memo: '冰岛语', keyYouDao: 'is' },
    // '': { memo: '伊博语', keyYouDao: 'ig' },
    'ga-IE': { memo: '爱尔兰语', keyYouDao: 'ga' },
    // '': { memo: '爪哇语', keyYouDao: 'jw' },
    'kn-IN': { memo: '卡纳达语', keyYouDao: 'kn' },
    // '': { memo: '哈萨克语', keyYouDao: 'kk' },
    // '': { memo: '高棉语', keyYouDao: 'km' },
    'ku-IQ': { memo: '库尔德语', keyYouDao: 'ku' },
    // '': { memo: '柯尔克孜语', keyYouDao: 'ky' },
    // '': { memo: '老挝语', keyYouDao: 'lo' },
    // '': { memo: '拉丁语', keyYouDao: 'la' },
    // '': { memo: '卢森堡语', keyYouDao: 'lb' },
    'mk-MK': { memo: '马其顿语', keyYouDao: 'mk' },
    // '': { memo: '马尔加什语', keyYouDao: 'mg' },
    // '': { memo: '马拉雅拉姆语', keyYouDao: 'ml' },
    // '': { memo: '毛利语', keyYouDao: 'mi' },
    // '': { memo: '马拉地语', keyYouDao: 'mr' },
    'mn-MN': { memo: '蒙古语', keyYouDao: 'mn' },
    // '': { memo: '缅甸语', keyYouDao: 'my' },
    'ne-NP': { memo: '尼泊尔语', keyYouDao: 'ne' },
    // '': { memo: '齐切瓦语', keyYouDao: 'ny' },
    // '': { memo: '普什图语', keyYouDao: 'ps' },
    // '': { memo: '旁遮普语', keyYouDao: 'pa' },
    // '': { memo: '萨摩亚语', keyYouDao: 'sm' },
    // '': { memo: '苏格兰盖尔语', keyYouDao: 'gd' },
    // '': { memo: '塞索托语', keyYouDao: 'st' },
    // '': { memo: '修纳语', keyYouDao: 'sn' },
    // '': { memo: '信德语', keyYouDao: 'sd' },
    // '': { memo: '僧伽罗语', keyYouDao: 'si' },
    // '': { memo: '索马里语', keyYouDao: 'so' },
    // '': { memo: '巽他语', keyYouDao: 'su' },
    // '': { memo: '塔吉克语', keyYouDao: 'tg' },
    'ta-IN': { memo: '泰米尔语', keyYouDao: 'ta' },
    // '': { memo: '泰卢固语', keyYouDao: 'te' },
    // '': { memo: '乌兹别克语', keyYouDao: 'uz' },
    // '': { memo: '南非科萨语', keyYouDao: 'xh' },
    // '': { memo: '意第绪语', keyYouDao: 'yi' },
    // '': { memo: '约鲁巴语', keyYouDao: 'yo' },
    // '': { memo: '南非祖鲁语', keyYouDao: 'zu' },
  };
  const {
    // 申请的key和secret
    Key = '5721fbb81d578037',
    Secret = 'Kzz4NP0B9rxjncsvyyLXZWz70AvxpGZB',
    baseUrl = 'http://openapi.youdao.com/api',
    // 参数
    from = 'zh-CHS',
    to = 'EN',
  } = handelOptions(options, separator);
  // 随机数
  const salt = Math.random();
  // 生成签名
  const sign = md5(Key + word + salt + Secret);
  const params = {
    from: defaultLangUConfigMap[from]?.keyYouDao,
    to: defaultLangUConfigMap[to]?.keyYouDao,
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

export default translate;
