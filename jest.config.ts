import { TestConfig, createTestConfig } from '@txpjs/qa';

export default {
  ...createTestConfig(),
  testMatch: ['<rootDir>/packages/*/src/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/packages/.+/compiled', '<rootDir>/packages/.+/fixtures'],
  transformIgnorePatterns: ['/node_modules/', '/compiled/'],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/examples/**/*.{js,jsx,ts,tsx}',
    '!**/compiled/**/*.{js,jsx}',
    '!**/fixtures/**/*.*',
  ],
} as TestConfig.InitialOptions;
