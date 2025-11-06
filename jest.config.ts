import type { Config } from 'jest';

const config: Config = {
  testMatch: ['**/tests/e2e/**/*.test.ts', '**/tests/performance/**/*.test.ts'], // 运行E2E和性能测试
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.ts'],
  testEnvironment: 'node',
};

export default config;
