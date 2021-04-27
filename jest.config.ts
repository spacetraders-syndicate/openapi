import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'test',
  moduleFileExtensions: ['js', 'ts'],
  // setupFiles: ['<rootDir>/test/setupTests.ts', '<rootDir>/test/outputsToEnv.ts'],
  // setupFilesAfterEnv: ['<rootDir>/test/setupAfterEnv.ts'],
  testPathIgnorePatterns: ['/node_modules', '/dist', 'jest.*.ts'],
  coveragePathIgnorePatterns: ['src/openapi'],
  displayName: 'contract',
  testMatch: ['**/*.test.ts']
};

export default config;
