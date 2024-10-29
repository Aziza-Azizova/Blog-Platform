import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
    { ignores: ["node_modules/*", ".git/", "dist/**"] },
    { files: ["**/*.ts"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },

        plugins: {
            "@typescript-eslint/eslint-plugin": tsEslintPlugin,
            prettier: eslintPluginPrettier,
        },
    },
];
