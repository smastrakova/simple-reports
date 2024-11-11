const jestConfig = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/test/tsconfig.json'
      }
    ]
  },
  testMatch: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  testTimeout: 40_000,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '**/src/**/*.js',
    '!**/node_modules/**'
  ],
  maxWorkers: 3
}

export default jestConfig
