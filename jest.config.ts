import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
  },
};

export default config;
