const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",


  // tsconfig.jsonのパスエイリアスを継承
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  projects: [
    {
      testEnvironment: "node",
      testMatch: ["**/*.server.test.ts"],
    },
    {
      testEnvironment: "jsdom",
      testMatch: ["**/*.client.test.ts"],
    },
  ],
};
