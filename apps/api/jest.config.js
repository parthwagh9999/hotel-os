module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@hotel-os/shared$': '<rootDir>/../../../packages/shared/src/index.ts',
    '^@hotel-os/database$': '<rootDir>/../../../packages/database/src/index.ts',
  },
  testEnvironment: 'node',
};

