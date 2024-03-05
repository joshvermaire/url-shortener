/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
};

export default config;
