import type { ITranslateConfig } from './translate/index';

export type ConfigType = { translate: ITranslateConfig };

export function defineConfig(config: ConfigType): ConfigType {
  return config;
}