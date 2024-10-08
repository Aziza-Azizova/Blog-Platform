/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  verbose: true,
  forceExit: true,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};