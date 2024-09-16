module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
   transform: {
     '^.+\.(ts|tsx)$': 'ts-jest',
   },
   testMatch: ['**/__tests__/**/*.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
   collectCoverage: true,
   collectCoverageFrom: ['/*.{ts,tsx}', '!/node_modules/**'],
   moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
 };