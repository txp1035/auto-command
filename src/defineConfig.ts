import type { TranslateConfig } from '@txpjs/translate';
import type { FastElectronConfig } from './fastElectron';

export type ConfigType = { translate?: TranslateConfig; fastElectron?: FastElectronConfig };

export function defineConfig(config: ConfigType): ConfigType {
  return config;
}
