/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  ignorePatterns: ["**/*.config.js", "**/types-generated.ts", "**/$path.ts"],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    es2022: true,
  },

  extends: [
    "next/core-web-vitals",
    "plugin:unicorn/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:prettier/recommended",
  ],

  plugins: ["unicorn"],

  rules: {
    "eslint-comments/require-description": "error",
    "eslint-comments/no-unused-enable": "error",
    "unicorn/no-null": "off",
    "unicorn/no-keyword-prefix": "warn",
    "unicorn/no-array-reduce": "warn",
    "unicorn/prevent-abbreviations": "warn",
    "unicorn/no-array-for-each": "warn",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
  },

  overrides: [
    {
      files: [".*rc.js", "scripts/*.js"],
      rules: {
        "unicorn/prefer-module": "off",
      },
    },
    {
      files: ["scripts/*.ts"],
      rules: {
        "unicorn/prefer-top-level-await": "off",
      },
    },
    {
      files: ["test/**/*.tsx?", "**/*.(test|spec).tsx?"],
      extends: ["plugin:jest/recommended"],
    },
  ],
};
