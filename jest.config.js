/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testTimeout: 20000,
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};

module.exports = config;
