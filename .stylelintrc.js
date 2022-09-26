/** @type {import("stylelint").Config} */
module.exports = {
  plugins: ["stylelint-prettier"],
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "prettier/prettier": true,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply"],
      },
    ],
    "selector-class-pattern": null,
  },
  overrides: [
    {
      files: ["**/*.scss"],
      rules: {
        "scss/at-rule-no-unknown": [
          true,
          {
            ignoreAtRules: ["tailwind"],
          },
        ],
        "no-invalid-position-at-import-rule": null,
        "scss/no-global-function-names": null,
        "at-rule-empty-line-before": [
          "always",
          {
            ignore: ["inside-block"],
            ignoreAtRules: ["tailwind", "apply"],
          },
        ],
        "declaration-empty-line-before": "never",
      },
    },
  ],
};
