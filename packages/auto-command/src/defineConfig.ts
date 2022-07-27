import { TranslateConfig } from './translate';
import { FastElectronConfig } from './fastElectron';

export type ConfigType = { translate: TranslateConfig; fastElectron: FastElectronConfig };

export function defineConfig(config: ConfigType): ConfigType {
  return config;
}
