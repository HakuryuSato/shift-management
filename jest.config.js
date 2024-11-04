const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require("./tsconfig");
const path = require('path');

const commonConfig = {
  preset: "ts-jest",
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFiles: [path.resolve(__dirname, 'jest.setup.js')],
};

module.exports = {
  projects: [
    {
      ...commonConfig,
      displayName: 'server',
      testEnvironment: "node",
      testMatch: ["**/*.server.test.ts"],
    },
    {
      ...commonConfig,
      displayName: 'client',
      testEnvironment: "jsdom",
      testMatch: ["**/*.client.test.ts", "**/*.client.test.tsx"],
    },
  ],
};
