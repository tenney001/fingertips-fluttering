import type { Config } from 'jest';

const config: Config = {
  testMatch: ['**/tests/e2e/**/*.test.ts'], // 只运行E2E测试
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.ts'],
  testEnvironment: 'node',
};

export default config;
