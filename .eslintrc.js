/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  ignorePatterns: ["cypress/**/*", "**/*.config.js"],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    es2022: true,
  },

  extends: ["next/core-web-vitals", "plugin:unicorn/all", "plugin:prettier/recommended"],

  plugins: ["unicorn"],

  overrides: [
    {
      files: [".*rc.js"],
      rules: {
        "unicorn/prefer-module": "off",
      },
    },
    {
      files: ["test/**/*.tsx?", "**/*.(test|spec).tsx?"],
      extends: ["plugin:jest/recommended"],
    },
  ],
};
