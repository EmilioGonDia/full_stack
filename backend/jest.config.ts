import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  roots: ['<rootDir>/test'],

  testMatch: [
    '<rootDir>/test/**/*.ts',
    '<rootDir>/test/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  clearMocks: true,

  verbose: true,

  detectOpenHandles: true,
};

export default config;