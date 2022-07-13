import { TranslateConfig } from './translate/index';

export type ConfigType = { translate: TranslateConfig };

export function defineConfig(config: ConfigType): ConfigType {
  return config;
}
