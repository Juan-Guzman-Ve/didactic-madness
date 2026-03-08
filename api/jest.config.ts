import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  // Integration tests timeout (database operations can be slow)
  testTimeout: 30000,
  // Run tests serially to avoid database conflicts
  maxWorkers: 1,
  // Setup file to run before tests
  setupFilesAfterEnv: ['<rootDir>/test/setup/jest-setup.ts'],
  // Verbose output
  verbose: true,
};

export default config;
