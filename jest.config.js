/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
    verbose: true,
    forceExit: true,
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
};
