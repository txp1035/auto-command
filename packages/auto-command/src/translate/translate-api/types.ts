export interface GoogleConfig {
  proxy: {
    host: string;
    port: number;
  };
}
export interface YouDaoConfig {
  key: string;
  secret: string;
}
export interface Language {
  from: string;
  to: string;
}
export type Translator = 'google' | 'youdao';
export interface ApiOptions extends ApiPartOptions {
  language: Language;
}
export interface ApiPartOptions {
  translatorType?: Translator;
  google?: GoogleConfig;
  youdao?: YouDaoConfig;
}
